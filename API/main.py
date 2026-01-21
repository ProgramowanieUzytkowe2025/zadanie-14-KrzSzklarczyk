from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import SessionLocal, Base, engine

app = FastAPI(
    title="Lab 8 – Instytut i Naukowcy",
    description="CRUD dla tabeli naukowcy",
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def validate_edit_rules(naukowiec_in: schemas.NaukowiecBase):
    if naukowiec_in.lata_doswiadczenia > 60:
        raise HTTPException(
            status_code=400,
            detail="lata_doswiadczenia nie może być większe niż 60."
        )

from sqlalchemy import text

@app.get("/_debug/db")
def debug_db(db: Session = Depends(get_db)):
    server = db.execute(text("SELECT @@SERVERNAME")).scalar()
    dbname = db.execute(text("SELECT DB_NAME()")).scalar()
    count = db.execute(text("SELECT COUNT(*) FROM naukowcy")).scalar()
    return {"server": server, "database": dbname, "naukowcy_count": count}


@app.post("/naukowcy", response_model=schemas.Naukowiec, status_code=201)
def create_naukowiec(naukowiec_in: schemas.NaukowiecCreate, db: Session = Depends(get_db)):
    validate_edit_rules(naukowiec_in)

    naukowiec = models.Naukowiec(**naukowiec_in.dict())
    db.add(naukowiec)
    db.commit()
    db.refresh(naukowiec)
    return naukowiec

@app.get("/naukowcy", response_model=list[schemas.Naukowiec])
def read_naukowcy(
    aktywny: bool | None = Query(default=None),
    db: Session = Depends(get_db),
):
    q = db.query(models.Naukowiec)
    if aktywny is not None:
        q = q.filter(models.Naukowiec.aktywny == aktywny)
    return q.all()

@app.get("/naukowcy/{naukowiec_id}", response_model=schemas.Naukowiec)
def read_naukowiec(naukowiec_id: int, db: Session = Depends(get_db)):
    naukowiec = db.query(models.Naukowiec).filter(models.Naukowiec.id == naukowiec_id).first()
    if not naukowiec:
        raise HTTPException(status_code=404, detail="Naukowiec nie znaleziony")
    return naukowiec

@app.put("/naukowcy/{naukowiec_id}", response_model=schemas.Naukowiec)
def update_naukowiec(naukowiec_id: int, naukowiec_in: schemas.NaukowiecUpdate, db: Session = Depends(get_db)):
    validate_edit_rules(naukowiec_in)

    naukowiec = db.query(models.Naukowiec).filter(models.Naukowiec.id == naukowiec_id).first()
    if not naukowiec:
        raise HTTPException(status_code=404, detail="Naukowiec nie znaleziony")

    for key, value in naukowiec_in.dict().items():
        setattr(naukowiec, key, value)

    db.commit()
    db.refresh(naukowiec)
    return naukowiec

@app.delete("/naukowcy/{naukowiec_id}", status_code=204)
def delete_naukowiec(naukowiec_id: int, db: Session = Depends(get_db)):
    naukowiec = db.query(models.Naukowiec).filter(models.Naukowiec.id == naukowiec_id).first()
    if not naukowiec:
        raise HTTPException(status_code=404, detail="Naukowiec nie znaleziony")

    if naukowiec.aktywny is False:
        raise HTTPException(status_code=409, detail="Nie można usunąć rekordu, gdy aktywny=false.")

    db.delete(naukowiec)
    db.commit()
    return None
