import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import notificationSound from './notification.mp3'; // mets ton son ici

const Notification = () => {
  const [client, setClient] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const token = localStorage.getItem("authToken");

  function getIDFromToken(token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);
      return payload.id;
    } catch (e) {
      console.error('Erreur de décodage du token :', e);
      return null;
    }
  }

  useEffect(() => {
    if (!token) return;
    const restaurantId = getIDFromToken(token);
    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log('Connected');
        stompClient.subscribe(`/topic/restaurant/${restaurantId}/orders`, (message) => {
          console.log('New order:', message.body);
          triggerNotification(`📢 ${message.body}`);
        }, {
          Authorization: `Bearer ${token}`,
        });
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [token]);

  const triggerNotification = (message) => {
    setAlertMessage(message);
    setShowAlert(true);

    const audio = new Audio(notificationSound);
    audio.play();

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const formatAlertMessage = (message) => {
    // Remplacer le mot "NEW ORDER" par un span coloré
    const parts = message.split('NEW ORDER');
    return (
      <>
        <span style={{ color: '#333333' }}>{parts[0]}</span>
        {parts.length > 1 && (
          <>
            <span style={{ color: '#FD4C2A' }}>NEW ORDER</span>
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
              backgroundColor: '#FFF4F0',
              border: '2px solid #FFD2C2',
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

export default Notification;
