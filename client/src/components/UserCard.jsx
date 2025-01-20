import React, { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

const UserCard = ({
  profilePic,
  name,
  handleNextMatch,
  handlePreviousMatch,
}) => {
  const handleLike = () => {
    console.log("like");
  };

  const handlePass = () => {
    console.log("pass");
  };

  return (
    <>
      <div className="border-2 border-sky-500">
        <h2>UserCard</h2>
        <img src={profilePic} alt="" />
        <h3>name: {name}</h3>
        <button
          style={{ border: "2px solid red", padding: "5px" }}
          onClick={handleNextMatch}
        >
          Like
        </button>
        <button
          style={{ border: "2px solid red", padding: "5px" }}
          onClick={handlePreviousMatch}
        >
          Pass
        </button>
      </div>
    </>
  );
};

export default UserCard;
