from dataclasses import dataclass


@dataclass
class Semester:
    id: int | None = None
    name: str = ""
