import axios from 'axios'

export const authEndpoint = "https://accounts.spotify.com/authorize"

const redirectUri = "http://localhost:5173/standby"

const clientId = '8fbcd37be4d04871bc6e482ea4b64807'

const scopes = [
     "user-read-private",
     "user-read-email",
     "user-follow-read"
]

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`

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
      setToken(newToken);
      setClientToken(newToken);
    }
  };
  
export default apiClient
