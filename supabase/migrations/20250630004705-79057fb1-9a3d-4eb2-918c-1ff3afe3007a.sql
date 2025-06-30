
-- Drop existing policies that might conflict and recreate them properly
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Add missing RLS policies for notifications table
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON public.notifications
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
FOR DELETE USING (auth.uid() = user_id);

-- Add missing RLS policies for reviews table (only add what's missing)
DROP POLICY IF EXISTS "Anyone can view reviews for published products" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews for products they purchased" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

CREATE POLICY "Users can view all reviews" ON public.reviews
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON public.reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
FOR DELETE USING (auth.uid() = user_id);

-- Add missing RLS policies for user_progress table (only add what's missing)
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can create their own progress" ON public.user_progress;

CREATE POLICY "Users can view their own progress" ON public.user_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON public.user_progress
FOR DELETE USING (auth.uid() = user_id);

-- Add missing RLS policies for products table (only add what's missing)
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;
DROP POLICY IF EXISTS "Creators can view their own products" ON public.products;
DROP POLICY IF EXISTS "Creators can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Creators can update their own products" ON public.products;
DROP POLICY IF EXISTS "Creators can delete their own products" ON public.products;

CREATE POLICY "Products are viewable by everyone" ON public.products
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own products" ON public.products
FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own products" ON public.products
FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own products" ON public.products
FOR DELETE USING (auth.uid() = creator_id);

-- Add missing RLS policies for purchases table (only add what's missing)
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can create their own purchases" ON public.purchases;

CREATE POLICY "Users can view their own purchases" ON public.purchases
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON public.purchases
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add missing RLS policies for users table (only add what's missing)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

CREATE POLICY "Users can view all user profiles" ON public.users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE USING (auth.uid() = id);
