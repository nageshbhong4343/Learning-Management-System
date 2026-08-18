export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  PLACEMENT_OFFICER = 'PLACEMENT_OFFICER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  HR_INTERVIEWER = 'HR_INTERVIEWER',
}

export enum LoginMode {
  OTHER_THAN_QUESTION_SOLVING = 'OtherThanQuestionSolving',
  QUESTION_SOLVING = 'QuestionSolving',
  QUESTION_SOLVING_COMBO_OTP = 'QuestionSolving(ComboWithOtp)',
  ALWAYS_ACTIVE = 'AlwaysActive',
}

export interface StudentProfile {
  id: number;
  dob?: string;
  gender?: string;
  alternate_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduation_year?: number;
  cgpa?: number;
  skills?: string[];
  certifications?: string[];
  resume?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  training_level?: string;
  current_batch_name?: string;
  attendance_percentage?: number;
  certificate_score?: number;
  mock_interview_score?: number;
  coding_score?: number;
  aptitude_score?: number;
  placement_status?: string;
  locked_by_admin?: boolean;
}

export interface ParentProfile {
  id: number;
  student?: string;
  student_name?: string;
  occupation?: string;
  address?: string;
}

export interface TrainerProfile {
  id: number;
  specialization?: string;
  experience_years?: number;
  bio?: string;
}

export interface AdminProfile {
  id: number;
  department?: string;
  designation?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  login_mode: LoginMode;
  is_verified: boolean;
  is_active: boolean;
  avatar?: string;
  failed_login_attempts: number;
  student_profile?: StudentProfile;
  parent_profile?: ParentProfile;
  trainer_profile?: TrainerProfile;
  admin_profile?: AdminProfile;
  created_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  role: UserRole;
  login_mode: LoginMode;
}
