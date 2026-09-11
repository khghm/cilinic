import React from 'react';
import { useClinic } from '../context/ClinicContext';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useClinic();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return 'fa-check-circle text-green-500';
      case 'error': return 'fa-times-circle text-red-500';
      case 'warning': return 'fa-exclamation-triangle text-amber-500';
      default: return 'fa-info-circle text-blue-500';
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 z-[100] space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBg(notification.type)} border rounded-xl p-4 shadow-lg animate-slideInRight flex items-start gap-3`}
        >
          <i className={`fas ${getIcon(notification.type)} text-lg mt-0.5`}></i>
          <div className="flex-1">
            <p className="text-sm text-gray-700">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
