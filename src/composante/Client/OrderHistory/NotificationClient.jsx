import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import notificationSound from './notification.mp3';

const ClientOrderNotifications = () => {
  const [client, setClient] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const token = localStorage.getItem("authToken");

  function getUserIdFromToken(token) {
    try {
      if (!token) return null;
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);
      return payload.id;
    } catch (e) {
      console.error('Token decoding error:', e);
      return null;
    }
  }

  useEffect(() => {
    if (!token) {
      console.warn("No token available - not connecting to WebSocket");
      return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      console.error("Could not extract user ID from token");
      return;
    }
    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log('STOMP:', str);
      },
      onConnect: () => {
        setConnectionStatus("connected");
        console.log('Successfully connected to WebSocket');
        
        const subscription = stompClient.subscribe(
          `/topic/user/${userId}/orderStatusUpdate`, 
          (message) => {
            console.log('Order update received:', message.body);
            triggerNotification(`📦 ${message.body}`);
          },
          {
            Authorization: `Bearer ${token}`,
        
          }
        );

        console.log('Subscribed to:', subscription.id);
      },
      onStompError: (frame) => {
        setConnectionStatus("error");
        console.error('STOMP protocol error:', frame.headers?.message || frame.body);
      },
      onWebSocketError: (error) => {
        setConnectionStatus("error");
        console.error('WebSocket error:', error);
      },
      onDisconnect: () => {
        setConnectionStatus("disconnected");
        console.log('Disconnected from WebSocket');
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient?.connected) {
        stompClient.deactivate().then(() => {
          console.log('Cleanly disconnected');
        });
      }
    };
  }, [token]);

  const triggerNotification = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    try {
      const audio = new Audio(notificationSound);
      audio.play().catch(e => console.error("Audio play error:", e));
    } catch (e) {
      console.error("Audio initialization error:", e);
    }

    const timer = setTimeout(() => setShowAlert(false), 5000);
    return () => clearTimeout(timer);
  };

  const formatAlertMessage = (message) => {
    const statusKeywords = {
      "accepted": "#FD4C2A",
      "preparing": "#FFA500",
      "out of delivery": "#32CD32",
      "delivered": "#008000",
      "completed": "#4CAF50"
    };

    let formatted = message;
    Object.entries(statusKeywords).forEach(([keyword, color]) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      formatted = formatted.replace(
        regex, 
        `<span style="color: ${color}; font-weight: bold;">$1</span>`
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <>
      {/* Connection status indicator (for debugging) */}
      <div style={{ display: 'none' }}>
        WebSocket status: {connectionStatus}
      </div>

      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div
            className="flex items-center p-4 text-sm rounded-lg shadow-lg animate-fade-in"
            style={{
              backgroundColor: '#FFF4F0',
              border: '2px solid #FFD2C2',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <svg 
              className="w-5 h-5 mr-2 text-orange-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div className="font-medium text-gray-800">
              {formatAlertMessage(alertMessage)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientOrderNotifications;