import { apiClient } from './axios';

export interface LearningMaterial {
  id: number;
  title: string;
  material_type: 'TEXT' | 'PDF' | 'VIDEO' | 'URL' | 'CODE';
  content_text?: string;
  video_url?: string;
  external_url?: string;
  code_snippet?: string;
}

export interface Lesson {
  id: number;
  title: string;
  summary?: string;
  duration_minutes: number;
  is_completed: boolean;
  materials: LearningMaterial[];
}

export interface Topic {
  id: number;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  topics: Topic[];
}

export interface Course {
  id: number;
  title: string;
  code: string;
  description: string;
  subjects: Subject[];
}

export const learningApi = {
  getCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get<any>('/learning/courses/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  },

  toggleLessonComplete: async (lessonId: number): Promise<{ is_completed: boolean }> => {
    const response = await apiClient.post<{ is_completed: boolean }>(`/learning/lessons/${lessonId}/toggle_complete/`);
    return response.data;
  },
};
