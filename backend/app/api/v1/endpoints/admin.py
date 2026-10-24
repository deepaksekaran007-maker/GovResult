from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import (
    Examination, Subject, Result, ResultSubject, Opportunity,
    EligibilityRule, RevaluationOption, SupplementaryExam, Deadline,
    DocumentRequirement, OfficialSource, User, Student
)
from app.schemas.schemas import (
    OpportunityCreate, OpportunityOut, DeadlineCreate, DeadlineOut,
    OfficialSourceCreate, OfficialSourceOut, ExaminationOut
)
from app.api.deps import require_admin
from app.services.deadline_service import calculate_deadline_metrics

router = APIRouter()

# Overview Statistics for Admin Dashboard
@router.get("/overview")
def get_admin_overview(admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    total_students = db.query(Student).count()
    total_results = db.query(Result).count()
    total_opportunities = db.query(Opportunity).count()
    verified_opportunities = db.query(Opportunity).filter(Opportunity.verification_status == "VERIFIED").count()
    total_deadlines = db.query(Deadline).count()
    total_exams = db.query(Examination).count()
    
    return {
        "total_students": total_students,
        "total_results": total_results,
        "total_opportunities": total_opportunities,
        "verified_opportunities": verified_opportunities,
        "total_deadlines": total_deadlines,
        "total_exams": total_exams,
        "system_status": "ONLINE - ALL AUTHORITIES SYNCED"
    }

# Opportunities CRUD
@router.post("/opportunities", response_model=OpportunityOut)
def create_opportunity(opp_in: OpportunityCreate, admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    opp = Opportunity(**opp_in.dict())
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return opp

@router.put("/opportunities/{opp_id}", response_model=OpportunityOut)
def update_opportunity(opp_id: int, opp_in: OpportunityCreate, admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")
    for key, value in opp_in.dict().items():
        setattr(opp, key, value)
    db.commit()
    db.refresh(opp)
    return opp

@router.delete("/opportunities/{opp_id}")
def delete_opportunity(opp_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")
    db.delete(opp)
    db.commit()
    return {"message": "Opportunity deleted successfully."}

# Deadlines CRUD
@router.post("/deadlines", response_model=DeadlineOut)
def create_deadline(dl_in: DeadlineCreate, admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    dl = Deadline(**dl_in.dict())
    db.add(dl)
    db.commit()
    db.refresh(dl)
    days_rem, status_str = calculate_deadline_metrics(dl.deadline_date, dl.start_date)
    return {
        "id": dl.id,
        "title": dl.title,
        "activity_type": dl.activity_type,
        "related_exam_opportunity": dl.related_exam_opportunity,
        "start_date": dl.start_date,
        "deadline_date": dl.deadline_date,
        "days_remaining": days_rem,
        "status": status_str,
        "source_authority": dl.source_authority,
        "source_url": dl.source_url,
        "verification_status": dl.verification_status,
        "last_verified_date": dl.last_verified_date,
        "has_reminder_set": False
    }

@router.put("/deadlines/{dl_id}", response_model=DeadlineOut)
def update_deadline(dl_id: int, dl_in: DeadlineCreate, admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    dl = db.query(Deadline).filter(Deadline.id == dl_id).first()
    if not dl:
        raise HTTPException(status_code=404, detail="Deadline not found.")
    for key, value in dl_in.dict().items():
        setattr(dl, key, value)
    db.commit()
    db.refresh(dl)
    days_rem, status_str = calculate_deadline_metrics(dl.deadline_date, dl.start_date)
    return {
        "id": dl.id,
        "title": dl.title,
        "activity_type": dl.activity_type,
        "related_exam_opportunity": dl.related_exam_opportunity,
        "start_date": dl.start_date,
        "deadline_date": dl.deadline_date,
        "days_remaining": days_rem,
        "status": status_str,
        "source_authority": dl.source_authority,
        "source_url": dl.source_url,
        "verification_status": dl.verification_status,
        "last_verified_date": dl.last_verified_date,
        "has_reminder_set": False
    }

@router.delete("/deadlines/{dl_id}")
def delete_deadline(dl_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    dl = db.query(Deadline).filter(Deadline.id == dl_id).first()
    if not dl:
        raise HTTPException(status_code=404, detail="Deadline not found.")
    db.delete(dl)
    db.commit()
    return {"message": "Deadline deleted successfully."}

# Official Sources CRUD
@router.get("/sources", response_model=List[OfficialSourceOut])
def list_sources(admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    return db.query(OfficialSource).all()

@router.post("/sources", response_model=OfficialSourceOut)
def create_source(source_in: OfficialSourceCreate, admin: User = Depends(require_admin), db: Session = Depends(get_db)) -> Any:
    src = OfficialSource(**source_in.dict())
    db.add(src)
    db.commit()
    db.refresh(src)
    return src
