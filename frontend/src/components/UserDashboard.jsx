import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    const goToProfile = () => {
        navigate('/profile');
    };

    return (
        <div>
            <h2>User Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            <button onClick={goToProfile}>Go to Profile</button>
        </div>
    );
};

export default UserDashboard;
