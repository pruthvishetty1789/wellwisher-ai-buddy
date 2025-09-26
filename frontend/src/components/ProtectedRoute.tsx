import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 ProtectedRoute: Checking authentication...');
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('❌ ProtectedRoute: No token found in localStorage');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        console.log('🎫 ProtectedRoute: Token found, verifying with backend...');
        console.log('🎫 Token preview:', `${token.substring(0, 20)}...`);

        // Verify token with backend
        const response = await API.get('/auth/verify');
        
        console.log('📥 ProtectedRoute: Auth verification response:', response.data);
        
        if (response.data.success) {
          console.log('✅ ProtectedRoute: Authentication successful for user:', response.data.user);
          console.log('👤 Current session user:', {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email
          });
          setIsAuthenticated(true);
        } else {
          console.log('❌ ProtectedRoute: Authentication failed, removing token');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ ProtectedRoute: Auth verification failed:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;