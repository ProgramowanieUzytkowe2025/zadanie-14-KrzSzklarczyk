from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class Naukowiec(Base):
    __tablename__ = "naukowcy"

    id = Column(Integer, primary_key=True, autoincrement=True)
    imie = Column(String(50), nullable=False)
    nazwisko = Column(String(50), nullable=False)
    instytut = Column(String(100), nullable=False)        # pole tekstowe
    lata_doswiadczenia = Column(Integer, nullable=False)  # pole liczbowe
    aktywny = Column(Boolean, nullable=False, default=True)  # pole bool
