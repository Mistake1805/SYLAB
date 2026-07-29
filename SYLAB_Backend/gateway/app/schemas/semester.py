from pydantic import BaseModel


class SemesterBase(BaseModel):
    name: str


class SemesterCreate(SemesterBase):
    pass
