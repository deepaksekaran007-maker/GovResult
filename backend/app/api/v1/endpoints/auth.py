from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.entities import User, Student, Examination, Result, ResultSubject
from app.schemas.schemas import UserCreate, UserLogin, Token, UserOut
from app.api.deps import get_current_user, require_current_user

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )
    
    # Create user
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        mobile_number=user_in.mobile_number,
        role="student",
        is_active=True
    )
    db.add(user)
    db.flush()

    # Generate a registration number for the student
    reg_no = f"REG2026{user.id:04d}"
    student = Student(
        user_id=user.id,
        registration_number=reg_no,
        roll_number=f"ROLL{user.id:04d}",
        stream="Science",
        category="General"
    )
    db.add(student)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "registration_number": student.registration_number,
        "student_id": student.id
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please check your credentials."
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account.")

    student = user.student_profile
    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "registration_number": student.registration_number if student else None,
        "student_id": student.id if student else None
    }

@router.get("/me", response_model=UserOut)
def get_me(user: User = Depends(require_current_user), db: Session = Depends(get_db)) -> Any:
    student = user.student_profile
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "mobile_number": user.mobile_number,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "registration_number": student.registration_number if student else None,
        "student_id": student.id if student else None
    }

@router.post("/demo-login/{demo_type}", response_model=Token)
def demo_login(demo_type: str, db: Session = Depends(get_db)) -> Any:
    """
    Convenient one-click switch for reviewers and students:
    - 'student1': Arun Kumar (Pass, 84.2%, Distinction)
    - 'student2': Priya Sharma (Compartment, 1 Subject Failed)
    - 'admin': Official Board Administrator
    """
    email_map = {
        "student1": "arun.kumar@govresult.demo",
        "student2": "priya.sharma@govresult.demo",
        "admin": "admin@govresult.nic.in"
    }
    
    target_email = email_map.get(demo_type.lower())
    if not target_email:
        raise HTTPException(status_code=400, detail="Invalid demo user type. Use 'student1', 'student2', or 'admin'.")

    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found. Please run seed script.")

    student = user.student_profile
    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "registration_number": student.registration_number if student else None,
        "student_id": student.id if student else None
    }
