"""
YouTube Music OAuth Handler
Manages OAuth 2.0 flow for YouTube Music API access
"""

import os
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
import logging

logger = logging.getLogger(__name__)

class YouTubeAuthHandler:
    """
    Handles YouTube Music OAuth authentication
    """
    
    def __init__(self):
        self.client_id = os.getenv('YOUTUBE_CLIENT_ID')
        self.client_secret = os.getenv('YOUTUBE_CLIENT_SECRET')
        self.redirect_uri = os.getenv('YOUTUBE_REDIRECT_URI', 'http://localhost:4000/auth/youtube-music/callback')
        
        if not self.client_id or not self.client_secret:
            raise ValueError("YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET must be set")
        
        self.scopes = [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtubepartner'
        ]
    
    def get_auth_url(self):
        """
        Generate OAuth authorization URL
        Returns: Authorization URL string
        """
        client_config = {
            "web": {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "redirect_uris": [self.redirect_uri],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        }
        
        flow = Flow.from_client_config(
            client_config,
            scopes=self.scopes,
            redirect_uri=self.redirect_uri
        )
        
        auth_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        logger.info(f"Generated auth URL: {auth_url}")
        return auth_url
    
    def exchange_code(self, code):
        """
        Exchange authorization code for access/refresh tokens
        Args:
            code: Authorization code from OAuth callback
        Returns:
            dict with access_token, refresh_token, expires_in
        """
        client_config = {
            "web": {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "redirect_uris": [self.redirect_uri],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        }
        
        flow = Flow.from_client_config(
            client_config,
            scopes=self.scopes,
            redirect_uri=self.redirect_uri
        )
        
        try:
            flow.fetch_token(code=code)
            credentials = flow.credentials
            
            return {
                "access_token": credentials.token,
                "refresh_token": credentials.refresh_token,
                "expires_in": 3600  # Google tokens typically expire in 1 hour
            }
        except Exception as e:
            logger.error(f"Token exchange failed: {str(e)}")
            raise Exception(f"Failed to exchange authorization code: {str(e)}")
    
    def refresh_token(self, refresh_token):
        """
        Refresh access token using refresh token
        Args:
            refresh_token: Refresh token
        Returns:
            dict with new access_token and expires_in
        """
        from google.auth.transport.requests import Request
        
        try:
            credentials = Credentials(
                token=None,
                refresh_token=refresh_token,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=self.client_id,
                client_secret=self.client_secret
            )
            
            credentials.refresh(Request())
            
            return {
                "access_token": credentials.token,
                "refresh_token": refresh_token,  # Refresh token stays the same
                "expires_in": 3600
            }
        except Exception as e:
            logger.error(f"Token refresh failed: {str(e)}")
            raise Exception(f"Failed to refresh token: {str(e)}")
