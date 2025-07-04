
export interface Course {
  id: string;
  title: string;
  description_short: string;
  description_full: string;
  cover_image_url: string | null;
  creator_id: string;
  type: 'course' | 'ebook';
  status: 'draft' | 'published' | 'archived';
  price: number;
  currency: string;
  level: string;
  category: string;
  language: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  module_id: string;
  order_index: number;
  video_url: string | null;
  duration: string | null;
}

export interface Module {
  id: string;
  title: string;
  product_id: string;
  order_index: number;
  lessons: Lesson[];
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
}
