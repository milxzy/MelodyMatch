const MatchCard = ({ match }) => {
    const { name, image, status, lastActive } = match;
  
    return (
      <div className="match-card">
        <img src={image} alt={name} className="match-image" />
        <div className="match-info">
          <h3>{name}</h3>
          <p>Status: {status}</p>
          <p>Last Active: {lastActive}</p>
        </div>
        <div className="match-actions">
          <button className="btn-like">Like</button>
          <button className="btn-dislike">Dislike</button>
        </div>
      </div>
    );
  };
  
  export default MatchCard;
  