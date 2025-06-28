
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/components/NotificationSystem';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'comprador' | 'criador';
  avatar_url?: string;
  bio?: string;
  social_links?: Record<string, string>;
  portfolio_url?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string; isCreator: boolean }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  switchRole: (newRole: 'comprador' | 'criador') => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        addNotification({
          type: 'error',
          title: 'Erro ao carregar perfil',
          message: 'Não foi possível carregar os dados do usuário'
        });
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Erro inesperado ao buscar perfil:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string; isCreator: boolean }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.isCreator ? 'criador' : 'comprador'
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Este email já está registrado');
        } else if (error.message.includes('weak password')) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        } else if (error.message.includes('invalid email')) {
          throw new Error('Email inválido');
        }
        throw new Error('Erro ao criar conta. Tente novamente');
      }

      addNotification({
        type: 'success',
        title: 'Conta criada com sucesso!',
        message: 'Verifique seu email para confirmar a conta'
      });

      // Redirect to appropriate dashboard after successful signup
      const dashboardRoute = userData.isCreator ? '/painel-criador' : '/painel-comprador';
      setTimeout(() => {
        window.location.href = dashboardRoute;
      }, 2000);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro no cadastro',
        message: error.message
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Confirme seu email antes de fazer login');
        }
        throw new Error('Erro ao fazer login. Tente novamente');
      }

      addNotification({
        type: 'success',
        title: 'Login realizado!',
        message: 'Bem-vindo de volta!'
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro no login',
        message: error.message
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Logout realizado',
        message: 'Até logo!'
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro ao sair',
        message: 'Erro ao fazer logout'
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Email enviado!',
        message: 'Verifique sua caixa de entrada para redefinir a senha'
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro ao enviar email',
        message: 'Não foi possível enviar o email de recuperação'
      });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile(user.id);
      addNotification({
        type: 'success',
        title: 'Perfil atualizado',
        message: 'Dados salvos com sucesso!'
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro ao salvar',
        message: 'Não foi possível atualizar o perfil'
      });
      throw error;
    }
  };

  const switchRole = async (newRole: 'comprador' | 'criador') => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile(user.id);
      addNotification({
        type: 'success',
        title: 'Papel alterado!',
        message: `Agora você é um ${newRole}`
      });

      // Redirect to appropriate dashboard
      const dashboardRoute = newRole === 'criador' ? '/painel-criador' : '/painel-comprador';
      setTimeout(() => {
        window.location.href = dashboardRoute;
      }, 1500);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro ao alterar papel',
        message: 'Não foi possível alterar seu papel'
      });
      throw error;
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(fileName);

      // Update user profile with new avatar URL
      await updateProfile({ avatar_url: data.publicUrl });

      return data.publicUrl;
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro no upload',
        message: 'Não foi possível fazer upload da imagem'
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    switchRole,
    uploadAvatar
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
