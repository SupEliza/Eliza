import { useContext } from 'react';
import { AuthContext } from '../hooks/Authentication/authContext';
import { Navigate } from 'react-router-dom';
import FullLoad from '../components/FullLoad/index';

function DashRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <FullLoad />

    if (!user) return <Navigate to="/login" replace />;

    if (user.user_role !== "Admin") return <Navigate to="/unauthorized" replace />;
        
    return children;
}

export default DashRoute;