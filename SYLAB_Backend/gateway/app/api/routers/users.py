import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.dependencies import get_auth_headers, get_core_client, require_token

router = APIRouter(tags=["Users"])


@router.get("/api/users/{user_id}")
async def get_public_profile(user_id: int, client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.get(f"/api/users/{user_id}")
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.patch("/api/users/me")
async def update_profile(
    body: dict,
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.patch("/api/users/me", json=body, headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.post("/api/users/me/leetcode")
async def link_leetcode(
    body: dict,
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.post("/api/users/me/leetcode", json=body, headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.delete("/api/users/me/leetcode")
async def unlink_leetcode(
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.delete("/api/users/me/leetcode", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.get("/api/users/me/stats")
async def get_my_stats(
    token: str = Depends(require_token),
    client: httpx.AsyncClient = Depends(get_core_client),
):
    res = await client.get("/api/users/me/stats", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.get("/api/users/{user_id}/history")
async def get_user_history(user_id: int, client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.get(f"/api/users/{user_id}/history")
    return JSONResponse(content=res.json(), status_code=res.status_code)
