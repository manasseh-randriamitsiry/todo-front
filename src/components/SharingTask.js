import React from 'react';
import { Button } from 'react-bootstrap';

const SharingTask = ({ taskId, username, shareTask }) => {
    const handleShare = () => {
        // Call the shareTask function provided by TaskList component
        shareTask(taskId, username);
    };

    return (
        <Button variant="info" className="m-2" onClick={handleShare}>Share</Button>
    );
};

export default SharingTask;
