from fastapi import APIRouter, Depends

from app.api.dependencies import get_api_key

router = APIRouter(prefix="/semesters", tags=["semesters"])


@router.get("/")
def list_semesters(api_key: str = Depends(get_api_key)) -> dict[str, list[str]]:
    return {"semesters": ["Semester 1", "Semester 2"]}
