
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/components/NotificationSystem';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { addNotification } = useNotifications();

  const uploadImage = async (file: File, userId: string): Promise<string | null> => {
    if (!file) return null;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      addNotification({
        type: 'error',
        title: 'Arquivo muito grande',
        message: 'O arquivo deve ter no máximo 5MB'
      });
      return null;
    }

    if (!allowedTypes.includes(file.type)) {
      addNotification({
        type: 'error',
        title: 'Formato não suportado',
        message: 'Use apenas arquivos JPEG, PNG ou WebP'
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      addNotification({
        type: 'success',
        title: 'Upload bem-sucedido!',
        message: 'Imagem carregada com sucesso'
      });

      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      addNotification({
        type: 'error',
        title: 'Erro no upload',
        message: 'Não foi possível enviar a imagem. Tente novamente'
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadImage,
    isUploading,
    uploadProgress
  };
};
