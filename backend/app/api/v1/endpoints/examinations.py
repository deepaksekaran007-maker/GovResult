from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Examination, Subject
from app.schemas.schemas import ExaminationOut, SubjectOut

router = APIRouter()

@router.get("", response_model=List[ExaminationOut])
def get_examinations(db: Session = Depends(get_db)) -> Any:
    exams = db.query(Examination).filter(Examination.is_active == True).all()
    return exams

@router.get("/{exam_id}", response_model=ExaminationOut)
def get_examination(exam_id: int, db: Session = Depends(get_db)) -> Any:
    exam = db.query(Examination).filter(Examination.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Examination not found.")
    return exam

@router.get("/{exam_id}/subjects", response_model=List[SubjectOut])
def get_examination_subjects(exam_id: int, db: Session = Depends(get_db)) -> Any:
    subjects = db.query(Subject).filter(Subject.examination_id == exam_id).all()
    return subjects
