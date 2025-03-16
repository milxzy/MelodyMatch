"""
YouTube Music API Microservice
FastAPI service that wraps ytmusicapi for OAuth and data fetching
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import logging

from youtube_auth import YouTubeAuthHandler
from youtube_data import YouTubeDataFetcher

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="YouTube Music API Service")

# CORS configuration
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:4000').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize handlers
auth_handler = YouTubeAuthHandler()
data_fetcher = YouTubeDataFetcher()

# Request/Response models
class OAuthInitResponse(BaseModel):
    auth_url: str

class OAuthCallbackRequest(BaseModel):
    code: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserDataRequest(BaseModel):
    token: str
    limit: Optional[int] = 100

class LibraryResponse(BaseModel):
    artists: List[str]
    genres: List[str]
    playlists: List[dict]
    topTracks: List[dict]

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "service": "YouTube Music API"}

@app.post("/auth/initiate", response_model=OAuthInitResponse)
async def initiate_auth():
    """
    Initiate OAuth flow - returns authorization URL
    """
    try:
        auth_url = auth_handler.get_auth_url()
        logger.info("OAuth flow initiated")
        return {"auth_url": auth_url}
    except Exception as e:
        logger.error(f"OAuth initiation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/callback", response_model=TokenResponse)
async def handle_callback(request: OAuthCallbackRequest):
    """
    Handle OAuth callback - exchange code for tokens
    """
    try:
        tokens = auth_handler.exchange_code(request.code)
        logger.info("OAuth callback processed successfully")
        return tokens
    except Exception as e:
        logger.error(f"OAuth callback failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/token/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh access token using refresh token
    """
    try:
        tokens = auth_handler.refresh_token(request.refresh_token)
        logger.info("Token refreshed successfully")
        return tokens
    except Exception as e:
        logger.error(f"Token refresh failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/user/artists")
async def get_user_artists(token: str, limit: int = 100):
    """
    Fetch user's library artists
    """
    try:
        artists = data_fetcher.get_library_artists(token, limit)
        logger.info(f"Fetched {len(artists)} artists")
        return {"artists": artists}
    except Exception as e:
        logger.error(f"Failed to fetch artists: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/genres")
async def get_user_genres(token: str):
    """
    Fetch user's genres (inferred from library)
    """
    try:
        genres = data_fetcher.extract_genres(token)
        logger.info(f"Extracted {len(genres)} genres")
        return {"genres": genres}
    except Exception as e:
        logger.error(f"Failed to extract genres: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/library", response_model=LibraryResponse)
async def get_user_library(token: str):
    """
    Fetch complete user library (artists, genres, playlists, top tracks)
    """
    try:
        library = data_fetcher.get_complete_library(token)
        logger.info("Complete library fetched successfully")
        return library
    except Exception as e:
        logger.error(f"Failed to fetch library: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
