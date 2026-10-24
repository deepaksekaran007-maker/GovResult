from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Deadline, ReminderNotification, User
from app.schemas.schemas import DeadlineOut, ReminderCreate, ReminderOut
from app.services.deadline_service import calculate_deadline_metrics, parse_date_safely
from app.api.deps import get_current_user, require_current_user
from datetime import timedelta

router = APIRouter()

@router.get("", response_model=List[DeadlineOut])
def get_deadlines(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    deadlines = db.query(Deadline).filter(Deadline.is_active == True).all()
    
    # Check user reminders map
    user_reminders = {}
    if user:
        reminders = db.query(ReminderNotification).filter(ReminderNotification.user_id == user.id).all()
        for r in reminders:
            user_reminders[r.deadline_id] = r.reminder_type

    output = []
    for d in deadlines:
        days_rem, status_str = calculate_deadline_metrics(d.deadline_date, d.start_date)
        has_rem = d.id in user_reminders
        output.append({
            "id": d.id,
            "title": d.title,
            "activity_type": d.activity_type,
            "related_exam_opportunity": d.related_exam_opportunity,
            "start_date": d.start_date,
            "deadline_date": d.deadline_date,
            "days_remaining": days_rem,
            "status": status_str,
            "source_authority": d.source_authority,
            "source_url": d.source_url,
            "verification_status": d.verification_status,
            "last_verified_date": d.last_verified_date,
            "has_reminder_set": has_rem,
            "reminder_type": user_reminders.get(d.id)
        })

    # Sort by nearest upcoming deadline
    output.sort(key=lambda x: (x["status"] == "CLOSED", x["days_remaining"]))
    return output

@router.post("/reminders", response_model=ReminderOut)
def set_reminder(
    reminder_in: ReminderCreate,
    user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
) -> Any:
    deadline = db.query(Deadline).filter(Deadline.id == reminder_in.deadline_id).first()
    if not deadline:
        raise HTTPException(status_code=404, detail="Deadline not found.")

    # Calculate target reminder date
    days_back = 3
    if reminder_in.reminder_type == "1_DAY_BEFORE":
        days_back = 1
    elif reminder_in.reminder_type == "7_DAYS_BEFORE":
        days_back = 7

    dl_date = parse_date_safely(deadline.deadline_date)
    rem_date = dl_date - timedelta(days=days_back)

    existing = db.query(ReminderNotification).filter(
        ReminderNotification.user_id == user.id,
        ReminderNotification.deadline_id == reminder_in.deadline_id
    ).first()

    if existing:
        existing.reminder_type = reminder_in.reminder_type
        existing.reminder_date = rem_date.strftime("%Y-%m-%d")
        db.commit()
        db.refresh(existing)
        return {
            "id": existing.id,
            "deadline_id": deadline.id,
            "deadline_title": deadline.title,
            "reminder_type": existing.reminder_type,
            "reminder_date": existing.reminder_date,
            "is_sent": existing.is_sent,
            "created_at": existing.created_at
        }

    new_rem = ReminderNotification(
        user_id=user.id,
        deadline_id=deadline.id,
        reminder_type=reminder_in.reminder_type,
        reminder_date=rem_date.strftime("%Y-%m-%d"),
        is_sent=False
    )
    db.add(new_rem)
    db.commit()
    db.refresh(new_rem)

    return {
        "id": new_rem.id,
        "deadline_id": deadline.id,
        "deadline_title": deadline.title,
        "reminder_type": new_rem.reminder_type,
        "reminder_date": new_rem.reminder_date,
        "is_sent": new_rem.is_sent,
        "created_at": new_rem.created_at
    }

@router.delete("/reminders/{deadline_id}")
def remove_reminder(
    deadline_id: int,
    user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
) -> Any:
    rem = db.query(ReminderNotification).filter(
        ReminderNotification.user_id == user.id,
        ReminderNotification.deadline_id == deadline_id
    ).first()
    if rem:
        db.delete(rem)
        db.commit()
    return {"message": "Reminder removed successfully."}
