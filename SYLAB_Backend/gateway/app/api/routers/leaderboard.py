import httpx
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse

from app.api.dependencies import get_auth_headers, get_core_client, require_token

router = APIRouter(tags=["Leaderboard"])


@router.get("/api/leaderboard")
async def get_global_leaderboard(
    page: int = Query(0, ge=0),
    size: int = Query(20, ge=1, le=100),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.get("/api/leaderboard", params={"page": page, "size": size})
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.get("/api/leaderboard/friends")
async def get_friends_leaderboard(
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.get("/api/leaderboard/friends", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)
