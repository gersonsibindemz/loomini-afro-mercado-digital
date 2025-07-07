
-- Primeiro, vamos garantir que o tipo user_role existe e está acessível
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('comprador', 'criador');

-- Remover o trigger e função existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recriar a função handle_new_user com tratamento de erro melhorado e logs detalhados
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value user_role;
BEGIN
  -- Log para debug
  RAISE LOG 'Starting handle_new_user for user: %', NEW.id;
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  
  -- Determinar o role com fallback para 'comprador'
  IF NEW.raw_user_meta_data ->> 'role' = 'criador' THEN
    user_role_value := 'criador'::user_role;
  ELSE
    user_role_value := 'comprador'::user_role;
  END IF;
  
  RAISE LOG 'Determined role: %', user_role_value;
  
  -- Tentar inserir o usuário com tratamento de erro
  BEGIN
    INSERT INTO public.users (id, first_name, last_name, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
      COALESCE(NEW.email, ''),
      user_role_value
    );
    
    RAISE LOG 'Successfully inserted user: %', NEW.id;
    
  EXCEPTION
    WHEN others THEN
      RAISE LOG 'Error inserting user %: % - %', NEW.id, SQLSTATE, SQLERRM;
      -- Re-raise o erro para que seja visível no log de auth
      RAISE;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar se a tabela users tem a estrutura correta
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'comprador'::user_role;

-- Garantir que o enum está acessível
GRANT USAGE ON TYPE user_role TO authenticated;
GRANT USAGE ON TYPE user_role TO anon;
