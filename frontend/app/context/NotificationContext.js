import React, { createContext, useState, useContext, useCallback } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "Emergency Alert: Heavy rain expected!", 
      read: false,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      type: "emergency"
    },
    { 
      id: 2, 
      message: "New Safety Tips available", 
      read: false,
      timestamp: new Date(Date.now() - 1800000), // 30 mins ago
      type: "info"
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  }, []);

  const addNotification = useCallback((newNotification) => {
    setNotifications(prev => [
      {
        id: Date.now(),
        message: newNotification.message,
        read: false,
        timestamp: new Date(),
        type: newNotification.type || "info"
      },
      ...prev
    ]);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        markAllAsRead,
        markAsRead,
        addNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}