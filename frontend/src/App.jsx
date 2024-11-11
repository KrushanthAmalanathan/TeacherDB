import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Signup from './components/SignUp.jsx';
import UserDashboard from './components/Dashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import SuperAdminDashboard from './components/SuperAdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Unauthorized from './components/Unauthorized.jsx';
import UserUpdate from './components/UserUpdate.jsx';
import Profile from './components/Profile.jsx';



import './App.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />



        {/* Protected Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute requiredRole="super-admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Update Route */}
        <Route
          path="/users/update/:userId"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserUpdate />
            </ProtectedRoute>
          }
        />

        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
