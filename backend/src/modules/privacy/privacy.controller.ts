import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PrivacyService } from './privacy.service';
import { IsEmail, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class DeleteAccountDto {
  @ApiProperty({ description: 'Confirmação: digite seu email para confirmar a exclusão' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

class UpdateConsentsDto {
  @ApiPropertyOptional({ description: 'Aceita receber notificações push' })
  @IsOptional()
  @IsBoolean()
  notificationsPush?: boolean;

  @ApiPropertyOptional({ description: 'Aceita usar localização para descoberta' })
  @IsOptional()
  @IsBoolean()
  locationDiscovery?: boolean;

  @ApiPropertyOptional({ description: 'Aceita receber emails de marketing' })
  @IsOptional()
  @IsBoolean()
  marketingEmail?: boolean;
}

@ApiTags('Privacy (LGPD)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('data-summary')
  @ApiOperation({ summary: 'Resumo de dados pessoais (LGPD art. 18, I)' })
  @ApiResponse({ status: 200, description: 'Contagem por entidade' })
  getDataSummary(@CurrentUser('id') userId: string) {
    return this.privacyService.getDataSummary(userId);
  }

  @Get('consents')
  @ApiOperation({ summary: 'Lista consentimentos atuais + versão dos termos' })
  @ApiResponse({ status: 200, description: 'Estado atual dos consentimentos' })
  getConsents(@CurrentUser('id') userId: string) {
    return this.privacyService.getConsents(userId);
  }

  @Put('consents')
  @ApiOperation({ summary: 'Atualiza consentimentos granulares (LGPD art. 8 — revogação)' })
  @ApiResponse({ status: 200, description: 'Consentimentos atualizados' })
  updateConsents(
    @CurrentUser() user: { id: string; email: string },
    @Body() dto: UpdateConsentsDto,
    @Req() req: Request,
  ) {
    const forwarded = (req.headers['x-forwarded-for'] as string | undefined) ?? null;
    const ip = forwarded ? forwarded.split(',')[0].trim() : (req.ip ?? null);
    const userAgent = req.headers['user-agent'] ?? null;
    return this.privacyService.updateConsents(user.id, dto, {
      email: user.email,
      ip,
      userAgent,
    });
  }

  @Post('export')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 86400000, limit: 1 } }) // 1/day
  @ApiOperation({ summary: 'Exportar todos os dados pessoais (LGPD art. 18, V — portabilidade)' })
  @ApiResponse({ status: 200, description: 'Export gerado' })
  @ApiResponse({ status: 429, description: 'Cooldown 24h' })
  exportData(
    @CurrentUser() user: { id: string; email: string },
    @Req() req: Request,
  ) {
    const forwarded = (req.headers['x-forwarded-for'] as string | undefined) ?? null;
    const ip = forwarded ? forwarded.split(',')[0].trim() : (req.ip ?? null);
    const userAgent = req.headers['user-agent'] ?? null;
    return this.privacyService.exportUserData(user.id, {
      email: user.email,
      ip,
      userAgent,
    });
  }

  @Delete('delete-account')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 3600000, limit: 3 } })
  @ApiOperation({ summary: 'Excluir conta e anonimizar dados (LGPD art. 18, VI — eliminação)' })
  @ApiResponse({ status: 200, description: 'Conta anonimizada' })
  @ApiResponse({ status: 400, description: 'Email de confirmação não confere' })
  deleteAccount(
    @CurrentUser() user: { id: string; email: string },
    @Body() dto: DeleteAccountDto,
    @Req() req: Request,
  ) {
    const forwarded = (req.headers['x-forwarded-for'] as string | undefined) ?? null;
    const ip = forwarded ? forwarded.split(',')[0].trim() : (req.ip ?? null);
    const userAgent = req.headers['user-agent'] ?? null;
    return this.privacyService.deleteAccount(
      user.id,
      { email: dto.email, expectedEmail: user.email },
      { ip, userAgent },
    );
  }
}
