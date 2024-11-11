import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        address: '',
        dateOfBirth: '',
        district: ''
    });
    const [isNewProfile, setIsNewProfile] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = response.data.data.user;
            if (user.firstName || user.lastName) {
                setIsNewProfile(false);
            }
            setProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '',
                district: user.district || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage('Error fetching profile.');
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/profile', profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setMessage('Profile updated successfully.');
            setIsNewProfile(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete('http://localhost:5000/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage('Profile deleted successfully.');
            // Optionally, log out the user or redirect
            navigate('/login');
        } catch (error) {
            console.error('Error deleting profile:', error);
            setMessage('Error deleting profile.');
        }
    };

    // Navigate back to dashboard
    const goBackToDashboard = () => {
        navigate('/user'); // Adjust the path to your dashboard route
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
                
                {/* Back to Dashboard Button */}
                <button
                    onClick={goBackToDashboard}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors mb-6 w-full"
                >
                    Back to Dashboard
                </button>

                {message && <p className="text-red-500 text-center mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="date"
                            name="dateOfBirth"
                            value={profile.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            name="district"
                            value={profile.district}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        {isNewProfile ? 'Create Profile' : 'Update Profile'}
                    </button>
                </form>
                {!isNewProfile && (
                    <button
                        onClick={handleDelete}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors mt-4"
                    >
                        Delete Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;
