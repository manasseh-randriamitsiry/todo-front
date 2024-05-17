import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import TaskModal from './TaskModal';
import TaskList from './TaskList';
import LogoutButton from "./LogoutButton";
import {useLocation, useNavigate} from 'react-router-dom';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const username = searchParams.get('username');
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem('token'); // Get the token from localStorage

    useEffect(() => {
        if (username && token){
            fetchTasks();
        } else navigate('/login'); // For security reason

    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3001/tasks');
            setTasks(Array.isArray(response.data) ? response.data : []);
            console.log(response.data);
            if (response.data.message){
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    const handleShowModal = (task = null) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };
    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className="container" style={{ marginTop:'10%'}}>
            <h2>Task lists</h2>
            {message && <div className="alert alert-info">{message}</div>}
            {isAuthenticated && <LogoutButton onLogout={handleLogout} />}
            <Button onClick={() => handleShowModal()} variant="primary" className="m-2">Create Task</Button>
            <TaskList tasks={tasks} refreshTasks={fetchTasks} onEditTask={handleShowModal} />
            <TaskModal show={showModal} handleClose={handleCloseModal} task={selectedTask} refreshTasks={fetchTasks} />
        </div>
    );
};

export default TaskPage;
