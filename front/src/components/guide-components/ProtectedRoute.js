import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('guideToken');

  if (!isAuthenticated) {
    return <Navigate to="/guide-login" replace />;
  }

  return children;
} 