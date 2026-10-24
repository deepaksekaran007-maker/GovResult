from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Opportunity, Student, Result
from app.schemas.schemas import OpportunityOut
from app.services.eligibility_engine import evaluate_opportunity_eligibility
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[OpportunityOut])
def get_opportunities(
    category: Optional[str] = Query(None, description="Category filter"),
    search: Optional[str] = Query(None, description="Search term"),
    student_id: Optional[int] = Query(None, description="Evaluate eligibility for this student"),
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(Opportunity).filter(Opportunity.is_active == True)
    
    if category and category.lower() != "all":
        query = query.filter(Opportunity.category == category)
    
    if search:
        s_term = f"%{search.strip()}%"
        query = query.filter((Opportunity.title.ilike(s_term)) | (Opportunity.description.ilike(s_term)))

    opportunities = query.all()

    # If student_id is provided, compute personalized eligibility status
    student = None
    latest_result = None
    if student_id:
        student = db.query(Student).filter(Student.id == student_id).first()
        if student and student.results:
            latest_result = student.results[0]

    output = []
    for opp in opportunities:
        status = "CHECK_REQUIRED"
        reasons = []
        if student and latest_result:
            status, reasons = evaluate_opportunity_eligibility(
                opp, latest_result, latest_result.subject_results, student
            )
        elif opp.verification_status != "VERIFIED":
            status = "CHECK_REQUIRED"
            reasons = ["Administrative verification pending for this scheme."]
        else:
            status = "CHECK_REQUIRED"
            reasons = ["Login or check your marks to determine exact eligibility."]

        opp_dict = {
            "id": opp.id,
            "title": opp.title,
            "category": opp.category,
            "description": opp.description,
            "eligibility_summary": opp.eligibility_summary,
            "min_percentage": opp.min_percentage,
            "stream_requirement": opp.stream_requirement,
            "application_start": opp.application_start,
            "application_deadline": opp.application_deadline,
            "source_authority": opp.source_authority,
            "source_url": opp.source_url,
            "last_verified_date": opp.last_verified_date,
            "verification_status": opp.verification_status,
            "required_documents_summary": opp.required_documents_summary,
            "is_active": opp.is_active,
            "student_eligibility_status": status,
            "student_eligibility_reasons": reasons
        }
        output.append(opp_dict)

    # Sort so ELIGIBLE comes first, then CHECK_REQUIRED, then NOT_ELIGIBLE
    status_order = {"ELIGIBLE": 0, "CHECK_REQUIRED": 1, "NOT_ELIGIBLE": 2}
    output.sort(key=lambda x: status_order.get(x["student_eligibility_status"], 3))
    return output

@router.get("/eligible/{student_id}", response_model=List[OpportunityOut])
def get_eligible_opportunities_for_student(student_id: int, db: Session = Depends(get_db)) -> Any:
    return get_opportunities(category=None, search=None, student_id=student_id, db=db)

@router.get("/{opp_id}", response_model=OpportunityOut)
def get_opportunity(opp_id: int, db: Session = Depends(get_db)) -> Any:
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")
    return opp
