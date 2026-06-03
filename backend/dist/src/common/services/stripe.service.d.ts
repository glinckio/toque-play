import { ConfigService } from '@nestjs/config';
export declare class StripeService {
    private configService;
    private stripe;
    constructor(configService: ConfigService);
    createCheckoutSession(params: {
        registrationId: string;
        amount: number;
        tournamentName: string;
        categoryName: string;
        teamName: string;
    }): Promise<any>;
    constructWebhookEvent(payload: Buffer, signature: string): any;
}
