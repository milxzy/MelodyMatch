// protectedroute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
  // check if the token exists, if not redirect to the login page
  if (!token) {
    return <Navigate to="/spotify" />;
  }

  // if token exists, render the protected route
  return children;
};

export default ProtectedRoute;
