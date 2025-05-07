import React from 'react';
import Modal from 'react-modal';
import './TabRestaurant.css';

const ConfirmPopup = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className="confirm-popup-modal"
      overlayClassName="confirm-popup-overlay"
      ariaHideApp={false}
    >
      <div className="confirm-popup-content">
        <p className="confirm-popup-message">{message}</p>
        <div className="confirm-popup-buttons">
          <button 
            onClick={onConfirm} 
            className="confirm-popup-confirm-btn"
          >
            Yes
          </button>
          <button 
            onClick={onCancel} 
            className="confirm-popup-cancel-btn"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmPopup;