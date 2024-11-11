import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

export const signup = async (userData) => {
    const response = await axios.post(`${API_URL}signup`, userData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};


export const signin = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}signin`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response contains the token and user data
        if (response.data.token && response.data.user) {
            // Store user data and token separately in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }

        // Return the entire response data
        return response.data;
    } catch (error) {
        console.error('Signin failed:', error);
        throw error; // Rethrow the error so it can be caught by the calling function
    }
};


export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};


export const getAuthHeader = () => {
    const user = getCurrentUser();
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};
