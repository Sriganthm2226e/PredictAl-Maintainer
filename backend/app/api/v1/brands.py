from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Brand, User
from app.schemas import BrandCreate, BrandOut
from app.auth.jwt import get_current_user
from app.tasks.social_fetch import fetch_and_process_brand_mentions

router = APIRouter()

@router.post("/", response_model=BrandOut, status_code=status.HTTP_201_CREATED)
def create_brand(
    brand_in: BrandCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Check if brand already exists
    existing = db.query(Brand).filter(Brand.name == brand_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Brand already exists"
        )
    
    # Create brand
    brand = Brand(
        name=brand_in.name,
        description=brand_in.description,
        owner_id=current_user.id
    )
    db.add(brand)
    db.commit()
    db.refresh(brand)
    
    # Trigger background job to fetch initial mentions using Celery
    try:
        fetch_and_process_brand_mentions.delay(brand.id)
    except Exception as e:
        # Logging Celery launch failure gracefully (e.g. if Redis isn't running)
        print(f"Warning: Failed to queue Celery task: {e}")
        
    return brand

@router.get("/", response_model=List[BrandOut])
def get_brands(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return db.query(Brand).filter(Brand.owner_id == current_user.id).all()

@router.get("/{brand_id}", response_model=BrandOut)
def get_brand(
    brand_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.owner_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )
    return brand

@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brand(
    brand_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.owner_id == current_user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )
    db.delete(brand)
    db.commit()
    return None
