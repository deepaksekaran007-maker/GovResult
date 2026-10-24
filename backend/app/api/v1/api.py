from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    examinations,
    results,
    opportunities,
    revaluation,
    supplementary,
    deadlines,
    documents,
    next_steps,
    ai,
    admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(examinations.router, prefix="/examinations", tags=["Examinations"])
api_router.include_router(results.router, prefix="/results", tags=["Results & Analysis"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Opportunities Engine"])
api_router.include_router(revaluation.router, prefix="/revaluation", tags=["Revaluation Module"])
api_router.include_router(supplementary.router, prefix="/supplementary", tags=["Supplementary Module"])
api_router.include_router(deadlines.router, prefix="/deadlines", tags=["Deadlines & Reminders"])
api_router.include_router(documents.router, prefix="/documents", tags=["Document Checklist"])
api_router.include_router(next_steps.router, prefix="/next-steps", tags=["Recommended Next Steps"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Result Assistant"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Portal"])
