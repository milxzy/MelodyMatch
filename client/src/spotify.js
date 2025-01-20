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
export default apiClient
