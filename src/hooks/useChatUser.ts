
import { useState, useEffect } from 'react';
import { ChatUserData } from '../types/chat';

const STORAGE_KEY = 'eloomini_chat_user';

export const useChatUser = () => {
  const [userData, setUserData] = useState<ChatUserData | null>(null);
  const [showWelcomeForm, setShowWelcomeForm] = useState(false);

  useEffect(() => {
    // Verificar se já temos dados salvos na sessão
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Não mostrar formulário automaticamente, só quando solicitado
      }
    }
    // Remover o setShowWelcomeForm(true) automático
  }, []);

  const saveUserData = (data: ChatUserData) => {
    setUserData(data);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setShowWelcomeForm(false);
  };

  const clearUserData = () => {
    setUserData(null);
    sessionStorage.removeItem(STORAGE_KEY);
    setShowWelcomeForm(true);
  };

  const getUserDisplayName = (): string => {
    return userData?.name || 'Usuário';
  };

  return {
    userData,
    showWelcomeForm,
    saveUserData,
    clearUserData,
    getUserDisplayName,
    setShowWelcomeForm
  };
};
