import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import Login from "./components/Login";
import Welcome from "./components/Welcome";
import ProfileQuestion from "./components/ProfileQuestion.jsx";
import Profile from "./components/Profile";
import Standby from "./components/Standby.jsx";
import Matches from "./components/Matches.jsx";
import Auth from "./components/Auth.jsx";
import BeLogin from "./components/BeLogin.jsx";
import BeRegister from "./components/BeRegister.jsx";
import MatchesList from "./components/MatchesList.jsx";
import SignUp from "./components/SignUp.jsx";
import Messaging from "./components/Messaging.jsx";
import { setClientToken } from "./spotify";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("access_token");

    if (!storedToken && tokenFromUrl) {
      window.localStorage.setItem("token", tokenFromUrl);
      setToken(tokenFromUrl);
      setClientToken(tokenFromUrl);
    } else if (storedToken) {
      setToken(storedToken);
      setClientToken(storedToken);
    }
  }, []);

  return (
    <ChakraProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Auth />} />
            <Route path="/belogin" element={<BeLogin />} />
            <Route path="/beregister" element={<BeRegister />} />
            <Route path="/spotify" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/standby" element={<Standby />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Protected Routes */}
            <Route path="/matcheslist" element={<MatchesList />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/profilequestion" element={<ProfileQuestion />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/messaging" element={<Messaging />} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
