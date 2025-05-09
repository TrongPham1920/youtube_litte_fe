import React from 'react';

interface NotificationProps {
  message: string;
  type: 'error' | 'success';
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700';

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${bgColor}`} role="alert">
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="text-sm font-semibold">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;