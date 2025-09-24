import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"], // avoids CORS xhr polling errors
});

export default socket;
