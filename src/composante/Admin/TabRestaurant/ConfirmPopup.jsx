import React from 'react';
import Modal from 'react-modal';

const ConfirmPopup = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 max-w-full shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      ariaHideApp={false}
    >
      <div className="flex flex-col items-center">
        <p className="mb-6 text-lg text-center text-gray-800">{message}</p>
        <div className="flex gap-4">
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Yes
          </button>
          <button 
            onClick={onCancel} 
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmPopup;