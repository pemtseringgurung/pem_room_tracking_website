import React from 'react';
import Modal from 'react-modal';
import '../styles/OrganizationModal.css';

function OrganizationModal({ 
  isOpen, 
  onRequestClose, 
  isAskingReason, 
  roomName, 
  reason, 
  onReasonChange, 
  onModalResponse, 
  onSaveReason 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Room Organization Check"
      className="Modal"
      overlayClassName="Overlay"
    >
      {!isAskingReason ? (
        <>
          <h2>Is your room "{roomName}" still organized?</h2>
          <div className="modal-actions">
            <button className="yes-button" onClick={() => onModalResponse('Yes')}>Yes</button>
            <button className="no-button" onClick={() => onModalResponse('No')}>No</button>
          </div>
        </>
      ) : (
        <>
          <h2>Why is your room "{roomName}" not organized?</h2>
          <input
            type="text"
            value={reason}
            onChange={onReasonChange}
            placeholder="Enter your reason here..."
          />
          <button className="save-button" onClick={onSaveReason}>Save</button>
        </>
      )}
    </Modal>
  );
}

export default OrganizationModal; 