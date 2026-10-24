import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    mobile_number = Column(String(20), nullable=True)
    role = Column(String(20), default="student", nullable=False) # 'student', 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    reminders = relationship("ReminderNotification", back_populates="user", cascade="all, delete-orphan")
    document_statuses = relationship("StudentDocumentStatus", back_populates="user", cascade="all, delete-orphan")
    ai_conversations = relationship("AIConversation", back_populates="user", cascade="all, delete-orphan")


class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    registration_number = Column(String(100), unique=True, index=True, nullable=False)
    roll_number = Column(String(100), index=True, nullable=True)
    dob = Column(String(20), nullable=True)
    stream = Column(String(100), nullable=True) # Science, Commerce, Arts, General
    category = Column(String(50), default="General") # General, OBC, SC, ST, EWS
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    results = relationship("Result", back_populates="student", cascade="all, delete-orphan")


class OfficialSource(Base):
    __tablename__ = "official_sources"
    id = Column(Integer, primary_key=True, index=True)
    authority_name = Column(String(255), nullable=False)
    portal_name = Column(String(255), nullable=False)
    official_url = Column(String(500), nullable=False)
    verification_status = Column(String(50), default="VERIFIED") # VERIFIED, UNDER_REVIEW, CHECK_REQUIRED
    contact_helpline = Column(String(100), nullable=True)
    contact_email = Column(String(255), nullable=True)
    last_verified_date = Column(String(50), default="2026-09-01")
    notes = Column(Text, nullable=True)


class Examination(Base):
    __tablename__ = "examinations"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False) # e.g. "Higher Secondary Examination (Class 12)"
    description = Column(Text, nullable=True)
    year = Column(Integer, default=2026, nullable=False)
    board_name = Column(String(255), default="State Board of Examination / Central Board")
    exam_type = Column(String(50), default="Annual") # Annual, Supplementary, Term
    is_active = Column(Boolean, default=True)
    official_source_id = Column(Integer, ForeignKey("official_sources.id"), nullable=True)

    subjects = relationship("Subject", back_populates="examination", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="examination", cascade="all, delete-orphan")
    revaluation_option = relationship("RevaluationOption", back_populates="examination", uselist=False, cascade="all, delete-orphan")
    supplementary_exam = relationship("SupplementaryExam", back_populates="examination", uselist=False, cascade="all, delete-orphan")


class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    examination_id = Column(Integer, ForeignKey("examinations.id"), nullable=False)
    code = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    max_marks = Column(Float, default=100.0)
    passing_marks = Column(Float, default=35.0)
    is_core = Column(Boolean, default=True)

    examination = relationship("Examination", back_populates="subjects")


class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    examination_id = Column(Integer, ForeignKey("examinations.id"), nullable=False)
    registration_number = Column(String(100), index=True, nullable=False)
    roll_number = Column(String(100), index=True, nullable=True)
    result_status = Column(String(50), default="PASS") # PASS, COMPARTMENT, FAIL, WITHHELD
    overall_percentage = Column(Float, default=0.0)
    overall_grade = Column(String(10), default="F")
    total_max_marks = Column(Float, default=500.0)
    total_obtained_marks = Column(Float, default=0.0)
    is_verified = Column(Boolean, default=True)
    declaration_date = Column(String(50), default="2026-05-15")
    official_remarks = Column(Text, nullable=True)

    student = relationship("Student", back_populates="results")
    examination = relationship("Examination", back_populates="results")
    subject_results = relationship("ResultSubject", back_populates="result", cascade="all, delete-orphan")


class ResultSubject(Base):
    __tablename__ = "result_subjects"
    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, ForeignKey("results.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    subject_code = Column(String(50), nullable=False)
    subject_name = Column(String(255), nullable=False)
    max_marks = Column(Float, default=100.0)
    obtained_marks = Column(Float, default=0.0)
    theory_marks = Column(Float, default=0.0)
    practical_marks = Column(Float, default=0.0)
    grade = Column(String(10), default="P")
    status = Column(String(20), default="PASS") # PASS, FAIL

    result = relationship("Result", back_populates="subject_results")


class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # 'Higher Education', 'Scholarships', 'Diploma Programs', 'ITI / Skill Programs', 'Entrance Examinations', 'Government Educational Schemes', 'Other'
    description = Column(Text, nullable=False)
    eligibility_summary = Column(Text, nullable=False)
    min_percentage = Column(Float, default=0.0)
    stream_requirement = Column(String(100), default="Any") # Any, Science, Commerce, Arts
    application_start = Column(String(50), nullable=True)
    application_deadline = Column(String(50), nullable=True)
    official_source_id = Column(Integer, ForeignKey("official_sources.id"), nullable=True)
    source_authority = Column(String(255), default="Government Education Department")
    source_url = Column(String(500), default="https://education.gov.in")
    last_verified_date = Column(String(50), default="2026-09-01")
    verification_status = Column(String(50), default="VERIFIED") # VERIFIED, CHECK_REQUIRED
    required_documents_summary = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    rules = relationship("EligibilityRule", back_populates="opportunity", cascade="all, delete-orphan")


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"
    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=False)
    rule_type = Column(String(50), nullable=False) # MIN_PERCENTAGE, MIN_SUBJECT_MARK, MAX_FAILS, STREAM_MATCH, RESULT_STATUS
    condition_key = Column(String(50), nullable=True) # e.g. "Mathematics", "overall_percentage", "result_status"
    condition_operator = Column(String(20), default="GTE") # GTE, LTE, EQ, NEQ, IN
    condition_value = Column(String(100), nullable=False)
    explanation = Column(String(255), nullable=True)

    opportunity = relationship("Opportunity", back_populates="rules")


class RevaluationOption(Base):
    __tablename__ = "revaluation_options"
    id = Column(Integer, primary_key=True, index=True)
    examination_id = Column(Integer, ForeignKey("examinations.id"), unique=True, nullable=False)
    is_available = Column(Boolean, default=True)
    status = Column(String(50), default="AVAILABLE") # AVAILABLE, NOT_AVAILABLE, CHECK_REQUIRED, CLOSED
    fee_per_subject = Column(Float, default=500.0)
    application_start = Column(String(50), default="2026-05-20")
    application_deadline = Column(String(50), default="2026-09-25")
    procedure_steps = Column(JSON, default=list) # list of string steps
    eligible_criteria = Column(Text, default="All students who appeared in the examination can apply for verification/re-totalling and answer-book copy.")
    source_authority = Column(String(255), default="State Board Revaluation Division")
    source_url = Column(String(500), default="https://board.gov.in/revaluation")
    verification_status = Column(String(50), default="VERIFIED")
    last_verified_date = Column(String(50), default="2026-09-01")

    examination = relationship("Examination", back_populates="revaluation_option")


class SupplementaryExam(Base):
    __tablename__ = "supplementary_exams"
    id = Column(Integer, primary_key=True, index=True)
    examination_id = Column(Integer, ForeignKey("examinations.id"), unique=True, nullable=False)
    is_available = Column(Boolean, default=True)
    status = Column(String(50), default="AVAILABLE") # AVAILABLE, NOT_AVAILABLE, CHECK_REQUIRED, CLOSED
    exam_date = Column(String(50), default="2026-10-15")
    application_deadline = Column(String(50), default="2026-09-30")
    fee_per_subject = Column(Float, default=350.0)
    max_subjects_allowed = Column(Integer, default=2)
    procedure_steps = Column(JSON, default=list)
    required_documents = Column(JSON, default=list)
    source_authority = Column(String(255), default="State Board Supplementary Cell")
    source_url = Column(String(500), default="https://board.gov.in/supplementary")
    verification_status = Column(String(50), default="VERIFIED")
    last_verified_date = Column(String(50), default="2026-09-01")

    examination = relationship("Examination", back_populates="supplementary_exam")


class Deadline(Base):
    __tablename__ = "deadlines"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    activity_type = Column(String(100), default="ADMISSION") # REVALUATION, SUPPLEMENTARY, ADMISSION, SCHOLARSHIP, COUNSELLING, EXAM
    related_exam_opportunity = Column(String(255), nullable=False)
    start_date = Column(String(50), nullable=False)
    deadline_date = Column(String(50), nullable=False)
    source_authority = Column(String(255), default="State Admissions & Examinations Portal")
    source_url = Column(String(500), default="https://counselling.gov.in")
    verification_status = Column(String(50), default="VERIFIED")
    last_verified_date = Column(String(50), default="2026-09-01")
    is_active = Column(Boolean, default=True)

    reminders = relationship("ReminderNotification", back_populates="deadline", cascade="all, delete-orphan")


class ReminderNotification(Base):
    __tablename__ = "reminder_notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    deadline_id = Column(Integer, ForeignKey("deadlines.id"), nullable=False)
    reminder_type = Column(String(50), default="3_DAYS_BEFORE") # 1_DAY_BEFORE, 3_DAYS_BEFORE, 7_DAYS_BEFORE
    reminder_date = Column(String(50), nullable=True)
    is_sent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reminders")
    deadline = relationship("Deadline", back_populates="reminders")


class DocumentRequirement(Base):
    __tablename__ = "document_requirements"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    requirement_type = Column(String(50), default="MANDATORY") # MANDATORY, CONDITIONAL, OPTIONAL
    description = Column(Text, nullable=False)
    related_category = Column(String(100), default="General Admission & Verification")
    issuing_authority = Column(String(255), default="Competent Government Authority")
    verification_tips = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    student_statuses = relationship("StudentDocumentStatus", back_populates="document", cascade="all, delete-orphan")


class StudentDocumentStatus(Base):
    __tablename__ = "student_document_statuses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("document_requirements.id"), nullable=False)
    status = Column(String(50), default="PENDING") # READY, PENDING
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="document_statuses")
    document = relationship("DocumentRequirement", back_populates="student_statuses")


class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="Result Guidance Chat")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="ai_conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")


class AIMessage(Base):
    __tablename__ = "ai_messages"
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id"), nullable=False)
    sender = Column(String(20), nullable=False) # 'user', 'assistant'
    content = Column(Text, nullable=False)
    is_verified_grounded = Column(Boolean, default=True)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("AIConversation", back_populates="messages")
