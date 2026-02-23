import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute component that checks if user is authenticated
 * Redirects to login page if not authenticated
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  if (!isAuthenticated) {
    // Redirect to login page, but save the attempted URL
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
