import { apiClient } from './axios';

export interface QuestionOption {
  id: number;
  option_text: string;
  is_correct?: boolean;
}

export interface Question {
  id: number;
  title: string;
  text: string;
  question_type: string;
  aptitude_category: string;
  difficulty: string;
  explanation?: string;
  options: QuestionOption[];
}

export interface AssessmentTest {
  id: number;
  title: string;
  description?: string;
  test_type: string;
  duration_minutes: number;
  passing_percentage: number;
  questions: Question[];
  questions_count: number;
}

export interface CodingProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  input_format?: string;
  output_format?: string;
  constraints?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  starter_code: Record<string, string>;
  test_cases: { id: number; input_data: string; expected_output: string }[];
}

export interface SQLProblem {
  id: number;
  title: string;
  description: string;
  database_schema: string;
  sample_data_json: Record<string, any>;
}

export const assessmentApi = {
  getTests: async (): Promise<AssessmentTest[]> => {
    const response = await apiClient.get<any>('/tests/tests/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  },

  submitTestAttempt: async (testId: number, answers: Record<string, any>, timeTaken: number) => {
    const response = await apiClient.post(`/tests/tests/${testId}/submit_attempt/`, {
      answers,
      time_taken_seconds: timeTaken,
    });
    return response.data;
  },

  getCodingProblems: async (): Promise<CodingProblem[]> => {
    const response = await apiClient.get<any>('/coding/problems/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  },

  runCode: async (problemId: number, code: string, language: string) => {
    const response = await apiClient.post(`/coding/problems/${problemId}/run_code/`, { code, language });
    return response.data;
  },

  submitCode: async (problemId: number, code: string, language: string) => {
    const response = await apiClient.post(`/coding/problems/${problemId}/submit_solution/`, { code, language });
    return response.data;
  },

  getSQLProblems: async (): Promise<SQLProblem[]> => {
    const response = await apiClient.get<any>('/sql/problems/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  },

  executeSQLQuery: async (problemId: number, query: string) => {
    const response = await apiClient.post(`/sql/problems/${problemId}/execute_query/`, { query });
    return response.data;
  },
};
