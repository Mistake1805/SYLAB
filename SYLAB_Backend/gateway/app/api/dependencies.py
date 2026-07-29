from fastapi import Depends, Header, HTTPException


def get_api_key(x_api_key: str | None = Header(default=None)) -> str:
    if x_api_key != "demo-api-key":
        raise HTTPException(status_code=403, detail="Invalid API key")
    return x_api_key
