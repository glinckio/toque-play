import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../common/redis/redis.service';
export declare class MatchesGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private redisService;
    server: Server;
    constructor(redisService: RedisService);
    afterInit(): Promise<void>;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinTournament(client: Socket, data: {
        tournamentId: string;
    }): void;
    handleLeaveTournament(client: Socket, data: {
        tournamentId: string;
    }): void;
    handleFriendlyJoin(client: Socket, payload: {
        friendlyId: string;
    }): void;
    handleFriendlyLeave(client: Socket, payload: {
        friendlyId: string;
    }): void;
    handleMatchJoin(client: Socket, payload: {
        matchId: string;
    }): void;
    handleMatchLeave(client: Socket, payload: {
        matchId: string;
    }): void;
    emitToTournament(tournamentId: string, event: string, data: any): void;
    emitToFriendly(friendlyId: string, event: string, data: any): void;
    emitToMatch(matchId: string, event: string, data: any): void;
}
