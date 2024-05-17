import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskPage from "./components/TaskPage";
import TaskList from "./components/TaskList";

const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/tasks" element={<TaskPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
