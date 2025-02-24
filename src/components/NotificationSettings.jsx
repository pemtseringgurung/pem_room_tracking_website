import React from 'react';
import '../styles/NotificationSettings.css';

function NotificationSettings({ 
  notificationFrequency, 
  onNotificationFrequencyChange, 
  notificationsStarted, 
  onStartNotifications,
  onViewHistory
}) {
  return (
    <div className="notification-controls">
      <div className="input-group">
        <label>
          Notifications per Day
          <input
            type="number"
            min="1"
            value={notificationFrequency}
            onChange={onNotificationFrequencyChange}
            disabled={notificationsStarted}
          />
        </label>
      </div>
      {!notificationsStarted && (
        <button className="start-button" onClick={onStartNotifications}>
          Start Notifications
        </button>
      )}
      <button className="history-button" onClick={onViewHistory}>
        View History
      </button>
    </div>
  );
}

export default NotificationSettings; 