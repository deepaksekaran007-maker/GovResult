from typing import List, Dict, Any
from app.models.entities import Result, ResultSubject, Student, RevaluationOption, SupplementaryExam, Deadline, StudentDocumentStatus, DocumentRequirement

def generate_recommended_next_steps(
    student: Student,
    result: Result,
    subjects: List[ResultSubject],
    reval_option: RevaluationOption,
    suppl_exam: SupplementaryExam,
    deadlines: List[Deadline],
    doc_statuses: List[StudentDocumentStatus],
    all_docs: List[DocumentRequirement]
) -> Dict[str, Any]:
    """
    Generates a personalized, prioritized Next-Step Action Plan based on student result state.
    """
    student_name = student.user.full_name if student and student.user else "Student"
    steps = []
    step_no = 1
    
    # Check result metrics
    pct = result.overall_percentage if result else 0.0
    status = result.result_status if result else "PENDING"
    failed_subjects = [s for s in subjects if s.status.upper() == "FAIL" or s.obtained_marks < (s.max_marks * 0.35)]
    ready_doc_ids = {s.document_id for s in doc_statuses if s.status == "READY"}
    pending_mandatory_docs = [d for d in all_docs if d.requirement_type == "MANDATORY" and d.id not in ready_doc_ids]

    # Step 1: Result Confirmation (Always Completed)
    steps.append({
        "step_number": step_no,
        "title": "Review Official Marksheet & Performance Analytics",
        "description": f"Your {result.examination.name if result and result.examination else 'Class 12'} marksheet has been processed with {pct}% aggregate score ({status}).",
        "status": "COMPLETED",
        "category": "RESULT",
        "action_text": "View Full Marksheet",
        "action_url": f"/results/{result.id if result else ''}",
        "priority": 10
    })
    step_no += 1

    # Scenario A: Compartment / Failed subject(s)
    if failed_subjects:
        fail_names = ", ".join([s.subject_name for s in failed_subjects])
        # Priority 1: Supplementary Registration
        steps.append({
            "step_number": step_no,
            "title": f"Register for Supplementary Exam ({fail_names})",
            "description": f"You are eligible to appear in the supplementary examination for {len(failed_subjects)} subject(s) to clear your certificate without losing an academic year.",
            "status": "URGENT",
            "category": "SUPPLEMENTARY",
            "action_text": "Apply for Supplementary",
            "action_url": "/revaluation",
            "priority": 1
        })
        step_no += 1

        # Priority 2: Revaluation / Total Verification option
        steps.append({
            "step_number": step_no,
            "title": "Apply for Answer Sheet Re-totalling / Revaluation",
            "description": "If you believe your marks were evaluated strictly or missed during calculation, submit a revaluation request before the board portal deadline.",
            "status": "RECOMMENDED",
            "category": "REVALUATION",
            "action_text": "Check Revaluation Details",
            "action_url": "/revaluation",
            "priority": 2
        })
        step_no += 1

    else:
        # Scenario B: Clean PASS
        # High Marks / Distinction
        if pct >= 75:
            steps.append({
                "step_number": step_no,
                "title": "Apply for Merit Scholarships & Central University Admissions",
                "description": f"With your outstanding score of {pct}%, you qualify for national and state merit scholarships with full tuition waivers.",
                "status": "RECOMMENDED",
                "category": "OPPORTUNITY",
                "action_text": "Explore Scholarships & Courses",
                "action_url": "/opportunities",
                "priority": 1
            })
            step_no += 1
        else:
            steps.append({
                "step_number": step_no,
                "title": "Explore Degree & Diploma Admissions",
                "description": f"Discover verified degree, polytechnic, and vocational skill programs matched to your aggregate of {pct}%.",
                "status": "RECOMMENDED",
                "category": "OPPORTUNITY",
                "action_text": "Browse Eligible Programs",
                "action_url": "/opportunities",
                "priority": 1
            })
            step_no += 1

        # Check if student has lower marks in any subject that could benefit from revaluation
        lowest_subject = min(subjects, key=lambda s: s.obtained_marks) if subjects else None
        if lowest_subject and lowest_subject.obtained_marks < 80:
            steps.append({
                "step_number": step_no,
                "title": f"Review Revaluation for {lowest_subject.subject_name} ({lowest_subject.obtained_marks:.0f}/{lowest_subject.max_marks:.0f})",
                "description": f"Revaluation window is open. You may request answer-sheet verification if you expect higher marks in {lowest_subject.subject_name}.",
                "status": "OPTIONAL",
                "category": "REVALUATION",
                "action_text": "Review Subject Revaluation",
                "action_url": "/revaluation",
                "priority": 4
            })
            step_no += 1

    # Document Readiness Step
    if pending_mandatory_docs:
        steps.append({
            "step_number": step_no,
            "title": f"Organize Mandatory Documents ({len(pending_mandatory_docs)} pending)",
            "description": f"Ensure your mandatory certificates ({', '.join([d.name for d in pending_mandatory_docs[:3]])}) are ready before counselling rounds begin.",
            "status": "PENDING" if not failed_subjects else "PENDING",
            "category": "DOCUMENT",
            "action_text": "Open Document Checklist",
            "action_url": "/documents",
            "priority": 3
        })
        step_no += 1
    else:
        steps.append({
            "step_number": step_no,
            "title": "Document Verification Preparation Complete",
            "description": "All primary required documents are marked as READY in your checklist.",
            "status": "COMPLETED",
            "category": "DOCUMENT",
            "action_text": "Review Checklist",
            "action_url": "/documents",
            "priority": 6
        })
        step_no += 1

    # Deadline Tracker & Reminders Step
    steps.append({
        "step_number": step_no,
        "title": "Set Automated Deadline Alerts (1, 3, 7 days prior)",
        "description": "Track admission counselling dates, scholarship submission deadlines, and revaluation cutoffs so you never miss an official window.",
        "status": "RECOMMENDED",
        "category": "DEADLINE",
        "action_text": "View Deadlines & Set Reminders",
        "action_url": "/deadlines",
        "priority": 5
    })
    step_no += 1

    # AI Counseling Consultation
    steps.append({
        "step_number": step_no,
        "title": "Consult GovResult AI Assistant for Personalized Course Pathways",
        "description": "Chat with our verified guidance assistant to get instant answers about eligibility rules, college cutoffs, and subject options.",
        "status": "RECOMMENDED",
        "category": "AI",
        "action_text": "Chat with GovResult AI",
        "action_url": "/ai-assistant",
        "priority": 7
    })

    # Overall Summary
    if failed_subjects:
        summary_msg = f"Attention {student_name}: Immediate action is required to register for your supplementary examination or revaluation before deadlines close."
    elif pct >= 75:
        summary_msg = f"Congratulations {student_name}! You have achieved Distinction ({pct}%). Prioritize scholarship applications and university seat allocations."
    else:
        summary_msg = f"Welcome {student_name}! You have cleared the exam with {pct}%. Follow your custom action plan below to secure your next educational admission."

    return {
        "student_name": student_name,
        "overall_status": status,
        "overall_percentage": pct,
        "summary_message": summary_msg,
        "action_plan": steps
    }
