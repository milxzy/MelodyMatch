"""
YouTube Music Data Fetcher
Uses YouTube Data API v3 to fetch user library data
"""

import requests
import logging

logger = logging.getLogger(__name__)

class YouTubeDataFetcher:
    """
    Fetches user library data from YouTube using Data API v3
    """
    
    def __init__(self):
        self.base_url = "https://www.googleapis.com/youtube/v3"
    
    def _make_request(self, endpoint, access_token, params=None):
        """
        Make authenticated request to YouTube API
        Args:
            endpoint: API endpoint
            access_token: User's access token
            params: Query parameters
        Returns:
            Response JSON
        """
        url = f"{self.base_url}/{endpoint}"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json"
        }
        
        try:
            response = requests.get(url, headers=headers, params=params or {})
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            if hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            raise Exception(f"YouTube API request failed: {str(e)}")
    
    def get_library_artists(self, access_token, limit=100):
        """
        Fetch user's library artists from subscriptions
        Args:
            access_token: User's access token
            limit: Maximum number of artists to fetch
        Returns:
            List of artist names
        """
        try:
            # Get user's channel subscriptions (music channels they follow)
            params = {
                'part': 'snippet',
                'mine': 'true',
                'maxResults': min(limit, 50),
                'order': 'relevance'
            }
            
            data = self._make_request('subscriptions', access_token, params)
            
            artists = []
            if 'items' in data:
                for item in data['items']:
                    channel_title = item.get('snippet', {}).get('title')
                    if channel_title:
                        artists.append(channel_title)
            
            logger.info(f"Fetched {len(artists)} subscribed channels (artists)")
            return artists
        except Exception as e:
            logger.error(f"Failed to fetch library artists: {str(e)}")
            # Return empty list on error rather than failing completely
            return []
    
    def get_library_playlists(self, access_token, limit=25):
        """
        Fetch user's playlists
        Args:
            access_token: User's access token
            limit: Maximum number of playlists
        Returns:
            List of playlist objects
        """
        try:
            params = {
                'part': 'snippet,contentDetails',
                'mine': 'true',
                'maxResults': min(limit, 50)
            }
            
            data = self._make_request('playlists', access_token, params)
            
            result = []
            if 'items' in data:
                for playlist in data['items']:
                    result.append({
                        "id": playlist.get('id'),
                        "name": playlist.get('snippet', {}).get('title'),
                        "trackCount": playlist.get('contentDetails', {}).get('itemCount', 0)
                    })
            
            logger.info(f"Fetched {len(result)} playlists")
            return result
        except Exception as e:
            logger.error(f"Failed to fetch playlists: {str(e)}")
            return []
    
    def extract_genres(self, access_token):
        """
        Extract genres from user's library
        YouTube Music doesn't have explicit genre API
        Args:
            access_token: User's access token
        Returns:
            List of genre names (placeholder - YouTube API doesn't provide genres)
        """
        try:
            # YouTube Data API v3 doesn't provide genre information
            # This would require additional services like:
            # 1. Last.fm API for artist genres
            # 2. Spotify API for track/artist genres
            # 3. MusicBrainz for metadata
            
            # For now, return common music genres as placeholder
            placeholder_genres = []
            
            logger.info(f"Extracted {len(placeholder_genres)} genres (YouTube API limitation)")
            return placeholder_genres
        except Exception as e:
            logger.error(f"Failed to extract genres: {str(e)}")
            return []
    
    def get_complete_library(self, access_token):
        """
        Fetch complete user library
        Args:
            access_token: User's access token
        Returns:
            dict with artists, genres, playlists, topTracks
        """
        try:
            artists = self.get_library_artists(access_token, limit=200)
            genres = self.extract_genres(access_token)
            playlists = self.get_library_playlists(access_token, limit=25)
            
            # Get liked videos as "top tracks"
            top_tracks = []
            try:
                params = {
                    'part': 'snippet',
                    'myRating': 'like',
                    'maxResults': 20,
                    'type': 'video',
                    'videoCategoryId': '10'  # Music category
                }
                
                data = self._make_request('videos', access_token, params)
                
                if 'items' in data:
                    for item in data['items']:
                        top_tracks.append({
                            "id": item.get('id'),
                            "name": item.get('snippet', {}).get('title'),
                            "artist": item.get('snippet', {}).get('channelTitle')
                        })
            except Exception as e:
                logger.warning(f"Could not fetch liked videos: {str(e)}")
            
            return {
                "artists": artists,
                "genres": genres,
                "playlists": playlists,
                "topTracks": top_tracks
            }
        except Exception as e:
            logger.error(f"Failed to fetch complete library: {str(e)}")
            raise Exception("Failed to fetch library data")
