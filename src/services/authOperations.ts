import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const signUpUser = async (
  email: string, 
  password: string, 
  userData: { firstName: string; lastName: string; isCreator: boolean }
) => {
  console.log('Starting signup process for:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.isCreator ? 'criador' : 'comprador'
      }
    }
  });

  if (error) {
    console.error('Signup error:', error);
    if (error.message.includes('already registered')) {
      throw new Error('Este email já está registrado');
    } else if (error.message.includes('weak password')) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    } else if (error.message.includes('invalid email')) {
      throw new Error('Email inválido');
    }
    throw new Error('Erro ao criar conta. Tente novamente');
  }

  console.log('Signup successful, user:', data.user);
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
