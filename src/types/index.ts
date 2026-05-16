export type Role = 'USER' | 'ADMIN' | 'JUDGE';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'LEADER' | 'MEMBER';
}

export interface Payment {
  id: string;
  user_id: string;
  razorpay_order_id: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  created_at: string;
}

export type Track = 'AI/ML' | 'Web3' | 'HealthTech' | 'FinTech' | 'OpenInnovation';

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'JUDGED';

export interface Submission {
  id: string;
  team_id: string;
  title: string;
  description: string;
  track: Track;
  repo_url: string | null;
  demo_url: string | null;
  file_url: string | null;
  deadline: string;
  submitted_at: string | null;
  status: SubmissionStatus;
  score: number;
  judged_by: string | null;
  created_at: string;
}

export interface JudgeAssignment {
  id: string;
  submission_id: string;
  judge_id: string;
  created_at: string;
}

export interface Score {
  id: string;
  submission_id: string;
  judge_id: string;
  innovation_score: number;
  technical_score: number;
  ui_ux_score: number;
  scalability_score: number;
  total_score: number;
  comments: string | null;
  created_at: string;
  updated_at: string;
}