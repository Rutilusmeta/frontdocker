// Import necessary dependencies
//import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthCore } from '@particle-network/auth-core-modal';
//import UserContext from '../contexts/UserContext';

// Define the ProtectedRoute component
export const ProtectedRoute = () => 
{
    const { userInfo } = useAuthCore();
    //const { userData } = useContext(UserContext);
    const isAuthenticated = userInfo !== null && userInfo !== undefined;
    //console.log("Checking protected route", isAuthenticated, userInfo, userData);
    /*if (!isAuthenticated) 
    {
        console.log("Redirecting to login");
        //return <Navigate to="/login" replace />;
    }*/
    return isAuthenticated ? <Outlet /> : <Navigate to="/index-seven" />;
}