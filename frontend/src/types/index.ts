export interface User {
  id: number;
  email: string;
  full_name: string;
  mobile_number?: string;
  role: 'student' | 'admin';
  is_active: boolean;
  registration_number?: string;
  student_id?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  full_name: string;
  email: string;
  role: 'student' | 'admin';
  registration_number?: string;
  student_id?: number;
}

export interface Examination {
  id: number;
  code: string;
  name: string;
  description?: string;
  year: number;
  board_name: string;
  exam_type: string;
  is_active: boolean;
}

export interface ResultSubject {
  id: number;
  subject_code: string;
  subject_name: string;
  max_marks: number;
  obtained_marks: number;
  theory_marks: number;
  practical_marks: number;
  grade: string;
  status: 'PASS' | 'FAIL';
  percentage: number;
}

export interface ResultData {
  id: number;
  student_id: number;
  student_name: string;
  registration_number: string;
  roll_number?: string;
  examination_id: number;
  examination_name: string;
  examination_year: number;
  board_name: string;
  result_status: 'PASS' | 'COMPARTMENT' | 'FAIL' | 'WITHHELD';
  overall_percentage: number;
  overall_grade: string;
  total_max_marks: number;
  total_obtained_marks: number;
  declaration_date: string;
  official_remarks?: string;
  is_verified: boolean;
  subjects: ResultSubject[];
}

export interface SubjectHighlight {
  subject_name: string;
  subject_code: string;
  obtained_marks: number;
  max_marks: number;
  percentage: number;
  grade: string;
  reason: string;
}

export interface ResultAnalysis {
  result_id: number;
  student_name: string;
  registration_number: string;
  examination_name: string;
  year: number;
  result_status: string;
  overall_percentage: number;
  overall_grade: string;
  performance_band: string;
  highest_mark_subject: SubjectHighlight;
  lowest_mark_subject: SubjectHighlight;
  average_mark: number;
  total_subjects: number;
  passed_subjects_count: number;
  failed_subjects_count: number;
  strong_subjects: SubjectHighlight[];
  improvement_areas: SubjectHighlight[];
  performance_summary: string;
  key_takeaways: string[];
}

export interface Opportunity {
  id: number;
  title: string;
  category: 'Higher Education' | 'Scholarships' | 'Diploma Programs' | 'ITI / Skill Programs' | 'Entrance Examinations' | 'Government Educational Schemes' | 'Other';
  description: string;
  eligibility_summary: string;
  min_percentage: number;
  stream_requirement: string;
  application_start?: string;
  application_deadline?: string;
  source_authority: string;
  source_url: string;
  last_verified_date: string;
  verification_status: 'VERIFIED' | 'UNDER_REVIEW' | 'CHECK_REQUIRED';
  required_documents_summary?: string;
  is_active: boolean;
  student_eligibility_status: 'ELIGIBLE' | 'CHECK_REQUIRED' | 'NOT_ELIGIBLE';
  student_eligibility_reasons: string[];
}

export interface RevaluationInfo {
  id: number;
  examination_id: number;
  examination_name: string;
  is_available: boolean;
  status: 'AVAILABLE' | 'NOT_AVAILABLE' | 'CHECK_REQUIRED' | 'CLOSED';
  fee_per_subject: number;
  application_start: string;
  application_deadline: string;
  days_remaining: number;
  procedure_steps: string[];
  eligible_criteria: string;
  source_authority: string;
  source_url: string;
  verification_status: string;
  last_verified_date: string;
  eligible_subjects: string[];
}

export interface SupplementaryInfo {
  id: number;
  examination_id: number;
  examination_name: string;
  is_available: boolean;
  status: 'AVAILABLE' | 'NOT_AVAILABLE' | 'CHECK_REQUIRED' | 'CLOSED';
  exam_date: string;
  application_deadline: string;
  days_remaining: number;
  fee_per_subject: number;
  max_subjects_allowed: number;
  procedure_steps: string[];
  required_documents: string[];
  source_authority: string;
  source_url: string;
  verification_status: string;
  last_verified_date: string;
  eligible_subjects: string[];
}

export interface DeadlineItem {
  id: number;
  title: string;
  activity_type: string;
  related_exam_opportunity: string;
  start_date: string;
  deadline_date: string;
  days_remaining: number;
  status: 'UPCOMING' | 'OPEN' | 'CLOSING_SOON' | 'CLOSED';
  source_authority: string;
  source_url: string;
  verification_status: string;
  last_verified_date: string;
  has_reminder_set: boolean;
  reminder_type?: string;
}

export interface DocumentItem {
  id: number;
  name: string;
  requirement_type: 'MANDATORY' | 'CONDITIONAL' | 'OPTIONAL';
  description: string;
  related_category: string;
  issuing_authority: string;
  verification_tips?: string;
  status: 'READY' | 'PENDING';
  notes?: string;
  updated_at?: string;
}

export interface NextStepItem {
  step_number: number;
  title: string;
  description: string;
  status: 'COMPLETED' | 'RECOMMENDED' | 'URGENT' | 'PENDING' | 'OPTIONAL';
  category: string;
  action_text: string;
  action_url: string;
  priority: number;
}

export interface NextStepsData {
  student_name: string;
  overall_status: string;
  overall_percentage: number;
  summary_message: string;
  action_plan: NextStepItem[];
}

export interface AIChatMessage {
  id?: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  is_verified_grounded?: boolean;
  disclaimer?: string;
}

export interface AdminOverview {
  total_students: number;
  total_results: number;
  total_opportunities: number;
  verified_opportunities: number;
  total_deadlines: number;
  total_exams: number;
  system_status: string;
}
