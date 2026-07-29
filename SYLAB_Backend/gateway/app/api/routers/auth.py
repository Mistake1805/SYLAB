import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, Response

from app.api.dependencies import get_auth_headers, get_core_client, require_token

router = APIRouter(tags=["Auth"])


@router.post("/api/auth/register")
async def register(body: dict, response: Response, client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.post("/api/auth/register", json=body)
    if "set-cookie" in res.headers:
        response.headers["set-cookie"] = res.headers["set-cookie"]
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.post("/api/auth/login")
async def login(body: dict, response: Response, client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.post("/api/auth/login", json=body)
    if "set-cookie" in res.headers:
        response.headers["set-cookie"] = res.headers["set-cookie"]
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.post("/api/auth/logout")
async def logout(response: Response, client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.post("/api/auth/logout")
    if "set-cookie" in res.headers:
        response.headers["set-cookie"] = res.headers["set-cookie"]
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.post("/api/auth/forgot-password")
async def forgot_password(body: dict, client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.post("/api/auth/forgot-password", json=body)
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.post("/api/auth/reset-password")
async def reset_password(body: dict, client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.post("/api/auth/reset-password", json=body)
    return JSONResponse(content=res.json(), status_code=res.status_code)


@router.get("/api/auth/me")
async def get_me(token: str = Depends(require_token), client: httpx.AsyncClient = Depends(get_core_client)):
    res = await client.get("/api/auth/me", headers=get_auth_headers(token))
    return JSONResponse(content=res.json(), status_code=res.status_code)
