from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Student, Result, RevaluationOption, SupplementaryExam, Deadline, StudentDocumentStatus, DocumentRequirement
from app.schemas.schemas import NextStepsResponse
from app.services.next_step_engine import generate_recommended_next_steps

router = APIRouter()

@router.get("/{student_id}", response_model=NextStepsResponse)
def get_student_next_steps(student_id: int, db: Session = Depends(get_db)) -> Any:
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    latest_result = student.results[0] if student.results else None
    subjects = latest_result.subject_results if latest_result else []
    
    exam_id = latest_result.examination_id if latest_result else 1
    reval = db.query(RevaluationOption).filter(RevaluationOption.examination_id == exam_id).first()
    suppl = db.query(SupplementaryExam).filter(SupplementaryExam.examination_id == exam_id).first()
    deadlines = db.query(Deadline).filter(Deadline.is_active == True).all()
    
    doc_statuses = db.query(StudentDocumentStatus).filter(StudentDocumentStatus.user_id == student.user_id).all()
    all_docs = db.query(DocumentRequirement).filter(DocumentRequirement.is_active == True).all()

    plan = generate_recommended_next_steps(
        student=student,
        result=latest_result,
        subjects=subjects,
        reval_option=reval,
        suppl_exam=suppl,
        deadlines=deadlines,
        doc_statuses=doc_statuses,
        all_docs=all_docs
    )
    return plan
