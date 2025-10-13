export interface Submission {
  id?: number;
  user_id: number;
  title: string;
  subject: string;
  module_id?: number;
  year: string;
  content_type: 'resumo' | 'mapa' | 'exercicio' | 'apresentacao';
  description: string;
  keywords?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  reviewed_by?: number;
  reviewed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateSubmissionRequest {
  title: string;
  subject: string;
  year: string;
  contentType: string;
  description: string;
  keywords?: string;
}

export interface SubmissionResponse {
  id: number;
  title: string;
  subject: string;
  year: string;
  content_type: string;
  description: string;
  keywords?: string | undefined;
  file_name?: string | undefined;
  status: string;
  created_at: Date;
}
