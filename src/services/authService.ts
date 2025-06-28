
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw error;
    }

    // Convert social_links from Json to Record<string, string>
    const socialLinks = data.social_links as any;
    const convertedSocialLinks: Record<string, string> = {};
    
    if (socialLinks && typeof socialLinks === 'object') {
      Object.keys(socialLinks).forEach(key => {
        if (typeof socialLinks[key] === 'string') {
          convertedSocialLinks[key] = socialLinks[key];
        }
      });
    }

    return {
      ...data,
      social_links: convertedSocialLinks
    };
  } catch (error) {
    console.error('Erro inesperado ao buscar perfil:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
};

export const uploadUserAvatar = async (userId: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('user-avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('user-avatars')
    .getPublicUrl(fileName);

  return data.publicUrl;
};
