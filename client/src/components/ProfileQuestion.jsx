import {React, useEffect} from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const ProfileQuestion = () => {

  useEffect(() => {
     const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
  })


  return (
    <div>
      <h1>Would you like to see your profile?</h1>
      <Link to="/Profile">Yes</Link>
      <Link to="/">No</Link>
    </div>
  );
};

export default ProfileQuestion;
