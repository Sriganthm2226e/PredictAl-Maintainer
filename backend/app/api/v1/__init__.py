from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.brands import router as brands_router
from app.api.v1.mentions import router as mentions_router
from app.api.v1.test import router as test_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(brands_router, prefix="/brands", tags=["Brands"])
router.include_router(mentions_router, prefix="/mentions", tags=["Mentions"])
router.include_router(test_router, prefix="/test", tags=["Developer Testing"])
