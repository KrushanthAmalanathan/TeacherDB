import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import User from './models/userModel.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);


// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Stop the server if MongoDB connection fails
    }
};

// Initialize the super-admin on server start
const initializeSuperAdmin = async () => {
    try {
        const superAdminExists = await User.findOne({ role: 'super-admin' });
        if (!superAdminExists) {
            const superAdmin = await User.create({
                username: 'superadmin',
                email: 'superadmin@example.com',
                password: await bcrypt.hash('supersecretpassword', 12),
                role: 'super-admin'
            });
            console.log(`Super-admin created: ${superAdmin.email}`);
        }
    } catch (error) {
        console.error('Error creating super-admin:', error);
    }
};

// Start server
const startServer = async () => {
    await connectDB();
    await initializeSuperAdmin();

    app.listen(port, () => {
        console.log(`Backend server running on http://localhost:${port}`);
    });
};

startServer();
