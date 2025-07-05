
-- Create sample products (courses and ebooks)
INSERT INTO public.products (id, title, description_short, description_full, cover_image_url, creator_id, type, status, price, currency, level, category, language) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Curso de JavaScript Completo', 'Aprenda JavaScript do zero ao avançado', 'Um curso completo de JavaScript que cobre desde os conceitos básicos até tópicos avançados como async/await, promises e muito mais.', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500', (SELECT id FROM auth.users LIMIT 1), 'course', 'published', 199.00, 'MZN', 'Iniciante', 'Programação', 'Português'),
('550e8400-e29b-41d4-a716-446655440002', 'E-book: Fundamentos de React', 'Guia essencial para React', 'E-book completo sobre os fundamentos do React, incluindo componentes, hooks, estado e muito mais.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500', (SELECT id FROM auth.users LIMIT 1), 'ebook', 'published', 99.00, 'MZN', 'Iniciante', 'Programação', 'Português'),
('550e8400-e29b-41d4-a716-446655440003', 'Curso de Python Avançado', 'Python para desenvolvedores experientes', 'Curso focado em técnicas avançadas de Python, incluindo decorators, metaclasses, programação assíncrona e otimização.', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500', (SELECT id FROM auth.users LIMIT 1), 'course', 'published', 299.00, 'MZN', 'Avançado', 'Programação', 'Português');

-- Create modules for the JavaScript course
INSERT INTO public.modules (id, title, product_id, order_index) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Introdução ao JavaScript', '550e8400-e29b-41d4-a716-446655440001', 1),
('660e8400-e29b-41d4-a716-446655440002', 'Estruturas de Controle', '550e8400-e29b-41d4-a716-446655440001', 2),
('660e8400-e29b-41d4-a716-446655440003', 'Funções e Objetos', '550e8400-e29b-41d4-a716-446655440001', 3);

-- Create modules for the Python course
INSERT INTO public.modules (id, title, product_id, order_index) VALUES
('660e8400-e29b-41d4-a716-446655440004', 'Decorators Avançados', '550e8400-e29b-41d4-a716-446655440003', 1),
('660e8400-e29b-41d4-a716-446655440005', 'Programação Assíncrona', '550e8400-e29b-41d4-a716-446655440003', 2);

-- Create lessons for JavaScript modules
INSERT INTO public.lessons (id, title, description, module_id, order_index, video_url, duration) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'O que é JavaScript?', 'Introdução aos conceitos básicos do JavaScript', '660e8400-e29b-41d4-a716-446655440001', 1, NULL, '15:30'),
('770e8400-e29b-41d4-a716-446655440002', 'Variáveis e Tipos de Dados', 'Aprendendo sobre variáveis, strings, números e booleans', '660e8400-e29b-41d4-a716-446655440001', 2, NULL, '20:45'),
('770e8400-e29b-41d4-a716-446655440003', 'Condicionais (if/else)', 'Como usar estruturas condicionais em JavaScript', '660e8400-e29b-41d4-a716-446655440002', 1, NULL, '18:20'),
('770e8400-e29b-41d4-a716-446655440004', 'Loops (for/while)', 'Estruturas de repetição em JavaScript', '660e8400-e29b-41d4-a716-446655440002', 2, NULL, '22:10'),
('770e8400-e29b-41d4-a716-446655440005', 'Funções Básicas', 'Criando e usando funções em JavaScript', '660e8400-e29b-41d4-a716-446655440003', 1, NULL, '25:30'),
('770e8400-e29b-41d4-a716-446655440006', 'Objetos e Arrays', 'Trabalhando com estruturas de dados complexas', '660e8400-e29b-41d4-a716-446655440003', 2, NULL, '30:15');

-- Create lessons for Python modules
INSERT INTO public.lessons (id, title, description, module_id, order_index, video_url, duration) VALUES
('770e8400-e29b-41d4-a716-446655440007', 'Decorators Personalizados', 'Criando seus próprios decorators', '660e8400-e29b-41d4-a716-446655440004', 1, NULL, '28:45'),
('770e8400-e29b-41d4-a716-446655440008', 'Async/Await em Python', 'Programação assíncrona moderna', '660e8400-e29b-41d4-a716-446655440005', 1, NULL, '35:20');

-- Create sample purchases for the current user (if authenticated)
-- Note: This will only work if there's an authenticated user
INSERT INTO public.purchases (user_id, product_id, amount_paid, currency) 
SELECT auth.uid(), '550e8400-e29b-41d4-a716-446655440001', 199.00, 'MZN'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.purchases (user_id, product_id, amount_paid, currency) 
SELECT auth.uid(), '550e8400-e29b-41d4-a716-446655440002', 99.00, 'MZN'
WHERE auth.uid() IS NOT NULL;
