
-- Create custom types
CREATE TYPE user_role AS ENUM ('comprador', 'criador');
CREATE TYPE product_type AS ENUM ('ebook', 'course');
CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer');

-- Create users profiles table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'comprador',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description_short TEXT NOT NULL,
  description_full TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MZN',
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'Português',
  level TEXT NOT NULL,
  cover_image_url TEXT,
  type product_type NOT NULL,
  pages INTEGER, -- for ebooks only
  status product_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create modules table (for courses)
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT, -- e.g., "15 min"
  video_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create materials table
CREATE TABLE public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Avaliação do Módulo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  options JSONB, -- for multiple choice questions
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MZN',
  UNIQUE(user_id, product_id) -- Prevent duplicate purchases
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for products
CREATE POLICY "Anyone can view published products" ON public.products
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can view their own products" ON public.products
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = creator_id);

-- Create RLS policies for modules
CREATE POLICY "Anyone can view modules of published products" ON public.modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = modules.product_id 
      AND products.status = 'published'
    )
  );

CREATE POLICY "Creators can manage their product modules" ON public.modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = modules.product_id 
      AND products.creator_id = auth.uid()
    )
  );

-- Create RLS policies for lessons
CREATE POLICY "Anyone can view lessons of published products" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules 
      JOIN public.products ON products.id = modules.product_id
      WHERE modules.id = lessons.module_id 
      AND products.status = 'published'
    )
  );

CREATE POLICY "Creators can manage their product lessons" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.modules 
      JOIN public.products ON products.id = modules.product_id
      WHERE modules.id = lessons.module_id 
      AND products.creator_id = auth.uid()
    )
  );

-- Create RLS policies for materials
CREATE POLICY "Anyone can view materials of published products" ON public.materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.lessons
      JOIN public.modules ON modules.id = lessons.module_id
      JOIN public.products ON products.id = modules.product_id
      WHERE lessons.id = materials.lesson_id 
      AND products.status = 'published'
    )
  );

CREATE POLICY "Creators can manage their product materials" ON public.materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.lessons
      JOIN public.modules ON modules.id = lessons.module_id
      JOIN public.products ON products.id = modules.product_id
      WHERE lessons.id = materials.lesson_id 
      AND products.creator_id = auth.uid()
    )
  );

-- Create RLS policies for assessments
CREATE POLICY "Anyone can view assessments of published products" ON public.assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules 
      JOIN public.products ON products.id = modules.product_id
      WHERE modules.id = assessments.module_id 
      AND products.status = 'published'
    )
  );

CREATE POLICY "Creators can manage their product assessments" ON public.assessments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.modules 
      JOIN public.products ON products.id = modules.product_id
      WHERE modules.id = assessments.module_id 
      AND products.creator_id = auth.uid()
    )
  );

-- Create RLS policies for questions
CREATE POLICY "Anyone can view questions of published products" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assessments
      JOIN public.modules ON modules.id = assessments.module_id
      JOIN public.products ON products.id = modules.product_id
      WHERE assessments.id = questions.assessment_id 
      AND products.status = 'published'
    )
  );

CREATE POLICY "Creators can manage their product questions" ON public.questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.assessments
      JOIN public.modules ON modules.id = assessments.module_id
      JOIN public.products ON products.id = modules.product_id
      WHERE assessments.id = questions.assessment_id 
      AND products.creator_id = auth.uid()
    )
  );

-- Create RLS policies for purchases
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_products_creator_id ON public.products(creator_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_modules_product_id ON public.modules(product_id);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_materials_lesson_id ON public.materials(lesson_id);
CREATE INDEX idx_assessments_module_id ON public.assessments(module_id);
CREATE INDEX idx_questions_assessment_id ON public.questions(assessment_id);
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_product_id ON public.purchases(product_id);
