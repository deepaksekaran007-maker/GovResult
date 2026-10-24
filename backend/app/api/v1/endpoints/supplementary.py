from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import SupplementaryExam, Examination
from app.schemas.schemas import SupplementaryOut
from app.services.deadline_service import calculate_deadline_metrics

router = APIRouter()

@router.get("/{exam_id}", response_model=SupplementaryOut)
def get_supplementary_details(exam_id: int, db: Session = Depends(get_db)) -> Any:
    suppl = db.query(SupplementaryExam).filter(SupplementaryExam.examination_id == exam_id).first()
    if not suppl:
        exam = db.query(Examination).filter(Examination.id == exam_id).first()
        if not exam:
            raise HTTPException(status_code=404, detail="Examination not found.")
        return {
            "id": 0,
            "examination_id": exam.id,
            "examination_name": exam.name,
            "is_available": False,
            "status": "NOT_AVAILABLE",
            "exam_date": "N/A",
            "application_deadline": "N/A",
            "days_remaining": 0,
            "fee_per_subject": 0.0,
            "max_subjects_allowed": 0,
            "procedure_steps": ["Information not verified. Please check the official examination authority."],
            "required_documents": [],
            "source_authority": "Official Examination Authority",
            "source_url": "https://board.gov.in",
            "verification_status": "CHECK_REQUIRED",
            "last_verified_date": "2026-09-01",
            "eligible_subjects": []
        }

    days_rem, status = calculate_deadline_metrics(suppl.application_deadline)
    if status == "CLOSED":
        suppl_status = "CLOSED"
    else:
        suppl_status = suppl.status

    subjects = [s.name for s in suppl.examination.subjects] if suppl.examination else []

    return {
        "id": suppl.id,
        "examination_id": suppl.examination_id,
        "examination_name": suppl.examination.name if suppl.examination else "State Examination",
        "is_available": suppl.is_available,
        "status": suppl_status,
        "exam_date": suppl.exam_date,
        "application_deadline": suppl.application_deadline,
        "days_remaining": max(0, days_rem),
        "fee_per_subject": suppl.fee_per_subject,
        "max_subjects_allowed": suppl.max_subjects_allowed,
        "procedure_steps": suppl.procedure_steps or [],
        "required_documents": suppl.required_documents or [],
        "source_authority": suppl.source_authority,
        "source_url": suppl.source_url,
        "verification_status": suppl.verification_status,
        "last_verified_date": suppl.last_verified_date,
        "eligible_subjects": subjects
    }
