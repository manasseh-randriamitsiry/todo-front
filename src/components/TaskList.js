import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';


const TaskList = ({ refreshTasks, onEditTask }) => {
    const [tasks, setTasks] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const username = searchParams.get('username');
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to /login if token is empty
            return;
        }

        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    },
                    params: { username }
                });
                if (response.data) {
                    setTasks(response.data.tasks);
                } else {
                    console.error('Error: Response data is undefined');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to /login if unauthorized
                }
            }
        };
        fetchTasks();
    }, [username, refreshTasks, navigate, token]); // Depend on username, refreshTasks, navigate, and token

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-CA', options); // 'en-CA' formats the date as yyyy-MM-dd
    };

    const deleteTask = async (id) => {
        if (token){
            try {
                await axios.delete(`http://127.0.0.1:3001/tasks/${id}`, {
                    headers: {
                        Authorization: token // Include token in headers
                    }
                });
                refreshTasks(); // Trigger a refresh after deletion
                setSuccess('Task deleted successfully');
                setError('');
            } catch (error) {
                console.error('Error deleting task:', error);
                setSuccess('');
                setError('Error deleting task');
            }
        } else {
            setError('you are not authorized to delete this task');
            setSuccess('');
        }

    };

    return (
        <div>
            <h3>Logged in user: {username}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {tasks.map(task => (
                <Card key={task.id} style={{borderRadius: 15}} className="mb-3">
                    <Card.Body style={{borderRadius: 15}}>
                        <Card.Title>Task name: {task.task_name}</Card.Title>
                        <Card.Text>Task description: {task.task_description}</Card.Text>
                        <Card.Text><small className="text-muted">Date: {formatDate(task.date)}</small></Card.Text>
                        {/* Add a button/link to open/view/download the attached file */}
                        {task.attachment_path && (
                            <Button
                                variant="primary"
                                className="m-2"
                                onClick={() => window.open(task.attachment_path)}
                            >
                                {task.attachment_path}
                            </Button>

                        )}
                        <div className="d-flex justify-content-end">
                            <Button variant="warning" className="m-2" onClick={() => onEditTask(task)}>Edit</Button>
                            <Button variant="danger" className="m-2" onClick={() => deleteTask(task.id)}>Delete</Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default TaskList;
