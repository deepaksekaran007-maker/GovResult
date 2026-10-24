from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import (
    User, Student, Result, Opportunity, RevaluationOption, SupplementaryExam,
    Deadline, DocumentRequirement, AIConversation, AIMessage
)
from app.schemas.schemas import AIChatRequest, AIChatResponse
from app.services.analysis_service import calculate_result_analysis
from app.services.ai_assistant_service import generate_ai_assistant_reply
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(
    chat_in: AIChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    # Resolve student
    student = None
    if chat_in.student_id:
        student = db.query(Student).filter(Student.id == chat_in.student_id).first()
    elif user and user.student_profile:
        student = user.student_profile
    else:
        # Fallback to demo student 1 (Arun Kumar) for prototype preview if unauthenticated
        student = db.query(Student).first()

    latest_result = student.results[0] if student and student.results else None
    subjects = latest_result.subject_results if latest_result else []
    analysis = calculate_result_analysis(latest_result, subjects) if latest_result else {}

    exam_id = latest_result.examination_id if latest_result else 1
    opportunities = db.query(Opportunity).filter(Opportunity.is_active == True).limit(8).all()
    reval = db.query(RevaluationOption).filter(RevaluationOption.examination_id == exam_id).first()
    suppl = db.query(SupplementaryExam).filter(SupplementaryExam.examination_id == exam_id).first()
    deadlines = db.query(Deadline).filter(Deadline.is_active == True).limit(6).all()
    docs = db.query(DocumentRequirement).filter(DocumentRequirement.is_active == True).all()

    # Format structured context
    context_data = {
        "student_name": student.user.full_name if student and student.user else "Candidate",
        "registration_number": latest_result.registration_number if latest_result else "DEMO2026",
        "examination": latest_result.examination.name if latest_result and latest_result.examination else "Class 12 Board Exam",
        "year": latest_result.examination.year if latest_result and latest_result.examination else 2026,
        "result_status": latest_result.result_status if latest_result else "PASS",
        "overall_percentage": latest_result.overall_percentage if latest_result else 84.2,
        "overall_grade": latest_result.overall_grade if latest_result else "A2",
        "smart_analysis": {
            "highest_subject": analysis.get("highest_mark_subject"),
            "lowest_subject": analysis.get("lowest_mark_subject"),
            "strong_subjects": analysis.get("strong_subjects"),
            "improvement_areas": analysis.get("improvement_areas"),
            "passed_count": analysis.get("passed_subjects_count", 5),
            "failed_count": analysis.get("failed_subjects_count", 0),
        },
        "verified_revaluation": {
            "status": reval.status if reval else "AVAILABLE",
            "fee_per_subject": f"INR {reval.fee_per_subject:.0f}" if reval else "INR 500",
            "deadline": reval.application_deadline if reval else "2026-09-25",
            "source": reval.source_authority if reval else "State Examination Board"
        } if reval else {},
        "verified_supplementary": {
            "status": suppl.status if suppl else "AVAILABLE",
            "exam_date": suppl.exam_date if suppl else "2026-10-15",
            "application_deadline": suppl.application_deadline if suppl else "2026-09-30",
            "fee_per_subject": f"INR {suppl.fee_per_subject:.0f}" if suppl else "INR 350",
            "source": suppl.source_authority if suppl else "State Supplementary Cell"
        } if suppl else {},
        "verified_opportunities": [
            {
                "title": o.title,
                "category": o.category,
                "min_percentage": o.min_percentage,
                "deadline": o.application_deadline,
                "source": o.source_authority
            }
            for o in opportunities
        ],
        "verified_deadlines": [
            {
                "activity": d.title,
                "deadline_date": d.deadline_date,
                "source": d.source_authority
            }
            for d in deadlines
        ],
        "verified_documents": [d.name for d in docs]
    }

    # Handle conversation record
    conv = None
    if chat_in.conversation_id:
        conv = db.query(AIConversation).filter(AIConversation.id == chat_in.conversation_id).first()
    
    if not conv and user:
        conv = AIConversation(user_id=user.id, title=f"Consultation on {latest_result.examination.name if latest_result and latest_result.examination else 'Result'}")
        db.add(conv)
        db.commit()
        db.refresh(conv)

    conv_id = conv.id if conv else 1

    # Record User Message
    if conv:
        user_msg_record = AIMessage(
            conversation_id=conv.id,
            sender="user",
            content=chat_in.message,
            is_verified_grounded=True
        )
        db.add(user_msg_record)
        db.commit()

    # Generate grounded reply
    ai_result = await generate_ai_assistant_reply(chat_in.message, context_data)

    # Record Assistant Message
    if conv:
        assistant_msg_record = AIMessage(
            conversation_id=conv.id,
            sender="assistant",
            content=ai_result["reply"],
            is_verified_grounded=ai_result["is_verified_grounded"],
            metadata_json={"disclaimer": ai_result["disclaimer"]}
        )
        db.add(assistant_msg_record)
        db.commit()

    return {
        "conversation_id": conv_id,
        "reply": ai_result["reply"],
        "is_verified_grounded": ai_result["is_verified_grounded"],
        "disclaimer": ai_result["disclaimer"]
    }
