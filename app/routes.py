from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db

router = APIRouter()

@router.get("/api/items")
def read_items(db: Session = Depends(get_db)):
    # Aquí puedes interactuar con la base de datos
    return {"items": ["item1", "item2", "item3"]}
