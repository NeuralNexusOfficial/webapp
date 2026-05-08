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

export interface Submission {
  id: string;
  team_id: string;
  project_name: string;
  description: string;
  video_link: string;
  github_link: string;
  score: number;
  judged_by: string | null;
  created_at: string;
}