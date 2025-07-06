
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/components/NotificationSystem';
import { UserProfile, AuthContextType } from '@/types/auth';
import { signUpUser, signInUser, signOutUser, resetUserPassword } from '@/services/authOperations';
import { useProfileManagement } from '@/hooks/useProfileManagement';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();
  
  const {
    profile,
    setProfile,
    loadUserProfile,
    updateProfile: updateUserProfile,
    switchRole: switchUserRole,
    uploadAvatar: uploadUserAvatar
  } = useProfileManagement();

  useEffect(() => {
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && event === 'SIGNED_IN') {
        console.log('User signed in, loading profile...');
        setTimeout(() => {
          loadUserProfile(session.user.id);
        }, 500);
      } else if (!session) {
        setProfile(null);
      }
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadUserProfile, setProfile]);

  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string; isCreator: boolean }) => {
    try {
      console.log('Initiating signup with data:', { email, userData });
      await signUpUser(email, password, userData);
      console.log('SignUp completed successfully');
      
      addNotification({
        type: 'success',
        title: 'Conta criada com sucesso!',
        message: 'Verificação de email pode ser necessária. Aguarde o redirecionamento...'
      });
    } catch (error: any) {
      console.error('Signup error in context:', error);
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
      await signInUser(email, password);
      addNotification({
        type: 'success',
        title: 'Login realizado!',
        message: 'Bem-vindo de volta!'
      });
    } catch (error: any) {
      console.error('Login error:', error);
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
      await signOutUser();
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
      await resetUserPassword(email);
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
    await updateUserProfile(user.id, updates);
  };

  const switchRole = async (newRole: 'comprador' | 'criador') => {
    if (!user) throw new Error('Usuário não autenticado');
    await switchUserRole(user.id, newRole);
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado');
    return await uploadUserAvatar(user.id, file);
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

export default AuthProvider;
