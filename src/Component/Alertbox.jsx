import React from 'react';
import "../style/Alertbox.css"; // Import CSS for styling

const AlertBox = ({ message, onClose, warning }) => {
  return (
    <div className={`alert-box ${warning ? 'danger' : ''}`}>
      <div className="alert-content">
        <p>{message}</p>
        <span className="close-btn" onClick={onClose}>&times;</span>
      </div>
    </div>
  );
};

export default AlertBox;
