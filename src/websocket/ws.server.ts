import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import env from '../config/env.config';

// Define the name for the socket manager instance
let io: SocketIOServer;

export const initWsServer = (httpServer: HttpServer) => {
    // 1. Initialize Socket.IO
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: [env.FRONTEND_URL],
            credentials: true,
            methods: ["GET", "POST", "PUT"]
        }
    });

    console.log('WebSocket Server initialized.');

    io.on('connection', (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('JOIN_ROOM', (roomName: string) => {
            if (typeof roomName === 'string') {
                socket.join(roomName);
                console.log(`Client ${socket.id} joined room: ${roomName}`);
            }
        });

        // Listener for disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

/**
 * Returns the initialized Socket.IO instance.
 */
export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call initWsServer() first.');
    }
    return io;
};