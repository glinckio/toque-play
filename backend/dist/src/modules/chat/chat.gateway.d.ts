import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../common/redis/redis.service';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private chatService;
    private redisService;
    server: Server;
    constructor(chatService: ChatService, redisService: RedisService);
    afterInit(): Promise<void>;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinChat(client: Socket, data: {
        chatId: string;
    }): Promise<void>;
    handleLeaveChat(client: Socket, data: {
        chatId: string;
    }): void;
    handleMessage(client: Socket, data: {
        chatId: string;
        content: string;
        userId: string;
    }): Promise<void>;
    emitToChat(chatId: string, event: string, data: any): void;
}
