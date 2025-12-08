// src/websocket/ws.manager.ts
import logger from '../utils/logger';
import { getIO } from './ws.server';


export interface RealTimeCountPayload {
    targetId: string;
    likeCount: number;
    dislikeCount: number;
}

export const emitReactionUpdate = (roomName: string, payload: RealTimeCountPayload) => {
    try {
        const io = getIO();

        const eventName = 'REACTION_COUNT_UPDATE';

        io.to(roomName).emit(eventName, payload);

        logger.info(`[WS Manager] Emitted update to room ${roomName}`);

    } catch (error) {
        logger.error('Failed to emit WebSocket update:', error);
    }
};