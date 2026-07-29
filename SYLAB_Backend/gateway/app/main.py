from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, badges, compare, friends, leaderboard, sync, users
from app.core.config import settings

app = FastAPI(
    title="SYLAB Gateway",
    description="API Gateway that proxies all requests to the Spring Boot coreservices backend.",
    version="1.0.0",
)

# CORS - allow all origins in dev, restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(friends.router)
app.include_router(leaderboard.router)
app.include_router(compare.router)
app.include_router(sync.router)
app.include_router(badges.router)


@app.get("/", tags=["Health"])
def read_root() -> dict[str, str]:
    return {"message": "SYLAB Gateway is running", "coreservices": settings.coreservices_base_url}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
