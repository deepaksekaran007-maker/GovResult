from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import DocumentRequirement, StudentDocumentStatus, User
from app.schemas.schemas import DocumentItemOut, DocumentStatusUpdate
from app.api.deps import get_current_user, require_current_user
import datetime

router = APIRouter()

@router.get("", response_model=List[DocumentItemOut])
def get_documents(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    docs = db.query(DocumentRequirement).filter(DocumentRequirement.is_active == True).all()
    
    user_status_map = {}
    if user:
        statuses = db.query(StudentDocumentStatus).filter(StudentDocumentStatus.user_id == user.id).all()
        for s in statuses:
            user_status_map[s.document_id] = (s.status, s.notes, s.updated_at)

    output = []
    for doc in docs:
        st, notes, updated_at = user_status_map.get(doc.id, ("PENDING", None, None))
        output.append({
            "id": doc.id,
            "name": doc.name,
            "requirement_type": doc.requirement_type,
            "description": doc.description,
            "related_category": doc.related_category,
            "issuing_authority": doc.issuing_authority,
            "verification_tips": doc.verification_tips,
            "status": st,
            "notes": notes,
            "updated_at": updated_at
        })

    # Sort MANDATORY first, then CONDITIONAL, then OPTIONAL
    type_order = {"MANDATORY": 0, "CONDITIONAL": 1, "OPTIONAL": 2}
    output.sort(key=lambda x: type_order.get(x["requirement_type"], 3))
    return output

@router.post("/status", response_model=DocumentItemOut)
def update_document_status(
    update_in: DocumentStatusUpdate,
    user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
) -> Any:
    doc = db.query(DocumentRequirement).filter(DocumentRequirement.id == update_in.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document requirement not found.")

    doc_status = db.query(StudentDocumentStatus).filter(
        StudentDocumentStatus.user_id == user.id,
        StudentDocumentStatus.document_id == update_in.document_id
    ).first()

    if not doc_status:
        doc_status = StudentDocumentStatus(
            user_id=user.id,
            document_id=update_in.document_id,
            status=update_in.status.upper(),
            notes=update_in.notes
        )
        db.add(doc_status)
    else:
        doc_status.status = update_in.status.upper()
        if update_in.notes is not None:
            doc_status.notes = update_in.notes
        doc_status.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(doc_status)

    return {
        "id": doc.id,
        "name": doc.name,
        "requirement_type": doc.requirement_type,
        "description": doc.description,
        "related_category": doc.related_category,
        "issuing_authority": doc.issuing_authority,
        "verification_tips": doc.verification_tips,
        "status": doc_status.status,
        "notes": doc_status.notes,
        "updated_at": doc_status.updated_at
    }
