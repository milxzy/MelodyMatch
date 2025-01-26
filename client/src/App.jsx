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
    const token = window.localStorage.getItem("token");
    const hash = window.location.hash;
    window.location.hash = "";
    if (!token && hash) {
      const _token = hash.split("&")[0].split("=")[1];
      window.localStorage.setItem("token", _token);
      console.log(_token);
      setToken(_token);
      setClientToken(_token);
    } else {
      setToken(token);
      setClientToken(token);
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
          <Route path="/profilequestion" element={<ProtectedRoute token={token}><ProfileQuestion /></ProtectedRoute>} /> // protect
          <Route path="/profile" element={<Profile />}></Route> // protect
          <Route path="/matches" element={<Matches />}></Route> // protect
          <Route path ="/messaging" element={<Messaging />}></Route> // protect
        </Routes>
      </div>
    </Router>
  );
}




export default App;
