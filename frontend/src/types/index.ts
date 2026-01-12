export interface User {
  user_id: number;
  email: string;
}

export interface CV {
  id: number;
  file_name: string;
  created_at: string;
}

export interface JobDescription {
  id: number;
  title: string;
  created_at: string;
}

export interface AnalysisResult {
  id: number;
  score: number;
  feedback: string;
  suggestions: string[];
  improved_cv: string;
  created_at: string;
}
