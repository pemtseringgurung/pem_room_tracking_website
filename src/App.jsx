import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import RoomForm from './components/RoomForm';
import RoomList from './components/RoomList';
import NotificationSettings from './components/NotificationSettings';
import OrganizationModal from './components/OrganizationModal';
import HistoryModal from './components/HistoryModal';
import Modal from 'react-modal';

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

  const handleViewHistory = () => {
    setHistoryModalIsOpen(true);
  };

  return (
    <div className="App">
      <Header title="Pem's App" onRefresh={handleRefresh} />
      
      <div className="app-content">
        <div className="dashboard-section gradient-border">
          <div className="section-title">Room Configuration</div>
          <RoomForm roomCount={roomCount} onRoomCountChange={handleRoomCountChange} />
        </div>
        
        <div className="dashboard-section gradient-border">
          <div className="section-title">Notification Frequency</div>
          <NotificationSettings
            notificationFrequency={notificationFrequency}
            onNotificationFrequencyChange={handleNotificationFrequencyChange}
            notificationsStarted={notificationsStarted}
            onStartNotifications={() => setNotificationsStarted(true)}
            onViewHistory={handleViewHistory}
          />
        </div>
        
        <div className="dashboard-section full-width gradient-border">
          <div className="section-title">Room Status</div>
          <RoomList
            roomCount={roomCount}
            roomNames={roomNames}
            onRoomNameChange={handleRoomNameChange}
            onRoomStatusClick={handleRoomStatusClick}
            notificationsStarted={notificationsStarted}
            clickCounts={clickCounts}
            notificationFrequency={notificationFrequency}
          />
        </div>
      </div>
      
      <OrganizationModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        isAskingReason={isAskingReason}
        roomName={currentRoom !== null ? roomNames[currentRoom] : ''}
        reason={reason}
        onReasonChange={(e) => setReason(e.target.value)}
        onModalResponse={handleModalResponse}
        onSaveReason={handleSaveReason}
      />
      
      <HistoryModal
        isOpen={historyModalIsOpen}
        onRequestClose={() => setHistoryModalIsOpen(false)}
        history={history}
        commonReasons={getCommonReasons()}
      />
    </div>
  );
}

export default App;