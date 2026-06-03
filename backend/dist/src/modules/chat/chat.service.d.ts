import { PrismaService } from '../../common/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    listUserChats(userId: string): Promise<({
        team: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ChatType;
        teamId: string | null;
        teamAId: string | null;
        teamBId: string | null;
    })[]>;
    getMessages(chatId: string, userId: string, page?: number, limit?: number): Promise<{
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
    validateAccess(chatId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ChatType;
        teamId: string | null;
        teamAId: string | null;
        teamBId: string | null;
    }>;
    private isUserInChat;
    createIntraTeamChat(teamId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ChatType;
        teamId: string | null;
        teamAId: string | null;
        teamBId: string | null;
    }>;
    createInterTeamChat(teamAId: string, teamBId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ChatType;
        teamId: string | null;
        teamAId: string | null;
        teamBId: string | null;
    }>;
}
