import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in!'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user with the decoded id
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token no longer exists.'
            });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token.'
        });
    }
};


