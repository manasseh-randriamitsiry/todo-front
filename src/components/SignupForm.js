import React, { useState } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const SignupForm = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:3002/signup', {
                username,
                password
            });
            console.log(username, password);
            setSuccess('Account created successfully');
            setError('');
            setUsername('');
            setPassword('');
        } catch (error) {
            // Check if the error response exists and contains a message
            if (error.response && error.response.data && error.response.data.error) {
                setError('Error creating account: ' + error.response.data.error);
            } else {
                setError('Error creating account: ' + error.message);
            }
            console.error('Error:', error);
        }

    };

    return (
        <form className="container" style={{width: '50%', marginLeft: '25%', marginTop: '10%'}}>
            <h2>Signup</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className="mb-3">
                <label htmlFor="signupUsername" className="form-label">Username</label>
                <input type="text" className="form-control" id="signupUsername" value={username}
                       onChange={(e) => setUsername(e.target.value)} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="signupPassword" className="form-label">Password</label>
                <input type="password" className="form-control" id="signupPassword" value={password}
                       onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Sign Up</button>
            <p className="mt-3">
                I have an account? <Link to="/login" className="btn btn-outline-success">Log In</Link>
            </p>
        </form>
    );
};

export default SignupForm;
