import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Socket.io endpoint – adjust if you host on a different domain/port
const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', {
  path: '/socket.io',
  transports: ['websocket'],
});

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
