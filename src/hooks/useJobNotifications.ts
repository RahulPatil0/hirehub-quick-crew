import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface JobNotification {
  jobId: number;
  skillType: string;
  location: string;
}

interface NotificationState {
  isConnected: boolean;
  error: string | null;
}

export const useJobNotifications = (enabled: boolean) => {
  const [state, setState] = useState<NotificationState>({
    isConnected: false,
    error: null,
  });
  
  const clientRef = useRef<Client | null>(null);
  const navigate = useNavigate();

  const handleJobNotification = (notification: JobNotification) => {
    toast.success(
      `New job near you: ${notification.skillType} - ${notification.location}`,
      {
        duration: 10000,
        action: {
          label: 'View Job',
          onClick: () => navigate(`/worker/jobs/${notification.jobId}`),
        },
      }
    );
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setState({ isConnected: false, error: 'No authentication token' });
      return;
    }

    try {
      const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected');
          setState({ isConnected: true, error: null });
          
          // Subscribe to nearby jobs queue
          client.subscribe('/user/queue/nearby-jobs', (message) => {
            try {
              const notification: JobNotification = JSON.parse(message.body);
              console.log('Received job notification:', notification);
              handleJobNotification(notification);
            } catch (error) {
              console.error('Error parsing notification:', error);
            }
          });
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
          setState({ 
            isConnected: false, 
            error: `Connection error: ${frame.headers['message']}` 
          });
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
          setState({ 
            isConnected: false, 
            error: 'WebSocket connection failed' 
          });
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          setState({ isConnected: false, error: null });
        },
      });

      client.activate();
      clientRef.current = client;
      
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setState({ 
        isConnected: false, 
        error: 'Failed to initialize WebSocket connection' 
      });
    }
  };

  const disconnectWebSocket = () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    setState({ isConnected: false, error: null });
  };

  useEffect(() => {
    if (enabled) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [enabled]);

  return state;
};
