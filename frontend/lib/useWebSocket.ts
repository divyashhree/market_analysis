'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';

export interface MarketUpdate {
  stockChange: number;
  stockTrend: 'up' | 'down' | 'stable';
  currencyChange: number;
  volume: number;
  lastUpdate: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  comment?: any;
  insight?: any;
}

export interface WebSocketState {
  connected: boolean;
  userId: string | null;
  activeUsers: number;
  marketUpdates: Record<string, MarketUpdate>;
  activities: Activity[];
  alerts: any[];
  predictions: any;
}

export function useWebSocket() {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    userId: null,
    activeUsers: 0,
    marketUpdates: {},
    activities: [],
    alerts: [],
    predictions: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🔌 WebSocket connected');
        setState(prev => ({ ...prev, connected: true }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (err) {
          console.error('Failed to parse WS message:', err);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setState(prev => ({ ...prev, connected: false }));
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, []);

  const handleMessage = (data: any) => {
    switch (data.type) {
      case 'connected':
        setState(prev => ({
          ...prev,
          userId: data.userId,
          activeUsers: data.activeUsers,
        }));
        break;

      case 'userCount':
        setState(prev => ({
          ...prev,
          activeUsers: data.count,
        }));
        break;

      case 'marketUpdate':
        setState(prev => ({
          ...prev,
          marketUpdates: data.data,
        }));
        break;

      case 'activityFeed':
        setState(prev => ({
          ...prev,
          activities: data.data || [],
        }));
        break;

      case 'activity':
        setState(prev => ({
          ...prev,
          activities: [data.data, ...prev.activities].slice(0, 50),
        }));
        break;

      case 'alert_triggered':
        setState(prev => ({
          ...prev,
          alerts: [data, ...prev.alerts].slice(0, 20),
        }));
        break;

      case 'predictions':
        setState(prev => ({
          ...prev,
          predictions: { country: data.country, data: data.data },
        }));
        break;

      case 'pong':
        // Heartbeat response
        break;

      default:
        console.log('Unknown WS message type:', data.type);
    }
  };

  const send = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const subscribe = useCallback((countries: string[]) => {
    send({ type: 'subscribe', countries });
  }, [send]);

  const sendComment = useCallback((country: string, indicator: string, text: string) => {
    send({ type: 'comment', country, indicator, text });
  }, [send]);

  const sendReaction = useCallback((targetId: string, reactionType: string, country?: string) => {
    send({ type: 'reaction', targetId, reactionType, country });
  }, [send]);

  const subscribeToAlert = useCallback((alert: { country: string; type: string; threshold: number }) => {
    send({ type: 'alert_subscribe', alert });
  }, [send]);

  const getPredictions = useCallback((country: string) => {
    send({ type: 'get_predictions', country });
  }, [send]);

  useEffect(() => {
    connect();

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      send({ type: 'ping' });
    }, 30000);

    return () => {
      clearInterval(heartbeat);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [connect, send]);

  return {
    ...state,
    subscribe,
    sendComment,
    sendReaction,
    subscribeToAlert,
    getPredictions,
  };
}

export default useWebSocket;
