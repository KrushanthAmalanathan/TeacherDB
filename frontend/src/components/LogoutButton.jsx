import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Import the logout icon

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token and session data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Remove any other session data if necessary
        // Navigate to the login page or home after logout
        navigate('/');
    };

    return (
        <button
            onClick={handleLogout}
            className="absolute top-6 right-6 flex items-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors neumorphism-button"
        >
            <FaSignOutAlt className="mr-2" /> {/* Logout icon */}
            Logout
        </button>
    );
};

export default LogoutButton;
