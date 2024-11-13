import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

function App() {
  const [roomCount, setRoomCount] = useState(1);
  const [roomNames, setRoomNames] = useState(['']);
  const [notificationFrequency, setNotificationFrequency] = useState(1);
  const [notificationsStarted, setNotificationsStarted] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isAskingReason, setIsAskingReason] = useState(false);
  const [reasons, setReasons] = useState({});
  const [reason, setReason] = useState('');
  const [clickCounts, setClickCounts] = useState({});
  const [history, setHistory] = useState([]);
  const [historyModalIsOpen, setHistoryModalIsOpen] = useState(false);

  const handleRoomCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setRoomCount(count);
    setRoomNames(Array.from({ length: count }, (_, i) => roomNames[i] || ''));
    setClickCounts((prev) => {
      const newCount = {};
      for (let i = 0; i < count; i++) {
        newCount[i] = prev[i] || 0;
      }
      return newCount;
    });
  };

  const handleRoomNameChange = (index, name) => {
    const newRoomNames = [...roomNames];
    newRoomNames[index] = name;
    setRoomNames(newRoomNames);
  };

  const handleNotificationFrequencyChange = (e) => {
    setNotificationFrequency(e.target.value);
  };

  const resetClickCounts = useCallback(() => {
    setClickCounts((prev) => {
      const newCount = {};
      for (let i = 0; i < roomNames.length; i++) {
        newCount[i] = 0;
      }
      return newCount;
    });
  }, [roomNames.length]);

  useEffect(() => {
    const interval = setInterval(resetClickCounts, 24 * 60 * 60 * 1000); 
    return () => clearInterval(interval);
  }, [roomNames, resetClickCounts]);

  const handleRoomStatusClick = (index) => {
    if (clickCounts[index] < notificationFrequency) {
      setCurrentRoom(index);
      setModalIsOpen(true);
      setIsAskingReason(false); 
    } else {
      alert('You have reached the maximum number of updates for this room today.');
    }
  };

  const handleModalResponse = (response) => {
    const timestamp = new Date().toLocaleString();
    const updatedHistory = [...history, { room: roomNames[currentRoom], response, timestamp }];

    if (response === 'Yes') {
      setClickCounts((prev) => ({
        ...prev,
        [currentRoom]: (prev[currentRoom] || 0) + 1
      }));
      setModalIsOpen(false);
    } else if (response === 'No') {
      setIsAskingReason(true);
    }

    setHistory(updatedHistory);
  };

  const handleSaveReason = () => {
    const timestamp = new Date().toLocaleString();
    const updatedHistory = [...history, { room: roomNames[currentRoom], response: 'No', reason, timestamp }];

    setReasons((prev) => ({
      ...prev,
      [currentRoom]: [...(prev[currentRoom] || []), reason]
    }));
    setReason('');
    setClickCounts((prev) => ({
      ...prev,
      [currentRoom]: (prev[currentRoom] || 0) + 1
    }));
    setIsAskingReason(false);
    setModalIsOpen(false);
    setHistory(updatedHistory);
  };

  const getCommonReasons = () => {
    const reasonCounts = {};
    Object.values(reasons).forEach((roomReasons) => {
      roomReasons.forEach((reason) => {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      });
    });
    const sortedReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);
    return sortedReasons.map(([reason, count]) => `${reason}: ${count}`).join(', ');
  };

  const handleRefresh = () => {
    setRoomCount(1);
    setRoomNames(['']);
    setNotificationFrequency(1);
    setNotificationsStarted(false);
    setModalIsOpen(false);
    setCurrentRoom(null);
    setIsAskingReason(false);
    setReasons({});
    setReason('');
    setClickCounts({});
    setHistory([]);
    setHistoryModalIsOpen(false);
  };

  return (
    <div className="App">
      <h1>Pem's App</h1>
      <button className="refresh-button" onClick={handleRefresh}>Refresh</button>
      <div className="input-group">
        <label>
          Number of Rooms: 
          <input
            type="number"
            min="1"
            value={roomCount}
            onChange={handleRoomCountChange}
          />
        </label>
      </div>
      <div className="rooms">
        {Array.from({ length: roomCount }).map((_, index) => (
          <div key={index} className="room">
            <input
              type="text"
              placeholder={`Room ${index + 1} Name`}
              value={roomNames[index]}
              onChange={(e) => handleRoomNameChange(index, e.target.value)}
            />
            <button onClick={() => handleRoomStatusClick(index)} disabled={!notificationsStarted}>Update Status</button>
            <span> ({clickCounts[index] || 0}/{notificationFrequency} updates today)</span>
          </div>
        ))}
      </div>
      <div className="input-group">
        <label>
          Notifications per Day: 
          <input
            type="number"
            min="1"
            value={notificationFrequency}
            onChange={handleNotificationFrequencyChange}
            disabled={notificationsStarted}
          />
        </label>
      </div>
      {!notificationsStarted && (
        <button className="start-button" onClick={() => setNotificationsStarted(true)}>Start Notifications</button>
      )}
      <button className="history-button" onClick={() => setHistoryModalIsOpen(true)}>View History</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Room Organization Check"
        className="Modal"
        overlayClassName="Overlay"
      >
        {!isAskingReason ? (
          <>
            <h2>Is your room "{roomNames[currentRoom]}" still organized?</h2>
            <button onClick={() => handleModalResponse('Yes')}>Yes</button>
            <button onClick={() => handleModalResponse('No')}>No</button>
          </>
        ) : (
          <>
            <h2>Why is your room "{roomNames[currentRoom]}" not organized?</h2>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button onClick={handleSaveReason}>Save</button>
          </>
        )}
      </Modal>
      <Modal
        isOpen={historyModalIsOpen}
        onRequestClose={() => setHistoryModalIsOpen(false)}
        contentLabel="History"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>History</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              {entry.timestamp} - {entry.room}: {entry.response} {entry.reason && `- Reason: ${entry.reason}`}
            </li>
          ))}
        </ul>
        <h2>Common Reasons</h2>
        <p>{getCommonReasons()}</p>
        <button onClick={() => setHistoryModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
