import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DpoRequestType {
  ACCESS = 'ACCESS',
  PORTABILITY = 'PORTABILITY',
  RECTIFICATION = 'RECTIFICATION',
  DELETION = 'DELETION',
  COMPLAINT = 'COMPLAINT',
  OTHER = 'OTHER',
}

export class CreateDpoRequestDto {
  @ApiProperty({ enum: DpoRequestType })
  @IsEnum(DpoRequestType)
  type: DpoRequestType;

  @ApiProperty({ description: 'Assunto curto' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject: string;

  @ApiProperty({ description: 'Descrição detalhada' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  message: string;

  @ApiPropertyOptional({ description: 'Email (se não autenticado)' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateSecurityIncidentDto {
  @ApiProperty({ description: 'Tipo do incidente (ex.: data_leak, unauthorized_access)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type: string;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @ApiProperty({ description: 'Número estimado de usuários afetados', default: 0 })
  affectedUsers: number;

  @ApiPropertyOptional({ description: 'Notas adicionais' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}

export class UpdateDpoRequestStatusDto {
  @ApiProperty({ enum: ['PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED'] })
  @IsEnum(['PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED'])
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';
}
