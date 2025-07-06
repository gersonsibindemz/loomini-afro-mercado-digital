import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const signUpUser = async (
  email: string, 
  password: string, 
  userData: { firstName: string; lastName: string; isCreator: boolean }
) => {
  console.log('Starting signup process for:', email);
  console.log('User data received:', userData);
  
  // Convert isCreator boolean to role string
  const role = userData.isCreator ? 'criador' : 'comprador';
  console.log('Mapped role:', role);
  
  const signUpData = {
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        first_name: userData.firstName.trim(),
        last_name: userData.lastName.trim(),
        role: role
      }
    }
  };
  
  console.log('Sending signup data to Supabase:', signUpData);
  
  const { data, error } = await supabase.auth.signUp(signUpData);

  if (error) {
    console.error('Signup error:', error);
    
    // Mensagens de erro mais específicas
    if (error.message.includes('already registered')) {
      throw new Error('Este email já está registrado');
    } else if (error.message.includes('weak password')) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    } else if (error.message.includes('invalid email')) {
      throw new Error('Email inválido');
    } else if (error.message.includes('Database error saving new user')) {
      throw new Error('Erro interno do servidor. Tente novamente em alguns minutos.');
    } else if (error.message.includes('user_role')) {
      throw new Error('Erro de configuração do sistema. Contate o suporte.');
    }
    
    throw new Error(`Erro ao criar conta: ${error.message}`);
  }

  console.log('Signup successful, user:', data.user);
  console.log('User created with role:', data.user?.user_metadata?.role);
  return data;
};

export const signInUser = async (email: string, password: string) => {
  console.log('Starting signin process for:', email);
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Signin error:', error);
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Email ou senha incorretos');
    } else if (error.message.includes('Email not confirmed')) {
      throw new Error('Confirme seu email antes de fazer login');
    }
    throw new Error('Erro ao fazer login. Tente novamente');
  }

  console.log('Signin successful');
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetUserPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};
