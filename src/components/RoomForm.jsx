import React from 'react';
import '../styles/RoomForm.css';

function RoomForm({ roomCount, onRoomCountChange }) {
  return (
    <div className="input-group">
      <label>
        Number of Rooms: 
        <input
          type="number"
          min="1"
          value={roomCount}
          onChange={onRoomCountChange}
        />
      </label>
    </div>
  );
}

export default RoomForm; 