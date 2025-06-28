
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User, Link, Save } from 'lucide-react';

const CreatorProfileEdit = ({ onClose }: { onClose: () => void }) => {
  const { profile, updateProfile, uploadAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    portfolio_url: profile?.portfolio_url || '',
    social_links: {
      facebook: profile?.social_links?.facebook || '',
      instagram: profile?.social_links?.instagram || '',
      twitter: profile?.social_links?.twitter || '',
      linkedin: profile?.social_links?.linkedin || '',
      ...profile?.social_links
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('social_')) {
      const socialField = field.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await uploadAvatar(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Editar Perfil de Criador</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <Input
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sobrenome</label>
              <Input
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Seu sobrenome"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Biografia</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Conte um pouco sobre você e seu trabalho..."
              rows={4}
            />
          </div>

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Portfolio/Website</label>
            <Input
              value={formData.portfolio_url}
              onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
              placeholder="https://seuportfolio.com"
              type="url"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium mb-3">Redes Sociais</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Facebook</label>
                <Input
                  value={formData.social_links.facebook}
                  onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                  placeholder="https://facebook.com/seu-perfil"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                <Input
                  value={formData.social_links.instagram}
                  onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                  placeholder="https://instagram.com/seu-perfil"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Twitter</label>
                <Input
                  value={formData.social_links.twitter}
                  onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                  placeholder="https://twitter.com/seu-perfil"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
                <Input
                  value={formData.social_links.linkedin}
                  onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="loomini-button">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatorProfileEdit;
