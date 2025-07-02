
-- Fix search path security warnings in existing functions
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public, extensions
AS $function$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'comprador')
  );
  RETURN NEW;
END;
$function$;

-- Fix search path for products search vector function
DROP FUNCTION IF EXISTS public.update_products_search_vector();
CREATE OR REPLACE FUNCTION public.update_products_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, extensions
AS $function$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.description_short, '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.description_full, '')), 'C') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.category, '')), 'D');
  RETURN NEW;
END;
$function$;

-- Fix search path for product rating function
DROP FUNCTION IF EXISTS public.get_product_rating(uuid);
CREATE OR REPLACE FUNCTION public.get_product_rating(product_uuid uuid)
RETURNS TABLE(average_rating numeric, total_reviews integer)
LANGUAGE plpgsql
SET search_path = public, extensions
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating), 0)::DECIMAL(3,2) as average_rating,
    COUNT(*)::INTEGER as total_reviews
  FROM public.reviews 
  WHERE product_id = product_uuid;
END;
$function$;

-- Add user progress tracking table for course completion
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  watch_percentage INTEGER NOT NULL DEFAULT 0 CHECK (watch_percentage >= 0 AND watch_percentage <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Add certificate requests table
CREATE TABLE IF NOT EXISTS public.certificate_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  completion_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sent')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on new tables
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_progress
CREATE POLICY "Users can view their own progress" 
  ON public.user_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON public.user_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.user_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for certificate_requests
CREATE POLICY "Users can view their own certificate requests" 
  ON public.certificate_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificate requests" 
  ON public.certificate_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Update Auth settings to fix OTP expiry warning
UPDATE auth.config SET 
  otp_exp = 300 
WHERE key = 'otp_exp';
