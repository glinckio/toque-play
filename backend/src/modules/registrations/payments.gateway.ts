import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RegistrationsService } from './registrations.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/payments',
})
export class PaymentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private registrationsService: RegistrationsService) {}

  afterInit() {
    this.registrationsService.setPaymentsGateway(this);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user:${userId}`);
    }
  }

  handleDisconnect(_client: Socket) {
    // rooms auto-cleaned
  }

  emitPaymentConfirmed(userId: string, registrationId: string) {
    this.server.to(`user:${userId}`).emit('payment:confirmed', { registrationId });
  }
}
