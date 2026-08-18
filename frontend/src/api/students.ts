import { apiClient } from './axios';
import { StudentProfile } from '../types/auth';

export interface StudentProject {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  documentation_url?: string;
  status: string;
  overall_score: number;
  evaluator_feedback?: string;
}

export const studentsApi = {
  getProfile: async (): Promise<StudentProfile> => {
    const response = await apiClient.get<StudentProfile>('/auth/me/');
    return response.data;
  },

  updateProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const response = await apiClient.patch<StudentProfile>('/auth/student-profile/', data);
    return response.data;
  },

  getProjects: async (): Promise<StudentProject[]> => {
    const response = await apiClient.get<StudentProject[]>('/students/projects/');
    return response.data;
  },

  createProject: async (data: Partial<StudentProject>): Promise<StudentProject> => {
    const response = await apiClient.post<StudentProject>('/students/projects/', data);
    return response.data;
  },
};
