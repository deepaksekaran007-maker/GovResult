from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Result, ResultSubject, Student, Examination
from app.schemas.schemas import ResultOut, ResultSubjectOut, ResultSearchRequest, ResultAnalysisOut
from app.services.analysis_service import calculate_result_analysis, compute_grade
from app.api.deps import get_current_user

router = APIRouter()

def serialize_result_full(result: Result) -> dict:
    subjects_out = []
    for s in result.subject_results:
        pct = round((s.obtained_marks / s.max_marks) * 100, 2) if s.max_marks > 0 else 0.0
        subjects_out.append(ResultSubjectOut(
            id=s.id,
            subject_code=s.subject_code,
            subject_name=s.subject_name,
            max_marks=s.max_marks,
            obtained_marks=s.obtained_marks,
            theory_marks=s.theory_marks,
            practical_marks=s.practical_marks,
            grade=s.grade or compute_grade(pct),
            status=s.status,
            percentage=pct
        ))

    student_name = result.student.user.full_name if (result.student and result.student.user) else "Student"
    
    return {
        "id": result.id,
        "student_id": result.student_id,
        "student_name": student_name,
        "registration_number": result.registration_number,
        "roll_number": result.roll_number,
        "examination_id": result.examination_id,
        "examination_name": result.examination.name if result.examination else "State Examination",
        "examination_year": result.examination.year if result.examination else 2026,
        "board_name": result.examination.board_name if result.examination else "State Board of Examinations",
        "result_status": result.result_status,
        "overall_percentage": result.overall_percentage,
        "overall_grade": result.overall_grade,
        "total_max_marks": result.total_max_marks,
        "total_obtained_marks": result.total_obtained_marks,
        "declaration_date": result.declaration_date,
        "official_remarks": result.official_remarks,
        "is_verified": result.is_verified,
        "subjects": subjects_out
    }

@router.post("/search", response_model=ResultOut)
def search_result(search_in: ResultSearchRequest, db: Session = Depends(get_db)) -> Any:
    # Query by Registration Number or Roll Number
    query = db.query(Result)
    
    reg_clean = search_in.registration_number.strip().upper()
    
    result = query.filter(
        (Result.registration_number.ilike(reg_clean)) | 
        (Result.roll_number.ilike(reg_clean))
    ).first()

    if not result:
        # Search by student table registration number
        student = db.query(Student).filter(
            (Student.registration_number.ilike(reg_clean)) |
            (Student.roll_number.ilike(reg_clean))
        ).first()
        if student and student.results:
            result = student.results[0]

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No examination result found for Registration / Roll Number '{search_in.registration_number}'. Please check the credentials and try again."
        )

    return serialize_result_full(result)

@router.get("/{result_id}", response_model=ResultOut)
def get_result_by_id(result_id: int, db: Session = Depends(get_db)) -> Any:
    result = db.query(Result).filter(Result.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found.")
    return serialize_result_full(result)

@router.get("/{result_id}/analysis", response_model=ResultAnalysisOut)
def get_result_analysis(result_id: int, db: Session = Depends(get_db)) -> Any:
    result = db.query(Result).filter(Result.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result record not found.")
    
    analysis = calculate_result_analysis(result, result.subject_results)
    return analysis

@router.get("/student/{student_id}", response_model=ResultOut)
def get_student_latest_result(student_id: int, db: Session = Depends(get_db)) -> Any:
    result = db.query(Result).filter(Result.student_id == student_id).order_by(Result.id.desc()).first()
    if not result:
        raise HTTPException(status_code=404, detail="No result record associated with this student profile.")
    return serialize_result_full(result)
