import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RegistrationsService } from './registrations.service';
export declare class PaymentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private registrationsService;
    server: Server;
    constructor(registrationsService: RegistrationsService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(_client: Socket): void;
    emitPaymentConfirmed(userId: string, registrationId: string): void;
}
