import React, { useState } from 'react';
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { username, email, password };

        console.log(userData);  // Log the request data to verify

        try {
            const data = await signup(userData);
            setMessage('Sign up successful');
            setTimeout(() => {
                navigate('/login');
            }, 500);
        } catch (error) {
            setMessage('Sign up failed');
        }
    };


    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded-lg shadow-lg max-w-sm w-full '>
                {/* School Logo */}
                <img src="/logo5.png" alt="School Logo" className="w-32 h-32 mb-4 mx-auto" />

                {/* School Name */}
                <h1 className="text-3xl font-semi-bold  text-center">R / SHRI KRISHANA M.V</h1>
                <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up</h2>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div >
                        <input
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className='w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors'
                    >Sign Up</button>
                    <p>if you already have a account <a href="/" className='text-blue font-bold'>LOGIN</a></p>
                </form>

                {message && <p className='mt-4 text-red-500'>{message}</p>}
            </div>
        </div>
    );
};

export default Signup;
