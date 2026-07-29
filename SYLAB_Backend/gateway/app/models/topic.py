from dataclasses import dataclass


@dataclass
class Topic:
    id: int | None = None
    title: str = ""
