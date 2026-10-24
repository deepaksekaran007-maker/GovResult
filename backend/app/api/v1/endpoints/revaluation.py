from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import RevaluationOption, Examination, Result
from app.schemas.schemas import RevaluationOut
from app.services.deadline_service import calculate_deadline_metrics

router = APIRouter()

@router.get("/{exam_id}", response_model=RevaluationOut)
def get_revaluation_details(exam_id: int, db: Session = Depends(get_db)) -> Any:
    reval = db.query(RevaluationOption).filter(RevaluationOption.examination_id == exam_id).first()
    if not reval:
        # Check if examination exists
        exam = db.query(Examination).filter(Examination.id == exam_id).first()
        if not exam:
            raise HTTPException(status_code=404, detail="Examination not found.")
        # Return default verified notice
        return {
            "id": 0,
            "examination_id": exam.id,
            "examination_name": exam.name,
            "is_available": False,
            "status": "NOT_AVAILABLE",
            "fee_per_subject": 0.0,
            "application_start": "N/A",
            "application_deadline": "N/A",
            "days_remaining": 0,
            "procedure_steps": ["Information not verified. Please check the official examination authority."],
            "eligible_criteria": "Information not verified.",
            "source_authority": "Official Examination Authority",
            "source_url": "https://board.gov.in",
            "verification_status": "CHECK_REQUIRED",
            "last_verified_date": "2026-09-01",
            "eligible_subjects": []
        }

    days_rem, status = calculate_deadline_metrics(reval.application_deadline, reval.application_start)
    if status == "CLOSED":
        reval_status = "CLOSED"
    else:
        reval_status = reval.status

    # Get subjects list for the exam
    subjects = [s.name for s in reval.examination.subjects] if reval.examination else []

    return {
        "id": reval.id,
        "examination_id": reval.examination_id,
        "examination_name": reval.examination.name if reval.examination else "State Examination",
        "is_available": reval.is_available,
        "status": reval_status,
        "fee_per_subject": reval.fee_per_subject,
        "application_start": reval.application_start,
        "application_deadline": reval.application_deadline,
        "days_remaining": max(0, days_rem),
        "procedure_steps": reval.procedure_steps or [],
        "eligible_criteria": reval.eligible_criteria or "All students who appeared for the exam",
        "source_authority": reval.source_authority,
        "source_url": reval.source_url,
        "verification_status": reval.verification_status,
        "last_verified_date": reval.last_verified_date,
        "eligible_subjects": subjects
    }
