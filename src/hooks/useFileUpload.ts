
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/components/NotificationSystem';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const uploadFile = async (file: File, folder: string = 'documents'): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado');

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('creator-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('creator-files')
        .getPublicUrl(fileName);

      addNotification({
        type: 'success',
        title: 'Upload concluído',
        message: 'Arquivo enviado com sucesso!'
      });

      return data.publicUrl;
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro no upload',
        message: error.message || 'Não foi possível fazer upload do arquivo'
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading
  };
};
