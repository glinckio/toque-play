import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { RedisService } from '../../common/redis/redis.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MatchesGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private redisService: RedisService) {}

  async afterInit() {
    try {
      const pubClient = this.redisService.getClient().duplicate();
      const subClient = this.redisService.getClient().duplicate();
      (this.server as any).adapter(createAdapter(pubClient, subClient));
    } catch {
      // Redis adapter optional — falls back to in-memory
    }
  }

  handleConnection(client: Socket) {
    console.log('[WS] Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('[WS] Client disconnected:', client.id);
  }

  @SubscribeMessage('tournament:join')
  handleJoinTournament(client: Socket, data: { tournamentId: string }) {
    client.join(`tournament:${data.tournamentId}`);
  }

  @SubscribeMessage('tournament:leave')
  handleLeaveTournament(client: Socket, data: { tournamentId: string }) {
    client.leave(`tournament:${data.tournamentId}`);
  }

  @SubscribeMessage('friendly:join')
  handleFriendlyJoin(client: Socket, payload: { friendlyId: string }) {
    client.join(`friendly:${payload.friendlyId}`);
  }

  @SubscribeMessage('friendly:leave')
  handleFriendlyLeave(client: Socket, payload: { friendlyId: string }) {
    client.leave(`friendly:${payload.friendlyId}`);
  }

  @SubscribeMessage('match:join')
  handleMatchJoin(client: Socket, payload: { matchId: string }) {
    console.log('[WS] match:join', payload.matchId, 'client:', client.id);
    client.join(`match:${payload.matchId}`);
  }

  @SubscribeMessage('match:leave')
  handleMatchLeave(client: Socket, payload: { matchId: string }) {
    client.leave(`match:${payload.matchId}`);
  }

  emitToTournament(tournamentId: string, event: string, data: any) {
    this.server.to(`tournament:${tournamentId}`).emit(event, data);
  }

  emitToFriendly(friendlyId: string, event: string, data: any) {
    this.server.to(`friendly:${friendlyId}`).emit(event, data);
  }

  emitToMatch(matchId: string, event: string, data: any) {
    this.server.to(`match:${matchId}`).emit(event, data);
  }
}
