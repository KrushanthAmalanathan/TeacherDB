import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const SuperAdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [message, setMessage] = useState('');
    const [editUserId, setEditUserId] = useState(null);
    const [permissions, setPermissions] = useState({
        createUser: false,
        editUser: false,
        deleteUser: false
    });
    const token = localStorage.getItem('token'); // Get the JWT token from localStorage

    // Fetch users and admins on component mount
    useEffect(() => {
        fetchUsersAndAdmins();
    }, []);

    // Fetch all users and admins
    const fetchUsersAndAdmins = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Access the users array inside the `data` object
            const allUsers = response.data.data.users;
            setUsers(allUsers.filter((user) => user.role === 'user'));
            setAdmins(allUsers.filter((user) => user.role === 'admin'));
        } catch (error) {
            console.error('Error fetching users and admins:', error);
        }
    };

    // Create user or admin
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                username,
                email,
                password,
                firstName,
                lastName,
                address,
                district,
                dateOfBirth,
                role,
            };

            // Include permissions if creating an admin
            if (role === 'admin') {
                payload.permissions = permissions;
            }

            await axios.post(
                'http://localhost:5000/api/users/create',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage('User created successfully');
            resetForm();
            fetchUsersAndAdmins(); // Refresh the user and admin list
        } catch (error) {
            setMessage('Error creating user: ' + error.response?.data?.message);
        }
    };

    // Delete user or admin
    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage('User deleted successfully');
            fetchUsersAndAdmins(); // Refresh the user and admin list
        } catch (error) {
            setMessage('Error deleting user: ' + error.response?.data?.message);
        }
    };

    // Edit user or admin
    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                username,
                email,
                firstName,
                lastName,
                address,
                district,
                dateOfBirth,
                role,
            };

            // Include permissions if editing an admin
            if (role === 'admin') {
                payload.permissions = permissions;
            }

            await axios.patch(
                `http://localhost:5000/api/users/${editUserId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage('User updated successfully');
            resetForm();
            fetchUsersAndAdmins(); // Refresh the user and admin list
        } catch (error) {
            setMessage('Error updating user: ' + error.response?.data?.message);
        }
    };

    // Select user or admin for editing
    const selectUserForEdit = (user) => {
        setEditUserId(user._id);
        setUsername(user.username);
        setEmail(user.email);
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setAddress(user.address || '');
        setDistrict(user.district || '');
        setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ''); // Format DOB
        setRole(user.role);
        setPermissions({
            createUser: user.permissions?.createUser || false,
            editUser: user.permissions?.editUser || false,
            deleteUser: user.permissions?.deleteUser || false
        });
    };

    const resetForm = () => {
        setEditUserId(null);
        setUsername('');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setAddress('');
        setDistrict('');
        setDateOfBirth('');
        setRole('user');
        setPermissions({
            createUser: false,
            editUser: false,
            deleteUser: false
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <LogoutButton />
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Super Admin Dashboard</h2>
                {message && <p className="text-red-500 text-center mb-4">{message}</p>}

                {/* Create or Edit User Form */}
                <form onSubmit={editUserId ? handleEditUser : handleCreateUser} className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {!editUserId && (
                            <input
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        )}
                    </div>

                    {/* New input fields for additional user details */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            placeholder="District"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                        />
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="date"
                            placeholder="Date of Birth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>

                    <select
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    {/* Permissions Checkboxes */}
                    {role === 'admin' && (
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={permissions.createUser}
                                    onChange={(e) =>
                                        setPermissions({ ...permissions, createUser: e.target.checked })
                                    }
                                />
                                <span className="ml-2">Create User</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={permissions.editUser}
                                    onChange={(e) =>
                                        setPermissions({ ...permissions, editUser: e.target.checked })
                                    }
                                />
                                <span className="ml-2">Edit User</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={permissions.deleteUser}
                                    onChange={(e) =>
                                        setPermissions({ ...permissions, deleteUser: e.target.checked })
                                    }
                                />
                                <span className="ml-2">Delete User</span>
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        {editUserId ? 'Edit User' : 'Create User'}
                    </button>
                </form>

                {/* Admin Table */}
                <h3 className="text-lg font-semibold mb-4 text-center">All Admins</h3>
                {admins.length > 0 ? (
                    <table className="min-w-full table-auto bg-gray-100 border border-gray-300 shadow-md mb-8">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 border">Username</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">First Name</th>
                                <th className="px-4 py-2 border">Last Name</th>
                                <th className="px-4 py-2 border">Address</th>
                                <th className="px-4 py-2 border">District</th>
                                <th className="px-4 py-2 border">Date of Birth</th>
                                <th className="px-4 py-2 border">Permissions</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin._id} className="bg-white text-center">
                                    <td className="px-4 py-2 border">{admin.username}</td>
                                    <td className="px-4 py-2 border">{admin.email}</td>
                                    <td className="px-4 py-2 border">{admin.firstName}</td>
                                    <td className="px-4 py-2 border">{admin.lastName}</td>
                                    <td className="px-4 py-2 border">{admin.address}</td>
                                    <td className="px-4 py-2 border">{admin.district}</td>
                                    <td className="px-4 py-2 border">{admin.dateOfBirth ? admin.dateOfBirth.substring(0, 10) : ''}</td>
                                    <td className="px-4 py-2 border">
                                        <ul className="list-disc list-inside">
                                            <li>Create User: {admin.permissions?.createUser ? 'Yes' : 'No'}</li>
                                            <li>Edit User: {admin.permissions?.editUser ? 'Yes' : 'No'}</li>
                                            <li>Delete User: {admin.permissions?.deleteUser ? 'Yes' : 'No'}</li>
                                        </ul>
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                            onClick={() => selectUserForEdit(admin)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDeleteUser(admin._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No admins found.</p>
                )}

                {/* User Table */}
                <h3 className="text-lg font-semibold mb-4 text-center">All Users</h3>
                {users.length > 0 ? (
                    <table className="min-w-full table-auto bg-gray-100 border border-gray-300 shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 border">Username</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">First Name</th>
                                <th className="px-4 py-2 border">Last Name</th>
                                <th className="px-4 py-2 border">Address</th>
                                <th className="px-4 py-2 border">District</th>
                                <th className="px-4 py-2 border">Date of Birth</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="bg-white text-center">
                                    <td className="px-4 py-2 border">{user.username}</td>
                                    <td className="px-4 py-2 border">{user.email}</td>
                                    <td className="px-4 py-2 border">{user.firstName}</td>
                                    <td className="px-4 py-2 border">{user.lastName}</td>
                                    <td className="px-4 py-2 border">{user.address}</td>
                                    <td className="px-4 py-2 border">{user.district}</td>
                                    <td className="px-4 py-2 border">{user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ''}</td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                            onClick={() => selectUserForEdit(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDeleteUser(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
