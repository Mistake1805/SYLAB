import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.dependencies import get_auth_headers, get_core_client, require_token

router = APIRouter(tags=["Friends"])


@router.get("/api/friends")
async def list_friends(
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.get("/api/friends/", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.post("/api/friends/request/{target_user_id}")
async def send_friend_request(
    target_user_id: int,
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.post(f"/api/friends/request/{target_user_id}", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.post("/api/friends/accept/{friendship_id}")
async def accept_friend_request(
    friendship_id: int,
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.post(f"/api/friends/accept/{friendship_id}", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.delete("/api/friends/{friendship_id}")
async def remove_friend(
    friendship_id: int,
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.delete(f"/api/friends/{friendship_id}", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)
