export declare class PaymentWebhookDto {
    registrationId: string;
    paymentId: string;
    status: 'CONFIRMED' | 'PENDING_CONFIRMATION';
}
