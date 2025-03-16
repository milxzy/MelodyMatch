"""
YouTube Music Data Fetcher
Uses ytmusicapi to fetch user library data
"""

from ytmusicapi import YTMusic
import logging

logger = logging.getLogger(__name__)

class YouTubeDataFetcher:
    """
    Fetches user library data from YouTube Music
    """
    
    def __init__(self):
        self.ytmusic = None
    
    def authenticate(self, access_token):
        """
        Initialize YTMusic with user authentication
        Args:
            access_token: User's access token
        """
        try:
            # YTMusic can use browser headers for authentication
            # This is a simplified version - in production, use proper OAuth headers
            headers = {
                "Authorization": f"Bearer {access_token}"
            }
            self.ytmusic = YTMusic(auth=headers)
        except Exception as e:
            logger.error(f"Authentication failed: {str(e)}")
            raise Exception("Failed to authenticate with YouTube Music")
    
    def get_library_artists(self, access_token, limit=100):
        """
        Fetch user's library artists
        Args:
            access_token: User's access token
            limit: Maximum number of artists to fetch
        Returns:
            List of artist names
        """
        try:
            self.authenticate(access_token)
            
            # Get library artists
            library_artists = self.ytmusic.get_library_artists(limit=limit)
            
            artists = []
            for artist in library_artists:
                name = artist.get('artist') or artist.get('name')
                if name:
                    artists.append(name)
            
            logger.info(f"Fetched {len(artists)} library artists")
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
            self.authenticate(access_token)
            
            playlists = self.ytmusic.get_library_playlists(limit=limit)
            
            result = []
            for playlist in playlists:
                result.append({
                    "id": playlist.get('playlistId'),
                    "name": playlist.get('title'),
                    "trackCount": playlist.get('count', 0)
                })
            
            logger.info(f"Fetched {len(result)} playlists")
            return result
        except Exception as e:
            logger.error(f"Failed to fetch playlists: {str(e)}")
            return []
    
    def extract_genres(self, access_token):
        """
        Extract genres from user's library
        YouTube Music doesn't have explicit genre API, so we infer from songs/artists
        Args:
            access_token: User's access token
        Returns:
            List of genre names
        """
        try:
            self.authenticate(access_token)
            
            genres = set()
            
            # Get liked songs to extract genres
            try:
                liked_songs = self.ytmusic.get_liked_songs(limit=100)
                
                if 'tracks' in liked_songs:
                    for track in liked_songs['tracks']:
                        # YouTube Music doesn't expose genres directly
                        # This is a limitation - we'd need to use a separate genre API
                        # or maintain our own artist-to-genre mapping
                        pass
            except Exception as e:
                logger.warning(f"Could not fetch liked songs: {str(e)}")
            
            # For now, return empty genres
            # In production, you'd want to:
            # 1. Use a separate music metadata API (like MusicBrainz)
            # 2. Maintain your own artist-to-genre database
            # 3. Use ML to classify genres from song titles/artists
            
            logger.info(f"Extracted {len(genres)} genres (limited by YouTube Music API)")
            return list(genres)
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
            
            # Get recently played as "top tracks"
            top_tracks = []
            try:
                self.authenticate(access_token)
                history = self.ytmusic.get_history()
                
                for item in history[:20]:  # Top 20 recent tracks
                    if 'videoId' in item:
                        top_tracks.append({
                            "id": item['videoId'],
                            "name": item.get('title'),
                            "artist": item.get('artists', [{}])[0].get('name') if item.get('artists') else None
                        })
            except Exception as e:
                logger.warning(f"Could not fetch history: {str(e)}")
            
            return {
                "artists": artists,
                "genres": genres,
                "playlists": playlists,
                "topTracks": top_tracks
            }
        except Exception as e:
            logger.error(f"Failed to fetch complete library: {str(e)}")
            raise Exception("Failed to fetch library data")
