import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.dependencies import get_core_client

router = APIRouter(tags=["Compare"])


@router.get("/api/compare/{user_id_a}/{user_id_b}")
async def compare_users(
    user_id_a: int,
    user_id_b: int,
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.get(f"/api/compare/{user_id_a}/{user_id_b}")
    return JSONResponse(content=res.json(), status_code=res.status_code)
