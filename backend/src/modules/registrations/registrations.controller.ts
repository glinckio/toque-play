import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RegistrationsService } from './registrations.service';
import { Audit } from '../audit/audit.decorator';

@ApiTags('Registrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Minhas inscricoes' })
  async listMine(@CurrentUser('id') userId: string) {
    return this.registrationsService.listMine(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma inscricao' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.registrationsService.findOne(id, userId);
  }

  @Post(':id/checkout')
  @ApiOperation({ summary: 'Criar sessao de pagamento Stripe' })
  @Audit('PAYMENT_CHECKOUT_CREATED', 'Registration', {
    fetchBefore: async (prisma, id) => prisma.registration.findUnique({ where: { id }, select: { id: true, status: true, paymentStatus: true, paymentMethod: true } }),
  })
  async createCheckout(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.registrationsService.createCheckout(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar inscricao' })
  @Audit('REGISTRATION_CANCELLED', 'Registration', {
    fetchBefore: async (prisma, id) => prisma.registration.findUnique({ where: { id }, select: { id: true, status: true, paymentStatus: true } }),
  })
  async cancelRegistration(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.registrationsService.cancelRegistration(id, userId);
  }
}
