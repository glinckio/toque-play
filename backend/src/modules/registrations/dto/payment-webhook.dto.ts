import { IsUUID, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentWebhookDto {
  @ApiProperty({ description: 'ID da inscricao' })
  @IsUUID()
  registrationId: string;

  @ApiProperty({ description: 'ID do pagamento no gateway' })
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Status do pagamento' })
  @IsIn(['CONFIRMED', 'PENDING_CONFIRMATION'])
  status: 'CONFIRMED' | 'PENDING_CONFIRMATION';
}
