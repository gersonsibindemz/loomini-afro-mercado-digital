
import { useState } from 'react';
import { UserProfile } from '@/types/auth';
import { fetchUserProfile, updateUserProfile, uploadUserAvatar } from '@/services/authService';
import { useNotifications } from '@/components/NotificationSystem';

export const useProfileManagement = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { addNotification } = useNotifications();

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);
      const profileData = await fetchUserProfile(userId);
      if (profileData) {
        console.log('Profile loaded:', profileData);
        setProfile(profileData);
        
        // Redirect to appropriate dashboard after profile is loaded
        const dashboardRoute = profileData.role === 'criador' ? '/painel-criador' : '/painel-comprador';
        console.log('Redirecting to:', dashboardRoute);
        
        // Use proper timeout instead of string-based setTimeout
        window.setTimeout(() => {
          window.location.href = dashboardRoute;
        }, 1000);
      } else {
        console.log('No profile found for user');
        addNotification({
          type: 'error',
          title: 'Erro ao carregar perfil',
          message: 'Não foi possível carregar os dados do usuário'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      addNotification({
        type: 'error',
        title: 'Erro ao carregar perfil',
        message: 'Não foi possível carregar os dados do usuário'
      });
    }
  };

  const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      await updateUserProfile(userId, updates);
      await loadUserProfile(userId);
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

  const switchRole = async (userId: string, newRole: 'comprador' | 'criador') => {
    try {
      await updateUserProfile(userId, { role: newRole });
      await loadUserProfile(userId);
      addNotification({
        type: 'success',
        title: 'Papel alterado!',
        message: `Agora você é um ${newRole}`
      });

      // Redirect to appropriate dashboard
      const dashboardRoute = newRole === 'criador' ? '/creator/dashboard' : '/painel-comprador';
      
      // Use proper timeout instead of string-based setTimeout
      window.setTimeout(() => {
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

  const uploadAvatar = async (userId: string, file: File): Promise<string> => {
    try {
      const avatarUrl = await uploadUserAvatar(userId, file);
      await updateProfile(userId, { avatar_url: avatarUrl });
      return avatarUrl;
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro no upload',
        message: 'Não foi possível fazer upload da imagem'
      });
      throw error;
    }
  };

  return {
    profile,
    setProfile,
    loadUserProfile,
    updateProfile,
    switchRole,
    uploadAvatar
  };
};
