from pydantic import BaseModel


class TopicBase(BaseModel):
    title: str


class TopicCreate(TopicBase):
    pass
