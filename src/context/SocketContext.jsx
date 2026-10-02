import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Determine backend URL. In dev with Vite proxy, we can connect to window.location.origin
    const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const socketInstance = io(socketUrl); 

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to socket server:', socketInstance.id);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
