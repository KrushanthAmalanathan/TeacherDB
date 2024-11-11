import User from '../models/userModel.js';


export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'No user found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};



export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};


export const createUser = async (req, res) => {
    try {
        const { username, email, password, role, permissions } = req.body;

        // Admins can only create regular users
        if (req.user.role === 'admin' && role !== 'user') {
            return res.status(403).json({
                status: 'fail',
                message: 'Admins can only create regular users'
            });
        }

        // Check admin's permission to create users
        if (req.user.role === 'admin' && !req.user.permissions.createUser) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to create users'
            });
        }

        let newUserData = { username, email, password, role };

        // Super-admin can set permissions for admins
        if (req.user.role === 'super-admin' && role === 'admin') {
            newUserData.permissions = permissions || {};
        }

        const newUser = await User.create(newUserData);
        res.status(201).json({
            status: 'success',
            data: { user: newUser }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// Admin or Super Admin: Delete a User (Admins cannot delete admins or super-admins)
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'No user found with that ID' });
        }

        if (req.user.role === 'admin') {
            if (!req.user.permissions.deleteUser) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'You do not have permission to delete users'
                });
            }
            if (user.role !== 'user') {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Admins can only delete regular users'
                });
            }
        } else if (req.user.role === 'super-admin') {
            if (user.role === 'super-admin') {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Cannot delete another super-admin'
                });
            }
        } else {
            // Users cannot delete others
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }

        await User.findByIdAndDelete(userId);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// Admin or Super Admin: Edit a User (Admins cannot edit admins or super-admins)
export const editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {
            return res.status(404).json({ status: 'fail', message: 'No user found with that ID' });
        }

        // Check permissions and roles
        if (req.user.role === 'admin') {
            if (!req.user.permissions.editUser) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'You do not have permission to edit users'
                });
            }
            if (userToUpdate.role !== 'user') {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Admins can only edit regular users'
                });
            }
            // Prevent admins from changing roles or permissions
            delete req.body.role;
            delete req.body.permissions;
        } else if (req.user.role === 'super-admin') {
            if (userToUpdate.role === 'super-admin') {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Cannot edit another super-admin'
                });
            }
            // Super-admin can update permissions
        } else {
            // Users cannot edit others
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ status: 'success', data: { user: updatedUser } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};