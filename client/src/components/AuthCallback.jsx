import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setClientToken } from '../spotify';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const expires_in = searchParams.get('expires_in');
    
    if (access_token) {
      setClientToken(access_token);
      localStorage.setItem('token', access_token);
      navigate('/dashboard'); // or wherever you want to redirect after auth
    }
  }, [searchParams, navigate]);

  return <div>Authenticating...</div>;
}

export default AuthCallback;
