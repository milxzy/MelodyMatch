// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
  // Check if the token exists, if not redirect to the login page
  if (!token) {
    return <Navigate to="/spotify" />;
  }

  // If token exists, render the protected route
  return children;
};

export default ProtectedRoute;
