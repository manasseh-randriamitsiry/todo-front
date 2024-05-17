import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from "react-router-dom";

const TaskModal = ({ show, handleClose, task, refreshTasks }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [date, setDate] = useState('');
    const [attachment, setAttachment] = useState(null); // State to store the attachment file
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const username = searchParams.get('username');
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-CA', options); // 'en-CA' formats the date as yyyy-MM-dd
    };
    useEffect(() => {
        if (task && token) {
            setTaskName(task.task_name);
            setTaskDescription(task.task_description);
            setDate(formatDate(task.date));
            setAttachment(task.atachement);
        } else {
            setTaskName('');
            setTaskDescription('');
            setDate('');
            setAttachment('');
        }
    }, [task]);

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(); // Create FormData object to send form data including files

        formData.append('username', username);
        formData.append('taskName', taskName);
        formData.append('taskDescription', taskDescription);
        formData.append('date', date);
        formData.append('attachment', attachment); // Append the attachment file to the form data
        console.log(taskName);
        try {
            if (task && token) {
                await axios.put(`http://127.0.0.1:3001/tasks/${task.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for file upload
                        Authorization: `Bearer ${token}` // Include token in request header
                    }
                });
                console.log('Task updated successfully');
                setError('');
                setSuccess('Task updated successfully');
            } else if(token){
                await axios.post('http://127.0.0.1:3001/tasks', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for file upload
                        Authorization: `Bearer ${token}` // Include token in request header
                    }
                });
                console.log('Task created successfully');
                setError('');
                setSuccess('Task created successfully');
            }
            refreshTasks();
            handleClose();
        } catch (error) {
            setSuccess('');
            setError(error.response?.data?.error || 'An error occurred');
            console.error('Error:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{task ? 'Edit Task' : 'Create Task'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Task Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Attachment</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                    <Button variant="primary" className="m-2" type="submit">
                        {task ? 'Update' : 'Create'} Task
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TaskModal;
