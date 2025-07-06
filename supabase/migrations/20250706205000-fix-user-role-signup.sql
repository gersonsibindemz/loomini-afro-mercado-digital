
-- Verificar e corrigir o problema do signup
-- Primeiro, vamos limpar qualquer problema existente

-- Remover o trigger temporariamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover a função temporariamente
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Garantir que o tipo user_role existe corretamente
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('comprador', 'criador');

-- Recriar a função handle_new_user com tratamento de erro melhorado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.users (id, first_name, last_name, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
      NEW.email,
      CASE 
        WHEN NEW.raw_user_meta_data ->> 'role' = 'criador' THEN 'criador'::user_role
        ELSE 'comprador'::user_role
      END
    );
  EXCEPTION
    WHEN others THEN
      RAISE LOG 'Error in handle_new_user: %', SQLERRM;
      RAISE;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
