// src/components/Notification.jsx
import './Notification.css';
import { useNotification } from '../contexts/NotificationContext';

function Notification() {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className="notification-banner">
      {notification}
    </div>
  );
}

export default Notification;
