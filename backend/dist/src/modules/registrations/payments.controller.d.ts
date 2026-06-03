import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { RegistrationsService } from './registrations.service';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { StripeService } from '../../common/services/stripe.service';
export declare class PaymentsController {
    private readonly registrationsService;
    private readonly stripeService;
    constructor(registrationsService: RegistrationsService, stripeService: StripeService);
    handleStripeWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
    handleWebhook(dto: PaymentWebhookDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
}
