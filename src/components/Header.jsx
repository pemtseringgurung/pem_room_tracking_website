import React from 'react';
import '../styles/Header.css';

function Header({ onRefresh }) {
  return (
    <div className="header">
      <h1>Pem's Room Tracking App</h1>
      <button className="refresh-button" onClick={onRefresh}>
        Reset
      </button>
    </div>
  );
}

export default Header; 