from pydantic import BaseModel


class NaukowiecBase(BaseModel):
    imie: str
    nazwisko: str
    instytut: str
    lata_doswiadczenia: int
    aktywny: bool


class NaukowiecCreate(NaukowiecBase):
    pass


class NaukowiecUpdate(NaukowiecBase):
    pass


class Naukowiec(NaukowiecBase):
    id: int

    class Config:
        orm_mode = True
