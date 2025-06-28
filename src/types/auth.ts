
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
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

export interface AuthContextType {
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
