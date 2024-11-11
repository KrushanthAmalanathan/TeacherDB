import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    const goToProfile = () => {
        navigate('/profile');
    };

    const handleLogout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');


        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
            <div className="bg-white p-8 rounded-lg shadow-lg neumorphism-card w-full max-w-md text-center">
                <h2 className="text-3xl font-bold mb-4">Jesmin Media</h2>
                <p className="text-lg mb-6">Welcome to your dashboard!</p>
                <div className="space-y-4">
                    <button
                        onClick={goToProfile}
                        className="w-full py-2 px-4 rounded-lg shadow-md bg-gray-100 hover:bg-gray-200 transition-all neumorphism-button"
                    >
                        Go to Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 px-4 rounded-lg shadow-md bg-red-100 hover:bg-red-200 transition-all neumorphism-button"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
