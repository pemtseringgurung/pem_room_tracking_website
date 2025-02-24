import React from 'react';
import '../styles/RoomList.css';

function RoomList({ 
  roomCount, 
  roomNames, 
  onRoomNameChange, 
  onRoomStatusClick, 
  notificationsStarted, 
  clickCounts, 
  notificationFrequency 
}) {
  return (
    <div className="rooms">
      {Array.from({ length: roomCount }).map((_, index) => (
        <div key={index} className="room">
          <input
            type="text"
            placeholder={`Room ${index + 1} Name`}
            value={roomNames[index]}
            onChange={(e) => onRoomNameChange(index, e.target.value)}
          />
          <div className="room-actions">
            <button 
              onClick={() => onRoomStatusClick(index)} 
              disabled={!notificationsStarted}
            >
              Update Status
            </button>
            <span>({clickCounts[index] || 0}/{notificationFrequency})</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomList; 