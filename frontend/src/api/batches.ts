import { apiClient } from './axios';

export interface Batch {
  id: number;
  name: string;
  code: string;
  batch_type: 'REGULAR' | 'UPCOMING' | 'SPECIAL' | 'PLACEMENT';
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'INACTIVE';
  start_date: string;
  end_date?: string;
  batch_timing: string;
  capacity: number;
  enrolled_count: number;
  available_slots: number;
  description?: string;
  trainer_details?: any;
}

export const batchesApi = {
  getBatches: async (): Promise<Batch[]> => {
    const response = await apiClient.get<any>('/batches/batches/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  },

  getBatchDetails: async (id: number): Promise<Batch> => {
    const response = await apiClient.get<Batch>(`/batches/batches/${id}/`);
    return response.data;
  },

  createBatch: async (data: Partial<Batch>): Promise<Batch> => {
    const response = await apiClient.post<Batch>('/batches/batches/', data);
    return response.data;
  },
};
