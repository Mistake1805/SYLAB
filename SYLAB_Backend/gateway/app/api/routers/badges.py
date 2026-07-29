import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.dependencies import get_auth_headers, get_core_client, require_token

router = APIRouter(tags=["Badges"])


@router.get("/api/badges")
async def list_all_badges(client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.get("/api/badges")
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.get("/api/badges/me")
async def get_my_badges(
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.get("/api/users/me/badges", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)
