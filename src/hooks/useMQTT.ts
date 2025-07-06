import { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';

interface MQTTConfig {
  brokerUrl: string;
  topic: string;
  clientId?: string;
}

export const useMQTT = (config: MQTTConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const client = mqtt.connect(config.brokerUrl, {
      clientId: config.clientId || `carousel_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      console.log('MQTT Connected');
      setIsConnected(true);
      setConnectionStatus('connected');
    });

    client.on('disconnect', () => {
      console.log('MQTT Disconnected');
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    client.on('error', (error) => {
      console.error('MQTT Error:', error);
      setConnectionStatus('error');
    });

    client.on('reconnect', () => {
      console.log('MQTT Reconnecting...');
      setConnectionStatus('connecting');
    });

    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, [config.brokerUrl, config.clientId]);

  const publishMessage = (message: string) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish(config.topic, message, { qos: 0 }, (error) => {
        if (error) {
          console.error('MQTT Publish Error:', error);
        } else {
          console.log(`MQTT Message sent: ${message} to topic: ${config.topic}`);
        }
      });
      return true;
    }
    return false;
  };

  return {
    isConnected,
    connectionStatus,
    publishMessage,
  };
};