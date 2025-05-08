import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import notificationSound from './notification.mp3';

const IncomingNotif = () => {
  const [client, setClient] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const token = localStorage.getItem("authToken");

  function getAdminIdFromToken(token) {
    try {
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
    if (!token) return;

    const adminId = getAdminIdFromToken(token);
    if (!adminId) return;

    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        //'heart-beat': '10000,10000'
      },
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Admin connected to notifications');
        setConnectionStatus('connected');
        console.log("teeeeest");
        stompClient.subscribe(
          `/topic/admin`, 
          (message) => {
            triggerNotification(message.body);
        
            try {
              const data = JSON.parse(message.body);
        
              // Make sure it contains what you expect
              if (data && data.orderId) {
                triggerNotification(`🚚 Order #${data.orderId} marked as DELIVERED`);
              } else {
                console.warn("Ignored message with missing orderId:", data);
              }
            } catch (err) {
              console.warn("Ignored non-JSON message:", message.body);
            }
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
        
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        setConnectionStatus('error');
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      },
      onWebSocketClose: () => {
        console.log('WebSocket connection closed');
        setConnectionStatus('disconnected');
      }
    });

    stompClient.activate();
    setClient(stompClient);
    setConnectionStatus('connecting');

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [token]);

  useEffect(() => {
    const handleUserInteraction = () => {
      const audio = new Audio(notificationSound);
      audio.load();
      window._notificationAudio = audio;
      document.removeEventListener('click', handleUserInteraction);
    };
  
    document.addEventListener('click', handleUserInteraction);
  
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  const triggerNotification = (message) => {
  setAlertMessage(message);
  setShowAlert(true);

  if (window._notificationAudio) {
    window._notificationAudio.currentTime = 0; // rewind in case it's still playing
    window._notificationAudio.play().catch(e => console.error('Audio playback failed:', e));
  } else {
    console.warn("Notification audio not ready yet. User may not have interacted with the page.");
  }

  setTimeout(() => {
    setShowAlert(false);
  }, 5000);
};


  const formatAlertMessage = (message) => {
    const parts = message.split('DELIVERED');
    return (
      <>
        <span style={{ color: '#333333' }}>{parts[0]}</span>
        {parts.length > 1 && (
          <>
            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>DELIVERED</span>
            <span style={{ color: '#333333' }}>{parts[1]}</span>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className="flex items-center p-4 text-sm rounded-lg shadow-lg"
            style={{
              backgroundColor: '#F0FFF4',
              border: '2px solid #C6F6D5',
            }}
          >
            <span className="font-medium">
              {formatAlertMessage(alertMessage)}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default IncomingNotif;