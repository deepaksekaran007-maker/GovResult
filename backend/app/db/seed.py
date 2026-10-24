from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.entities import (
    User, Student, Examination, Subject, Result, ResultSubject,
    Opportunity, EligibilityRule, RevaluationOption, SupplementaryExam,
    Deadline, DocumentRequirement, StudentDocumentStatus, OfficialSource
)

def seed_database(db: Session):
    # Check if database already has users
    if db.query(User).count() > 0:
        return

    print("--- SEEDING GOVRESULT+ DATABASE WITH VERIFIED MOCK DATA ---")

    # 1. Official Sources
    src_dge = OfficialSource(
        authority_name="Directorate of Government Examinations",
        portal_name="National Examination & Evaluation Portal",
        official_url="https://dge.gov.in",
        verification_status="VERIFIED",
        contact_helpline="1800-425-2026",
        contact_email="helpdesk.exams@gov.in",
        last_verified_date="2026-09-01",
        notes="Official apex authority for secondary and higher secondary public examinations."
    )
    src_counselling = OfficialSource(
        authority_name="Centralised Admissions & Counselling Committee",
        portal_name="State & National Joint Seat Allocation Portal",
        official_url="https://counselling.nic.in",
        verification_status="VERIFIED",
        contact_helpline="011-2338-9000",
        contact_email="counselling.support@nic.in",
        last_verified_date="2026-09-01"
    )
    src_scholarship = OfficialSource(
        authority_name="Ministry of Education & Welfare",
        portal_name="National Scholarship Portal (NSP)",
        official_url="https://scholarships.gov.in",
        verification_status="VERIFIED",
        contact_helpline="0120-6619540",
        contact_email="helpdesk@nsp.gov.in",
        last_verified_date="2026-09-01"
    )
    src_skill = OfficialSource(
        authority_name="Directorate of Technical Education & Skill Mission",
        portal_name="DOTE Skill & Polytechnic Portal",
        official_url="https://skillmission.gov.in",
        verification_status="VERIFIED",
        contact_helpline="1800-599-4455",
        contact_email="info@skillmission.gov.in",
        last_verified_date="2026-09-01"
    )
    db.add_all([src_dge, src_counselling, src_scholarship, src_skill])
    db.flush()

    # 2. Examinations
    exam_12 = Examination(
        code="HSC2026",
        name="Higher Secondary Certificate Examination (Class 12)",
        description="Annual public state/central board examination for Grade 12 students.",
        year=2026,
        board_name="National Secondary & Higher Secondary Board",
        exam_type="Annual",
        is_active=True,
        official_source_id=src_dge.id
    )
    exam_10 = Examination(
        code="SSC2026",
        name="Secondary School Leaving Certificate Examination (Class 10)",
        description="Annual public examination for Grade 10 students.",
        year=2026,
        board_name="National Secondary & Higher Secondary Board",
        exam_type="Annual",
        is_active=True,
        official_source_id=src_dge.id
    )
    db.add_all([exam_12, exam_10])
    db.flush()

    # 3. Subjects for Exam 12
    sub_eng = Subject(examination_id=exam_12.id, code="ENG101", name="English", max_marks=100.0, passing_marks=35.0, is_core=True)
    sub_math = Subject(examination_id=exam_12.id, code="MAT102", name="Mathematics", max_marks=100.0, passing_marks=35.0, is_core=True)
    sub_phy = Subject(examination_id=exam_12.id, code="PHY103", name="Physics", max_marks=100.0, passing_marks=35.0, is_core=True)
    sub_chem = Subject(examination_id=exam_12.id, code="CHE104", name="Chemistry", max_marks=100.0, passing_marks=35.0, is_core=True)
    sub_cs = Subject(examination_id=exam_12.id, code="CSC105", name="Computer Science", max_marks=100.0, passing_marks=35.0, is_core=False)
    sub_bio = Subject(examination_id=exam_12.id, code="BIO106", name="Biology", max_marks=100.0, passing_marks=35.0, is_core=False)
    db.add_all([sub_eng, sub_math, sub_phy, sub_chem, sub_cs, sub_bio])
    db.flush()

    # 4. Revaluation & Supplementary options
    reval_12 = RevaluationOption(
        examination_id=exam_12.id,
        is_available=True,
        status="AVAILABLE",
        fee_per_subject=500.0,
        application_start="2026-05-20",
        application_deadline="2026-09-25",
        procedure_steps=[
            "Access the official board verification portal at https://board.gov.in/revaluation.",
            "Enter your Registration Number and Date of Birth to fetch your paper roster.",
            "Select whether you require: (a) Scanned Answer-Book Copy (INR 275), (b) Marks Recalculation (INR 300), or (c) Complete Subject Revaluation (INR 500).",
            "Complete fee payment through online payment gateway (UPI / Debit / Net Banking).",
            "Keep the generated Application Number safely. Results will be published online within 14 working days."
        ],
        eligible_criteria="All candidates who appeared for HSC 2026 annual examination are eligible to apply for any or all subjects.",
        source_authority="Directorate of Government Examinations",
        source_url="https://dge.gov.in/revaluation",
        verification_status="VERIFIED",
        last_verified_date="2026-09-01"
    )

    suppl_12 = SupplementaryExam(
        examination_id=exam_12.id,
        is_available=True,
        status="AVAILABLE",
        exam_date="2026-10-15",
        application_deadline="2026-09-30",
        fee_per_subject=350.0,
        max_subjects_allowed=2,
        procedure_steps=[
            "Login to the candidate portal using Registration Number and Roll Number.",
            "Verify your compartment subjects populated automatically from official evaluation records.",
            "Select your preferred examination district and exam center.",
            "Pay the prescribed examination fee (INR 350 per subject) before the last date.",
            "Download your revised Supplementary Hall Ticket 7 days before the exam date (from 08-Oct-2026)."
        ],
        required_documents=[
            "Original HSC 2026 Hall Ticket or Online Provisional Marksheet",
            "Passport Size Photograph",
            "Valid Government Photo ID Proof (Aadhaar / School ID)"
        ],
        source_authority="State Board Supplementary Examination Cell",
        source_url="https://dge.gov.in/supplementary",
        verification_status="VERIFIED",
        last_verified_date="2026-09-01"
    )
    db.add_all([reval_12, suppl_12])
    db.flush()

    # 5. Users & Students
    # Admin
    admin_user = User(
        email="admin@govresult.nic.in",
        hashed_password=get_password_hash("Admin@12345"),
        full_name="Dr. S. Ramalingam (Controller of Exams)",
        mobile_number="+91 94440 12345",
        role="admin",
        is_active=True
    )
    db.add(admin_user)

    # Student 1: Arun Kumar (Pass, 84.2%)
    arun_user = User(
        email="arun.kumar@govresult.demo",
        hashed_password=get_password_hash("Password@123"),
        full_name="Arun Kumar",
        mobile_number="+91 98765 43210",
        role="student",
        is_active=True
    )
    db.add(arun_user)
    db.flush()

    arun_student = Student(
        user_id=arun_user.id,
        registration_number="TN202612089",
        roll_number="ROLL20268801",
        dob="2008-04-12",
        stream="Science (PCM+CS)",
        category="General / OBC"
    )
    db.add(arun_student)
    db.flush()

    # Result for Arun Kumar (84.2%, Pass)
    arun_result = Result(
        student_id=arun_student.id,
        examination_id=exam_12.id,
        registration_number=arun_student.registration_number,
        roll_number=arun_student.roll_number,
        result_status="PASS",
        overall_percentage=84.2,
        overall_grade="A2",
        total_max_marks=500.0,
        total_obtained_marks=421.0,
        is_verified=True,
        declaration_date="2026-05-15",
        official_remarks="Passed in First Class with Distinction. Eligible for Higher Education Admissions."
    )
    db.add(arun_result)
    db.flush()

    arun_sub_results = [
        ResultSubject(result_id=arun_result.id, subject_id=sub_eng.id, subject_code="ENG101", subject_name="English", max_marks=100.0, obtained_marks=88.0, theory_marks=68.0, practical_marks=20.0, grade="A2", status="PASS"),
        ResultSubject(result_id=arun_result.id, subject_id=sub_math.id, subject_code="MAT102", subject_name="Mathematics", max_marks=100.0, obtained_marks=91.0, theory_marks=71.0, practical_marks=20.0, grade="A1", status="PASS"),
        ResultSubject(result_id=arun_result.id, subject_id=sub_phy.id, subject_code="PHY103", subject_name="Physics", max_marks=100.0, obtained_marks=78.0, theory_marks=53.0, practical_marks=25.0, grade="B1", status="PASS"),
        ResultSubject(result_id=arun_result.id, subject_id=sub_chem.id, subject_code="CHE104", subject_name="Chemistry", max_marks=100.0, obtained_marks=69.0, theory_marks=44.0, practical_marks=25.0, grade="B2", status="PASS"),
        ResultSubject(result_id=arun_result.id, subject_id=sub_cs.id, subject_code="CSC105", subject_name="Computer Science", max_marks=100.0, obtained_marks=95.0, theory_marks=68.0, practical_marks=27.0, grade="A1", status="PASS"),
    ]
    # Note: 88 + 91 + 78 + 69 + 95 = 421 / 500 = 84.2%
    db.add_all(arun_sub_results)

    # Student 2: Priya Sharma (Compartment in Chemistry)
    priya_user = User(
        email="priya.sharma@govresult.demo",
        hashed_password=get_password_hash("Password@123"),
        full_name="Priya Sharma",
        mobile_number="+91 97654 32109",
        role="student",
        is_active=True
    )
    db.add(priya_user)
    db.flush()

    priya_student = Student(
        user_id=priya_user.id,
        registration_number="TN202612090",
        roll_number="ROLL20268802",
        dob="2008-08-22",
        stream="Science (PCB)",
        category="General"
    )
    db.add(priya_student)
    db.flush()

    # Result for Priya Sharma (Compartment in Chemistry)
    priya_result = Result(
        student_id=priya_student.id,
        examination_id=exam_12.id,
        registration_number=priya_student.registration_number,
        roll_number=priya_student.roll_number,
        result_status="COMPARTMENT",
        overall_percentage=63.6,
        overall_grade="C1",
        total_max_marks=500.0,
        total_obtained_marks=318.0,
        is_verified=True,
        declaration_date="2026-05-15",
        official_remarks="Compartment in Chemistry. Eligible to appear for Supplementary Examination in October 2026."
    )
    db.add(priya_result)
    db.flush()

    priya_sub_results = [
        ResultSubject(result_id=priya_result.id, subject_id=sub_eng.id, subject_code="ENG101", subject_name="English", max_marks=100.0, obtained_marks=76.0, theory_marks=56.0, practical_marks=20.0, grade="B1", status="PASS"),
        ResultSubject(result_id=priya_result.id, subject_id=sub_math.id, subject_code="MAT102", subject_name="Mathematics", max_marks=100.0, obtained_marks=68.0, theory_marks=48.0, practical_marks=20.0, grade="B2", status="PASS"),
        ResultSubject(result_id=priya_result.id, subject_id=sub_phy.id, subject_code="PHY103", subject_name="Physics", max_marks=100.0, obtained_marks=62.0, theory_marks=37.0, practical_marks=25.0, grade="C1", status="PASS"),
        ResultSubject(result_id=priya_result.id, subject_id=sub_chem.id, subject_code="CHE104", subject_name="Chemistry", max_marks=100.0, obtained_marks=28.0, theory_marks=18.0, practical_marks=10.0, grade="F", status="FAIL"),
        ResultSubject(result_id=priya_result.id, subject_id=sub_bio.id, subject_code="BIO106", subject_name="Biology", max_marks=100.0, obtained_marks=84.0, theory_marks=59.0, practical_marks=25.0, grade="A2", status="PASS"),
    ]
    # Total: 76 + 68 + 62 + 28 + 84 = 318 / 500 = 63.6%
    db.add_all(priya_sub_results)

    # 6. Opportunities & Eligibility Rules
    opps = [
        Opportunity(
            title="Central University B.Tech / B.Sc (Hons) in Computer Science & AI Admissions",
            category="Higher Education",
            description="Direct merit-based and counselling admission into prestigious Central and State Universities for 4-year undergraduate degree programs in Computer Science, Data Science, and Information Technology.",
            eligibility_summary="Must have completed Class 12 (Science/Maths) with minimum 75% aggregate marks and clean pass in all core subjects.",
            min_percentage=75.0,
            stream_requirement="Science",
            application_start="2026-05-25",
            application_deadline="2026-09-20",
            official_source_id=src_counselling.id,
            source_authority="Central Admissions & University Allotment Committee",
            source_url="https://counselling.nic.in/degree-admissions",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="Class 12 Marksheet, Transfer Certificate, Conduct Certificate, Aadhaar Card, Passport Size Photos.",
            is_active=True
        ),
        Opportunity(
            title="State Government Engineering Colleges (TNEA Merit Quota)",
            category="Higher Education",
            description="Single-window counselling quota for seats in Government and Government-Aided Engineering Colleges across disciplines including Civil, Mechanical, EEE, ECE, and AI.",
            eligibility_summary="Minimum 60% overall marks with Mathematics, Physics, and Chemistry compulsory in Grade 12.",
            min_percentage=60.0,
            stream_requirement="Science",
            application_start="2026-05-20",
            application_deadline="2026-09-28",
            official_source_id=src_counselling.id,
            source_authority="Directorate of Technical Education (DOTE)",
            source_url="https://tneaonline.org",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="Marksheet, Community Certificate, Special Reservation Certificate (if applicable).",
            is_active=True
        ),
        Opportunity(
            title="Central Sector Scheme of Scholarship for College & University Students (CSSS)",
            category="Scholarships",
            description="Ministry of Education scholarship granting INR 12,000 per annum during undergraduate graduation to top 20th percentile board meritorious students.",
            eligibility_summary="Above 80th percentile (approx. >= 80% aggregate) in Class 12 board exams, family annual income below INR 4.5 Lakh.",
            min_percentage=80.0,
            stream_requirement="Any",
            application_start="2026-06-01",
            application_deadline="2026-10-31",
            official_source_id=src_scholarship.id,
            source_authority="Ministry of Education, Government of India",
            source_url="https://scholarships.gov.in/csss",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="Class 12 Marksheet, Income Certificate from Revenue Officer, Bank Passbook linked with Aadhaar.",
            is_active=True
        ),
        Opportunity(
            title="National Post-Matric Merit-cum-Means Education Grant",
            category="Scholarships",
            description="Financial scholarship for deserving students pursuing degree or diploma courses after passing standard 12 examinations.",
            eligibility_summary="Minimum 60% aggregate score in standard 12, annual family income <= INR 2.5 Lakh.",
            min_percentage=60.0,
            stream_requirement="Any",
            application_start="2026-06-15",
            application_deadline="2026-11-15",
            official_source_id=src_scholarship.id,
            source_authority="National Scholarship Portal (NSP)",
            source_url="https://scholarships.gov.in/post-matric",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="Income Certificate, Caste/Category Certificate, College Admission Proof.",
            is_active=True
        ),
        Opportunity(
            title="Government Polytechnic 3-Year Advanced Diploma in AI, Robotics & Mechatronics",
            category="Diploma Programs",
            description="Hands-on technical diploma programs in state polytechnic institutions with guaranteed industry internships and lateral entry into 2nd year B.Tech.",
            eligibility_summary="Pass in Class 10 or Class 12 (Any stream). Candidates awaiting supplementary clearance may also apply provisionally.",
            min_percentage=40.0,
            stream_requirement="Any",
            application_start="2026-05-15",
            application_deadline="2026-10-10",
            official_source_id=src_skill.id,
            source_authority="State Directorate of Technical Education",
            source_url="https://skillmission.gov.in/polytechnic",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="10th/12th Marksheet, Transfer Certificate, Aadhaar Card.",
            is_active=True
        ),
        Opportunity(
            title="State Diploma in Pharmacy (D.Pharm) & Paramedical Healthcare Sciences",
            category="Diploma Programs",
            description="2-year professional medical diploma recognized by Pharmacy Council of India (PCI) enabling licensure as a registered Pharmacist.",
            eligibility_summary="Passed Class 12 with Physics, Chemistry, and Biology/Mathematics with min 50% marks.",
            min_percentage=50.0,
            stream_requirement="Science",
            application_start="2026-06-01",
            application_deadline="2026-10-05",
            official_source_id=src_counselling.id,
            source_authority="State Paramedical & Pharmacy Admissions Board",
            source_url="https://health.gov.in/dpharm",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="Class 12 Marksheet with Science subjects, Medical Fitness Certificate, Transfer Certificate.",
            is_active=True
        ),
        Opportunity(
            title="PMKVY 4.0 National Skill Certification — Drone Technology & IoT Specialist",
            category="ITI / Skill Programs",
            description="Govt of India funded 6-month free skill training certification under Skill India with government stipend and direct placement assistance.",
            eligibility_summary="Passed Class 10 or Class 12. Open to all students irrespective of stream or minimum percentage.",
            min_percentage=0.0,
            stream_requirement="Any",
            application_start="2026-05-01",
            application_deadline="2026-10-20",
            official_source_id=src_skill.id,
            source_authority="National Skill Development Corporation (NSDC)",
            source_url="https://pmkvyofficial.org",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="Aadhaar Card, Bank Account Details, Marksheet Copy.",
            is_active=True
        ),
        Opportunity(
            title="Government ITI Computer Operator & Programming Assistant (COPA) Trade",
            category="ITI / Skill Programs",
            description="1-year NCVT certified technical course in Python, database administration, web fundamentals, and office automation.",
            eligibility_summary="10th or 12th standard pass or supplementary candidates seeking job-ready computer skills.",
            min_percentage=35.0,
            stream_requirement="Any",
            application_start="2026-05-10",
            application_deadline="2026-10-15",
            official_source_id=src_skill.id,
            source_authority="National Council for Vocational Training (NCVT)",
            source_url="https://ncvtmis.gov.in",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="Marksheet, Community Certificate, Identity Proof.",
            is_active=True
        ),
        Opportunity(
            title="JEE Main 2027 Registration & Government Preparation Window",
            category="Entrance Examinations",
            description="National Testing Agency (NTA) engineering entrance examination for NITs, IIITs, and Centrally Funded Technical Institutes.",
            eligibility_summary="Passed Class 12 with Physics, Mathematics, and Chemistry with minimum 75% marks (65% for SC/ST).",
            min_percentage=75.0,
            stream_requirement="Science",
            application_start="2026-11-01",
            application_deadline="2026-12-15",
            official_source_id=src_counselling.id,
            source_authority="National Testing Agency (NTA)",
            source_url="https://jeemain.nta.nic.in",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="Class 10 & 12 Certificates, Category Certificate, Scanned Photo & Signature.",
            is_active=True
        ),
        Opportunity(
            title="Free Higher Education Scheme for First-Generation Graduates (Tuition Waiver)",
            category="Government Educational Schemes",
            description="100% state government tuition reimbursement for professional degree admissions for students whose parents have not completed a degree.",
            eligibility_summary="First graduate in the family admitted through single-window government counselling.",
            min_percentage=45.0,
            stream_requirement="Any",
            application_start="2026-06-01",
            application_deadline="2026-10-15",
            official_source_id=src_counselling.id,
            source_authority="Department of Higher Education",
            source_url="https://highereducation.gov.in/first-gen",
            last_verified_date="2026-09-01",
            verification_status="VERIFIED",
            required_documents_summary="First Generation Graduate Certificate issued by Tahsildar, Parent Educational Declaration.",
            is_active=True
        )
    ]
    db.add_all(opps)
    db.flush()

    # Rules for opportunities
    # Rule for Central Univ B.Tech (Clean Pass, >= 75%)
    r1 = EligibilityRule(opportunity_id=opps[0].id, rule_type="RESULT_STATUS", condition_key="result_status", condition_operator="EQ", condition_value="PASS", explanation="Candidate must have cleared all subjects without compartment.")
    r2 = EligibilityRule(opportunity_id=opps[0].id, rule_type="MIN_PERCENTAGE", condition_key="overall_percentage", condition_operator="GTE", condition_value="75.0", explanation="Aggregate score must be at least 75%.")
    
    # Rule for CSSS Scholarship
    r3 = EligibilityRule(opportunity_id=opps[2].id, rule_type="MIN_PERCENTAGE", condition_key="overall_percentage", condition_operator="GTE", condition_value="80.0", explanation="Top 20th percentile cut-off is >= 80%.")
    r4 = EligibilityRule(opportunity_id=opps[2].id, rule_type="CATEGORY_MATCH", condition_key="income", condition_operator="LTE", condition_value="450000", explanation="Requires Income Certificate below INR 4.5 Lakh per annum.")
    
    # Rule for First Gen
    r5 = EligibilityRule(opportunity_id=opps[9].id, rule_type="CATEGORY_MATCH", condition_key="first_gen", condition_operator="EQ", condition_value="YES", explanation="Requires valid First Generation Certificate from Tahsildar.")

    db.add_all([r1, r2, r3, r4, r5])
    db.flush()

    # 7. Deadlines
    deadlines = [
        Deadline(
            title="Class 12 Revaluation & Verification Application Window",
            activity_type="REVALUATION",
            related_exam_opportunity="Higher Secondary Certificate (HSC 2026)",
            start_date="2026-05-20",
            deadline_date="2026-09-25",
            source_authority="Directorate of Government Examinations",
            source_url="https://dge.gov.in/revaluation",
            verification_status="VERIFIED",
            last_verified_date="2026-09-01",
            is_active=True
        ),
        Deadline(
            title="Class 12 Supplementary Examination Registration",
            activity_type="SUPPLEMENTARY",
            related_exam_opportunity="HSC 2026 Compartment Candidates",
            start_date="2026-05-25",
            deadline_date="2026-09-30",
            source_authority="State Board Supplementary Cell",
            source_url="https://dge.gov.in/supplementary",
            verification_status="VERIFIED",
            last_verified_date="2026-09-01",
            is_active=True
        ),
        Deadline(
            title="Central University Degree Admissions Round 1 Seat Allocation",
            activity_type="ADMISSION",
            related_exam_opportunity="Central University Admissions 2026",
            start_date="2026-05-25",
            deadline_date="2026-09-20",
            source_authority="Central Admissions Committee",
            source_url="https://counselling.nic.in",
            verification_status="VERIFIED",
            last_verified_date="2026-09-01",
            is_active=True
        ),
        Deadline(
            title="National Scholarship Portal (NSP) Fresh Online Applications",
            activity_type="SCHOLARSHIP",
            related_exam_opportunity="Central Sector Scheme (CSSS) & Post-Matric Grants",
            start_date="2026-06-01",
            deadline_date="2026-10-31",
            source_authority="Ministry of Education, GoI",
            source_url="https://scholarships.gov.in",
            verification_status="VERIFIED",
            last_verified_date="2026-09-01",
            is_active=True
        ),
        Deadline(
            title="Government Polytechnic & ITI Seat Allotment Round 2",
            activity_type="COUNSELLING",
            related_exam_opportunity="State Technical Education & ITI",
            start_date="2026-06-10",
            deadline_date="2026-10-10",
            source_authority="Directorate of Technical Education",
            source_url="https://skillmission.gov.in",
            verification_status="VERIFIED",
            last_verified_date="2026-09-01",
            is_active=True
        ),
        Deadline(
            title="First-Generation Graduate Tuition Waiver Verification",
            activity_type="COUNSELLING",
            related_exam_opportunity="Department of Higher Education Tuition Waiver",
            start_date="2026-06-01",
            deadline_date="2026-10-15",
            source_authority="Department of Higher Education",
            source_url="https://highereducation.gov.in",
            verification_status="VERIFIED",
            last_verified_date="2026-09-01",
            is_active=True
        )
    ]
    db.add_all(deadlines)
    db.flush()

    # 8. Document Requirements
    docs = [
        DocumentRequirement(
            name="Official Higher Secondary (Class 12) Marksheet",
            requirement_type="MANDATORY",
            description="Original or digitally verified DigiLocker e-marksheet with QR security verification code.",
            related_category="All Admissions & Schemes",
            issuing_authority="State Board of Examination / DGE",
            verification_tips="Verify that student name and date of birth match your Aadhaar card exactly."
        ),
        DocumentRequirement(
            name="Government Photo Identity Proof (Aadhaar / Voter ID / Passport)",
            requirement_type="MANDATORY",
            description="Valid government identity document linked with active mobile number for OTP verification.",
            related_category="All Applications",
            issuing_authority="UIDAI / Election Commission / Ministry of External Affairs",
            verification_tips="Ensure mobile number is linked with Aadhaar for e-KYC authentication."
        ),
        DocumentRequirement(
            name="School Transfer Certificate (TC) & Conduct Certificate",
            requirement_type="MANDATORY",
            description="Original transfer certificate issued by the principal of the last attended secondary school.",
            related_category="College Admissions",
            issuing_authority="School Principal / Headmaster",
            verification_tips="Must clearly state date of leaving, EMIS/PEN student number, and conduct status."
        ),
        DocumentRequirement(
            name="Community / Caste Certificate (OBC / SC / ST / EWS)",
            requirement_type="CONDITIONAL",
            description="Permanent community certificate with digital signature issued by competent Revenue official.",
            related_category="Reservation Quota & Scholarships",
            issuing_authority="Zonal Deputy Tahsildar / Revenue Divisional Officer (RDO)",
            verification_tips="Ensure caste code matches state and central gazette list."
        ),
        DocumentRequirement(
            name="Income Certificate (Current Financial Year)",
            requirement_type="CONDITIONAL",
            description="Official certificate declaring total annual family income from all sources.",
            related_category="Government Scholarships & Fee Waivers",
            issuing_authority="Revenue Department / Tahsildar",
            verification_tips="Must be issued within the last 6 months to be valid for 2026 scholarship schemes."
        ),
        DocumentRequirement(
            name="First-Generation Graduate Certificate",
            requirement_type="CONDITIONAL",
            description="Joint declaration certificate certifying that no family member has graduated.",
            related_category="Tuition Waiver Scheme",
            issuing_authority="Headquarters Deputy Tahsildar",
            verification_tips="Requires sibling education verification affidavit."
        ),
        DocumentRequirement(
            name="Migration Certificate",
            requirement_type="OPTIONAL",
            description="Required only when moving from State Board to Central University or other state boards.",
            related_category="Inter-state Admissions",
            issuing_authority="Examination Board Secretary",
            verification_tips="Can be downloaded from DigiLocker or requested via board online portal."
        ),
        DocumentRequirement(
            name="Recent Passport Size Photographs (White Background)",
            requirement_type="OPTIONAL",
            description="Standard 3.5cm x 4.5cm color photographs in JPG/PNG format (under 100 KB).",
            related_category="Application Portals",
            issuing_authority="Self / Studio",
            verification_tips="Face must cover 70-80% of photo area with neutral expression."
        )
    ]
    db.add_all(docs)
    db.flush()

    # Pre-mark Arun Kumar's primary documents as READY for realistic showcase
    arun_statuses = [
        StudentDocumentStatus(user_id=arun_user.id, document_id=docs[0].id, status="READY", notes="DigiLocker verified marksheet downloaded."),
        StudentDocumentStatus(user_id=arun_user.id, document_id=docs[1].id, status="READY", notes="Aadhaar card e-KYC active."),
        StudentDocumentStatus(user_id=arun_user.id, document_id=docs[2].id, status="READY", notes="Original TC collected from school office."),
        StudentDocumentStatus(user_id=arun_user.id, document_id=docs[3].id, status="PENDING", notes="Applying for renewed digital certificate at e-Seva center."),
        StudentDocumentStatus(user_id=arun_user.id, document_id=docs[4].id, status="PENDING", notes="Income verification under process."),
    ]
    db.add_all(arun_statuses)

    # Priya Sharma's documents
    priya_statuses = [
        StudentDocumentStatus(user_id=priya_user.id, document_id=docs[0].id, status="READY", notes="Provisional online copy downloaded."),
        StudentDocumentStatus(user_id=priya_user.id, document_id=docs[1].id, status="READY", notes="Aadhaar ready."),
        StudentDocumentStatus(user_id=priya_user.id, document_id=docs[2].id, status="PENDING", notes="Pending school TC collection."),
    ]
    db.add_all(priya_statuses)

    db.commit()
    print("[SUCCESS] SEED COMPLETED SUCCESSFULLY: Created Arun Kumar (84.2%), Priya Sharma (Compartment), Admin, 10 Opportunities, 6 Deadlines, 8 Document Requirements.")
