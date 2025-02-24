import React from 'react';
import Modal from 'react-modal';
import '../styles/HistoryModal.css';

function HistoryModal({ isOpen, onRequestClose, history, commonReasons }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="History"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Room Organization History</h2>
      <ul className="history-list">
        {history.map((entry, index) => (
          <li key={index} className="history-item">
            <span className="history-timestamp">{entry.timestamp}</span>
            <span className="history-room">{entry.room}: </span>
            <span className={`history-response ${entry.response === 'Yes' ? 'response-yes' : 'response-no'}`}>
              {entry.response}
            </span>
            {entry.reason && (
              <div className="history-reason">
                Reason: {entry.reason}
              </div>
            )}
          </li>
        ))}
      </ul>
      <h2>Common Reasons</h2>
      <div className="common-reasons">
        <p>{commonReasons}</p>
      </div>
      <button className="close-button" onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

export default HistoryModal; 