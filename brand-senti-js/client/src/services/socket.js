import { io } from "socket.io-client";

// Define backend Socket.IO websocket URL (FastAPI mounts SocketApp on /ws)
const SOCKET_URL = "http://127.0.0.1:8000";

export const socket = io(SOCKET_URL, {
  path: "/ws/socket.io",
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

// Helper: Subscribe to a specific brand real-time stream (room-based)
export const subscribeToBrand = (brandId) => {
  if (socket && socket.connected) {
    socket.emit("subscribe_brand", { brand_id: brandId });
    console.log(`Subscribed to brand stream room: brand_${brandId}`);
  } else {
    // If socket is connecting, wait for connection and emit
    socket.once("connect", () => {
      socket.emit("subscribe_brand", { brand_id: brandId });
      console.log(`Delayed subscription: brand_${brandId}`);
    });
  }
};

// Helper: Unsubscribe from a specific brand stream
export const unsubscribeFromBrand = (brandId) => {
  if (socket && socket.connected) {
    socket.emit("unsubscribe_brand", { brand_id: brandId });
    console.log(`Unsubscribed from brand stream room: brand_${brandId}`);
  }
};
