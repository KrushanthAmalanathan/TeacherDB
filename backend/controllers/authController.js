import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

//create token 
const signToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' });
};


export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide username, email, and password',
            });
        }

        const newUser = await User.create({ username, email, password });
        const token = signToken(newUser._id, newUser.role);

        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser },
        });

    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};


export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }


        const user = await User.findOne({ email }).select('+password');
        console.log('Retrieved user:', user);

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }


        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        console.log('Password matched, generating token');
        const token = signToken(user._id, user.role);
        console.log('Token generated:', token);

        return res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(400).json({ status: 'fail', message: error.message });
    }
};
