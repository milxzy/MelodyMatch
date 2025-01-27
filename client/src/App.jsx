import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import ProfileQuestion from "./components/ProfileQuestion.jsx";
import Profile from "./components/Profile";
import SpotifyWebApi from "spotify-web-api-js";
import Standby from "./components/Standby.jsx";
import Matches from "./components/Matches.jsx";
import UserCard from "./components/UserCard.jsx";
import Auth from "./components/Auth.jsx"
import BeLogin from "./components/BeLogin.jsx";
import BeRegister from "./components/BeRegister.jsx";
import MatchesList from "./components/MatchesList.jsx";
import Header from "./components/Header.jsx";
import Messaging from "./components/Messaging.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

const spotify = new SpotifyWebApi();

import {
  HashRouter,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { setClientToken } from "./spotify";
import SignUp from "./components/SignUp.jsx";


function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check if the token is already stored in localStorage
    const storedToken = window.localStorage.getItem("token");
    
    // Get the hash part from the URL
    const hash = window.location.hash;
    
    // Clear the hash from the URL (to avoid it persisting after page reload)
    window.location.hash = "";
  
    // If no token is found in localStorage and there's a hash in the URL, extract the token from the hash
    if (!storedToken && hash) {
      const tokenFromHash = hash.split("&")[0].split("=")[1]; // Extract token value from hash
  
      // Store the token in localStorage and update the state
      window.localStorage.setItem("token", tokenFromHash);
      console.log("Token from URL hash:", tokenFromHash);
      setToken(tokenFromHash);
      setClientToken(tokenFromHash);
    } else {
      // If the token is found in localStorage, use it
      setToken(storedToken);
      setClientToken(storedToken);
    }
  }, []);
  

  return  (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Auth />}></Route> // dont protect
          <Route path="/belogin" element={<BeLogin />}></Route> // dont protect
          <Route path="/beregister" element={<BeRegister />}></Route> // dont protect
          <Route path="/spotify" element={<Login />}></Route> // dont protect
          <Route path="/signup" element={<SignUp />}></Route> // dont protect
          <Route path="/standby" element={<Standby />}></Route> // dont protect

          <Route path ="/matcheslist" element={<MatchesList />}></Route> // protect
          <Route path="/welcome" element={<Welcome />}></Route> // protect
          <Route path="/profilequestion" element={<ProfileQuestion />}></Route>  // protect
          <Route path="/profile" element={<Profile />}></Route> // protect
          <Route path="/matches" element={<Matches />}></Route> // protect
          <Route path ="/messaging" element={<Messaging />}></Route> // protect
        </Routes>
      </div>
    </Router>
  );
}




export default App;
