// lib/websocketService.ts
import { io, Socket } from "socket.io-client";

interface User {
  userID: number;
  timestamp: number;
  org: number;
}

interface Message {
  message: string;
  sender: string;
}

export class WebSocketService {
  public socket: Socket;
  private activeUsers: User[] = [];
  private user: any; // Replace with actual user type (e.g., `User` or `JWT`)
  private SERVER_URL: string = "https://ws.stage.mytaskowl.com/"; // Update as needed

  constructor() {
    this.user = {}; // Get user details (maybe from a cookie or localStorage)
    this.socket = io(this.SERVER_URL, {
      transports: ["websocket"],
      query: {
        name: this.user?.name || "Empty",
        platform: "Web App",
      },
    });

    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket.on("connect", () => {
      console.log("Socket.IO connection established");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket.IO connection disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    this.socket.on("activeUsersUpdate", (updatedUsers: User[]) => {
      console.log("Updated active users received:", updatedUsers);
      this.activeUsers = updatedUsers;
    });

    this.socket.on("activeStatus", (data) => {
      console.log("Active status received:", data);
      this.activeUsers.push(data);
    });

    this.socket.on("userLogout", (data) => {
      console.log("User logged out:", data);
      this.activeUsers = this.activeUsers.filter(
        (user) => user.userID !== data.id,
      );
    });

    this.socket.on("taskStartedClient", (data) => {
      console.log("Task started:", data);
    });

    this.socket.on("screenshot", (data) => {
      console.log("Screenshot request received:", data);
    });

    this.socket.on("macro-detection", (data) => {
      console.log("Macro detection received:", data);
    });
  }

  // Method to send messages to the server
  sendMessage(channel: string, payload: any): void {
    if (this.socket.connected) {
      this.socket.emit(channel, payload);
    } else {
      console.error("Socket.IO is not connected. Unable to send message.");
    }
  }

  // Method to request active users
  getActiveUsers() {
    if (this.socket.connected) {
      this.socket.emit("requestActiveUsers");
    }
  }

  // Listen for incoming messages
  listenForMessages() {
    this.socket.on("message", (data: Message) => {
      console.log("New message received:", data);
    });
  }

  // Method to disconnect the WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Exporting the class as a named export
export const websocketService = new WebSocketService();
