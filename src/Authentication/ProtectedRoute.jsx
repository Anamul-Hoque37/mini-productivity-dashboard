import React from 'react';
import { Navigate } from 'react-router-dom';
import SocialLogin from './SocialLogin';
import auth from '../../firebase.config';

const ProtectedRoute = ({ children }) => {
    const user = auth.currentUser;
    console.log(user)

    if (!user) {
        // Redirect to the login page if the user is not authenticated
        return <Navigate to="/" />;
        // return <SocialLogin></SocialLogin>;
    }

    return children;
};

export default ProtectedRoute;