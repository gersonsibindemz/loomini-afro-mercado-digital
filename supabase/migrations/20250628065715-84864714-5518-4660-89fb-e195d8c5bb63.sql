
-- Add creator-specific fields to users table
ALTER TABLE public.users ADD COLUMN bio text;
ALTER TABLE public.users ADD COLUMN social_links jsonb DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN portfolio_url text;

-- Create storage bucket for user avatars and creator files
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('creator-files', 'creator-files', false);

-- RLS policies for user avatars bucket
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policies for creator files bucket
CREATE POLICY "Creators can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'creator-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Creators can view their own files" ON storage.objects
FOR SELECT USING (bucket_id = 'creator-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Creators can update their own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'creator-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Creators can delete their own files" ON storage.objects
FOR DELETE USING (bucket_id = 'creator-files' AND auth.uid()::text = (storage.foldername(name))[1]);
