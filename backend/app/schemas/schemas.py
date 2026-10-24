from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# Auth & User
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    mobile_number: Optional[str] = None
    password: str
    examination_type: Optional[str] = "Class 12"
    examination_year: Optional[int] = 2026

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    full_name: str
    email: str
    role: str
    registration_number: Optional[str] = None
    student_id: Optional[int] = None

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    mobile_number: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    registration_number: Optional[str] = None
    student_id: Optional[int] = None

    class Config:
        from_attributes = True

# Examination & Subjects
class SubjectOut(BaseModel):
    id: int
    code: str
    name: str
    max_marks: float
    passing_marks: float
    is_core: bool

    class Config:
        from_attributes = True

class ExaminationOut(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    year: int
    board_name: str
    exam_type: str
    is_active: bool

    class Config:
        from_attributes = True

# Results
class ResultSubjectOut(BaseModel):
    id: int
    subject_code: str
    subject_name: str
    max_marks: float
    obtained_marks: float
    theory_marks: float
    practical_marks: float
    grade: str
    status: str
    percentage: float

    class Config:
        from_attributes = True

class ResultOut(BaseModel):
    id: int
    student_id: int
    student_name: str
    registration_number: str
    roll_number: Optional[str] = None
    examination_id: int
    examination_name: str
    examination_year: int
    board_name: str
    result_status: str
    overall_percentage: float
    overall_grade: str
    total_max_marks: float
    total_obtained_marks: float
    declaration_date: str
    official_remarks: Optional[str] = None
    is_verified: bool
    subjects: List[ResultSubjectOut]

    class Config:
        from_attributes = True

class ResultSearchRequest(BaseModel):
    examination_id: Optional[int] = None
    examination_year: int = 2026
    registration_number: str
    roll_number: Optional[str] = None
    dob: Optional[str] = None
    captcha: Optional[str] = "GOV26"

# Smart Result Analysis
class SubjectHighlight(BaseModel):
    subject_name: str
    subject_code: str
    obtained_marks: float
    max_marks: float
    percentage: float
    grade: str
    reason: str

class ResultAnalysisOut(BaseModel):
    result_id: int
    student_name: str
    registration_number: str
    examination_name: str
    year: int
    result_status: str
    overall_percentage: float
    overall_grade: str
    performance_band: str # Distinction, First Class, Second Class, Pass Class, Compartment/Needs Improvement
    highest_mark_subject: SubjectHighlight
    lowest_mark_subject: SubjectHighlight
    average_mark: float
    total_subjects: int
    passed_subjects_count: int
    failed_subjects_count: int
    strong_subjects: List[SubjectHighlight]
    improvement_areas: List[SubjectHighlight]
    performance_summary: str
    key_takeaways: List[str]

# Opportunities
class EligibilityRuleOut(BaseModel):
    id: int
    rule_type: str
    condition_key: Optional[str] = None
    condition_operator: str
    condition_value: str
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class OpportunityOut(BaseModel):
    id: int
    title: str
    category: str
    description: str
    eligibility_summary: str
    min_percentage: float
    stream_requirement: str
    application_start: Optional[str] = None
    application_deadline: Optional[str] = None
    source_authority: str
    source_url: str
    last_verified_date: str
    verification_status: str
    required_documents_summary: Optional[str] = None
    is_active: bool
    student_eligibility_status: Optional[str] = "CHECK_REQUIRED" # ELIGIBLE, CHECK_REQUIRED, NOT_ELIGIBLE
    student_eligibility_reasons: Optional[List[str]] = []

    class Config:
        from_attributes = True

class OpportunityCreate(BaseModel):
    title: str
    category: str
    description: str
    eligibility_summary: str
    min_percentage: float = 0.0
    stream_requirement: str = "Any"
    application_start: Optional[str] = None
    application_deadline: Optional[str] = None
    source_authority: str = "Official Examination Authority"
    source_url: str = "https://education.gov.in"
    verification_status: str = "VERIFIED"
    last_verified_date: str = "2026-09-01"
    required_documents_summary: Optional[str] = None
    is_active: bool = True

# Revaluation & Supplementary
class RevaluationOut(BaseModel):
    id: int
    examination_id: int
    examination_name: str
    is_available: bool
    status: str # AVAILABLE, NOT_AVAILABLE, CHECK_REQUIRED, CLOSED
    fee_per_subject: float
    application_start: str
    application_deadline: str
    days_remaining: int
    procedure_steps: List[str]
    eligible_criteria: str
    source_authority: str
    source_url: str
    verification_status: str
    last_verified_date: str
    eligible_subjects: List[str] = []

class SupplementaryOut(BaseModel):
    id: int
    examination_id: int
    examination_name: str
    is_available: bool
    status: str # AVAILABLE, NOT_AVAILABLE, CHECK_REQUIRED, CLOSED
    exam_date: str
    application_deadline: str
    days_remaining: int
    fee_per_subject: float
    max_subjects_allowed: int
    procedure_steps: List[str]
    required_documents: List[str]
    source_authority: str
    source_url: str
    verification_status: str
    last_verified_date: str
    eligible_subjects: List[str] = []

# Deadlines & Reminders
class DeadlineOut(BaseModel):
    id: int
    title: str
    activity_type: str
    related_exam_opportunity: str
    start_date: str
    deadline_date: str
    days_remaining: int
    status: str # UPCOMING, OPEN, CLOSING_SOON, CLOSED
    source_authority: str
    source_url: str
    verification_status: str
    last_verified_date: str
    has_reminder_set: bool = False
    reminder_type: Optional[str] = None

    class Config:
        from_attributes = True

class DeadlineCreate(BaseModel):
    title: str
    activity_type: str = "ADMISSION"
    related_exam_opportunity: str
    start_date: str
    deadline_date: str
    source_authority: str = "Official Examination Authority"
    source_url: str = "https://counselling.gov.in"
    verification_status: str = "VERIFIED"
    last_verified_date: str = "2026-09-01"
    is_active: bool = True

class ReminderCreate(BaseModel):
    deadline_id: int
    reminder_type: str = "3_DAYS_BEFORE" # 1_DAY_BEFORE, 3_DAYS_BEFORE, 7_DAYS_BEFORE

class ReminderOut(BaseModel):
    id: int
    deadline_id: int
    deadline_title: str
    reminder_type: str
    reminder_date: Optional[str] = None
    is_sent: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Documents
class DocumentItemOut(BaseModel):
    id: int
    name: str
    requirement_type: str # MANDATORY, CONDITIONAL, OPTIONAL
    description: str
    related_category: str
    issuing_authority: str
    verification_tips: Optional[str] = None
    status: str # READY, PENDING
    notes: Optional[str] = None
    updated_at: Optional[datetime] = None

class DocumentStatusUpdate(BaseModel):
    document_id: int
    status: str # READY, PENDING
    notes: Optional[str] = None

# Recommended Next Steps
class NextStepItem(BaseModel):
    step_number: int
    title: str
    description: str
    status: str # COMPLETED, RECOMMENDED, URGENT, PENDING, OPTIONAL
    category: str # RESULT, OPPORTUNITY, REVALUATION, SUPPLEMENTARY, DOCUMENT, DEADLINE
    action_text: str
    action_url: str
    priority: int # 1 = highest

class NextStepsResponse(BaseModel):
    student_name: str
    overall_status: str
    overall_percentage: float
    summary_message: str
    action_plan: List[NextStepItem]

# AI Assistant
class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    student_id: Optional[int] = None

class AIChatResponse(BaseModel):
    conversation_id: int
    reply: str
    is_verified_grounded: bool
    sections: Optional[Dict[str, Any]] = None
    disclaimer: str

# Official Sources & Admin
class OfficialSourceOut(BaseModel):
    id: int
    authority_name: str
    portal_name: str
    official_url: str
    verification_status: str
    contact_helpline: Optional[str] = None
    contact_email: Optional[str] = None
    last_verified_date: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class OfficialSourceCreate(BaseModel):
    authority_name: str
    portal_name: str
    official_url: str
    verification_status: str = "VERIFIED"
    contact_helpline: Optional[str] = None
    contact_email: Optional[str] = None
    last_verified_date: str = "2026-09-01"
    notes: Optional[str] = None
