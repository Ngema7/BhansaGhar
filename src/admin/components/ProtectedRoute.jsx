import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ADMIN_BASE } from '../config.js';

export default function ProtectedRoute() {
  const { session, isAdmin, loading } = useAuth();

  // Supabase लाई सोधिरहँदा केही नदेखाउने (नत्र एक झलक dashboard देखिन्छ)
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-maroon">
        Loading...
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to={ADMIN_BASE} replace />;
  }

  return <Outlet />;
}