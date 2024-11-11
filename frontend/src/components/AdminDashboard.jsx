import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [message, setMessage] = useState('');
    const [editUserId, setEditUserId] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
        fetchCurrentUser();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data.data.users.filter(user => user.role === 'user'));
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('Error fetching users.');
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrentUser(response.data.data.user);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            if (!currentUser.permissions.createUser) {
                setMessage('You do not have permission to create users.');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/users/create',
                { username, email, password, role: 'user', firstName, lastName, address, district, dateOfBirth },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage('User created successfully');
            setUsername('');
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setAddress('');
            setDistrict('');
            setDateOfBirth('');
            fetchUsers();
        } catch (error) {
            setMessage('Error creating user: ' + error.response?.data?.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            if (!currentUser.permissions.deleteUser) {
                setMessage('You do not have permission to delete users.');
                return;
            }

            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage('User deleted successfully');
            fetchUsers();
        } catch (error) {
            setMessage('Error deleting user: ' + error.response?.data?.message);
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            if (!currentUser.permissions.editUser) {
                setMessage('You do not have permission to edit users.');
                return;
            }

            await axios.patch(
                `http://localhost:5000/api/users/${editUserId}`,
                { username, email, firstName, lastName, address, district, dateOfBirth },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage('User updated successfully');
            setEditUserId(null);
            setUsername('');
            setEmail('');
            setFirstName('');
            setLastName('');
            setAddress('');
            setDistrict('');
            setDateOfBirth('');
            fetchUsers();
        } catch (error) {
            setMessage('Error updating user: ' + error.response?.data?.message);
        }
    };

    const selectUserForEdit = (user) => {
        setEditUserId(user._id);
        setUsername(user.username);
        setEmail(user.email);
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setAddress(user.address || '');
        setDistrict(user.district || '');
        setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '');
    };

    const handleViewUser = (user) => {
        setViewUser(user);
    };

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    // View page for printing teacher details remains the same
    if (viewUser) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center bg-white p-6">
                <div className="printable">
                    {/* School logo */}
                    <img src="/logo5.png" alt="School Logo" className="w-32 h-32 mb-4 mx-auto" />
                    {/* School name */}
                    <h1 className="text-3xl font-bold mb-2">R / SHRI KRISHANA M.V</h1>
                    {/* Subheading */}
                    <h2 className="text-2xl mb-6">Teacher Details</h2>
                    {/* Teacher's details */}
                    <div className="w-full max-w-2xl bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
                        <p><strong>Fullname:</strong> {viewUser.username}</p>
                        <p><strong>Email:</strong> {viewUser.email}</p>
                        <p><strong>Gender:</strong> {viewUser.firstName}</p>
                        <p><strong>Contact Number:</strong> {viewUser.lastName}</p>
                        <p><strong>Residential Address:</strong> {viewUser.address}</p>
                        <p><strong>Education Qualifications:</strong> {viewUser.district}</p>
                        <p><strong>Date of Birth:</strong> {viewUser.dateOfBirth ? viewUser.dateOfBirth.substring(0, 10) : ''}</p>
                    </div>
                </div>
                {/* Buttons */}
                <div className="flex space-x-4">
                    <button
                        className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
                        onClick={() => window.print()}
                    >
                        Print
                    </button>
                    <button
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                        onClick={() => setViewUser(null)}
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 p-6">
            <LogoutButton />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
                <p className="text-lg mb-3 font-semibold text-center">Manage Teachers here.</p>
                {message && <p className="text-red-500 text-center">{message}</p>}

                {/* Create User Form - Only show if admin has createUser permission */}
                {currentUser.permissions.createUser && (
                    <form onSubmit={editUserId ? handleEditUser : handleCreateUser} className="space-y-6 mb-8">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <input
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                type="text"
                                placeholder="Fullname"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {!editUserId && (
                                <input
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <input
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                type="text"
                                placeholder="Gender"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                type="text"
                                placeholder="Contact Number"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <input
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                type="text"
                                placeholder="Residential Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <input
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                type="text"
                                placeholder="Education Qualifications"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            />
                            <input
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                type="date"
                                placeholder="Date of Birth"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            {editUserId ? 'Edit Teacher' : 'Create Teacher'}
                        </button>
                    </form>
                )}
            </div>

            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-12xl'>
                <h3 className="text-2xl font-semibold mb-6 text-center">All Teachers</h3>
                {users.length > 0 ? (
                    <div className="overflow-auto max-h-[60vh]">
                        <table className="min-w-full bg-white border border-gray-300 shadow-md">
                            <thead>
                                <tr className="bg-indigo-500 text-white">
                                    <th className="px-4 py-3 border">Fullname</th>
                                    <th className="px-4 py-3 border">Email</th>
                                    <th className="px-4 py-3 border">Gender</th>
                                    <th className="px-4 py-3 border">Contact Number</th>
                                    <th className="px-4 py-3 border">Residential Address</th>
                                    <th className="px-4 py-3 border">Education Qualifications</th>
                                    <th className="px-4 py-3 border">Date of Birth</th>
                                    <th className="px-4 py-3 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="px-4 py-2 border text-center">{user.username}</td>
                                        <td className="px-4 py-2 border text-center">{user.email}</td>
                                        <td className="px-4 py-2 border text-center">{user.firstName}</td>
                                        <td className="px-4 py-2 border text-center">{user.lastName}</td>
                                        <td className="px-4 py-2 border text-center">{user.address}</td>
                                        <td className="px-4 py-2 border text-center">{user.district}</td>
                                        <td className="px-4 py-2 border text-center">
                                            {user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ''}
                                        </td>
                                        <td className="px-4 py-2 border text-center">
                                            <div className="flex justify-center space-x-2">
                                                {currentUser.permissions.editUser && (
                                                    <button
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                                        onClick={() => selectUserForEdit(user)}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                {currentUser.permissions.deleteUser && (
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                                <button
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                                    onClick={() => handleViewUser(user)}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No Teachers found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
