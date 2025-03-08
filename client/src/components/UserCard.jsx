
const UserCard = ({
  _profilePic: profilePic,
  _name: name,
  _handleNextMatch: handleNextMatch,
  handlePreviousMatch,
}) => {
  const _handleLike = () => {
    console.log("like");
  };

  const _handlePass = () => {
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
