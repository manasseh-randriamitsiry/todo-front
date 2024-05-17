import React from 'react';
import axios from 'axios';

const LogoutButton = ({ onLogout }) => {
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:3002/logout', {}, {
                headers: {
                    Authorization: token // Include token in headers without 'Bearer'
                }
            });
            localStorage.removeItem('token'); // Remove token from local storage
            onLogout(); // Call parent function to handle logout success
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
    );
};

export default LogoutButton;
