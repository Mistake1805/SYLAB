from fastapi import FastAPI

from app.api.routers import semesters
from app.core.config import settings

app = FastAPI(title=settings.app_name)
app.include_router(semesters.router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Gateway API is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
