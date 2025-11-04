import axios from 'axios'

export const authEndpoint = "https://accounts.spotify.com/authorize"

const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "https://melodymatch-3ro0.onrender.com/auth/spotify/callback"

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '8fbcd37be4d04871bc6e482ea4b64807'

const scopes = [
     "user-read-private",
     "user-read-email",
     "user-follow-read"
]

const apiUrl = import.meta.env.VITE_API_URL || 'https://melodymatch-3ro0.onrender.com'

export const loginUrl = `${apiUrl}/auth/login`;


const apiClient = axios.create({
    baseURL: "https://api.spotify.com/v1/",
})

export const setClientToken = (token) => {
    apiClient.interceptors.request.use(async function(config){
        config.headers.Authorization ="Bearer " + token
        return config
    })
}

const refreshSpotifyToken = async () => {
  const refreshToken = window.localStorage.getItem("refresh_token");

  if (refreshToken) {
    const response = await fetch("/refresh_token", { // your server-side endpoint to handle the refresh
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    const { newToken } = await response.json();
    window.localStorage.setItem("token", newToken);
    setClientToken(newToken);  // set the refreshed token in apiclient
  }
};
  
export default apiClient
