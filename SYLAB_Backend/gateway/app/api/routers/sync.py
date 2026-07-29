import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.dependencies import get_core_client, get_internal_headers

router = APIRouter(tags=["Sync (Internal)"])


@router.post("/api/sync/user/{user_id}")
async def sync_user(user_id: int, client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.post(f"/api/sync/user/{user_id}", headers=get_internal_headers())
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.post("/api/sync/all")
async def sync_all_users(client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.post("/api/sync/all", headers=get_internal_headers())
    return JSONResponse(content=res.json(), status_code=res.status_code)
