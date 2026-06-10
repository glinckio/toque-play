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
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
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
                teamId: string;
                userId: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                positions: import(".prisma/client").$Enums.VolleyballPosition[];
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
        user: {
            id: string;
            name: string;
            email: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        tournamentId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        userId: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
        categoryId: string;
    }>;
}
