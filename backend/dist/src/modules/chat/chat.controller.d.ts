import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    listChats(userId: string): Promise<({
        team: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        messages: ({
            sender: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            chatId: string;
            senderId: string;
        })[];
        teamA: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        teamB: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ChatType;
        teamId: string | null;
        teamAId: string | null;
        teamBId: string | null;
    })[]>;
    getMessages(chatId: string, userId: string, page?: string, limit?: string): Promise<{
        data: ({
            sender: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            chatId: string;
            senderId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    sendMessage(chatId: string, userId: string, dto: SendMessageDto): Promise<{
        sender: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        chatId: string;
        senderId: string;
    }>;
}
