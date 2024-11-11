import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signin } from '../services/authService.jsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await signin({ email, password });
            console.log('Login successful, received response:', response);

            const user = response.data.user;

            if (user && user.role) {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', response.token);

                // Navigate based on role
                if (user.role === 'super-admin') {
                    navigate('/super-admin');
                } else if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            } else {
                setMessage('Login failed. Unable to retrieve user data.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('Login failed. Check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">


            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                {/* School Logo */}
                <img src="/logo5.png" alt="School Logo" className="w-32 h-32 mb-4 mx-auto" />

                {/* School Name */}
                <h1 className="text-3xl font-semi-bold  text-center">R / SHRI KRISHANA M.V</h1>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-indigo-600 transition-colors"
                        >
                            Login
                        </button>
                        <p>If you don't have an account, <a href="/signup" className="text-blue-600 font-bold">SIGNUP</a></p>
                    </div>
                </form>
                {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default Login;
