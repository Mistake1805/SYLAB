import httpx
from fastapi import Depends, Header, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

# Bearer token extractor for protected endpoints
bearer_scheme = HTTPBearer(auto_error=False)


async def get_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> str | None:
    """Extracts the Bearer token from the Authorization header, if present."""
    if credentials:
        return credentials.credentials
    return None


async def require_token(token: str | None = Depends(get_token)) -> str:
    """Same as get_token but raises 401 if missing."""
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required. Please log in.")
    return token


async def get_core_client() -> httpx.AsyncClient:
    """Returns a preconfigured async HTTP client pointing at coreservices."""
    async with httpx.AsyncClient(base_url=settings.coreservices_base_url, timeout=15.0) as client:
        yield client


def get_auth_headers(token: str) -> dict:
    """Returns Authorization header dict for forwarding the JWT to coreservices."""
    return {"Authorization": f"Bearer {token}"}


def get_internal_headers() -> dict:
    """Returns internal sync secret header for protected sync endpoints."""
    return {"X-Internal-Secret": settings.internal_sync_secret}
