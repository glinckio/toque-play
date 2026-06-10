import { IsBoolean, IsOptional, IsString, IsArray, IsEnum, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VolleyballPosition } from '@prisma/client';

export class UpdateMemberDto {
  @ApiPropertyOptional({ description: 'Se o membro e capitao' })
  @IsBoolean()
  @IsOptional()
  isCaptain?: boolean;

  @ApiPropertyOptional({
    description: 'Posicoes do atleta',
    enum: VolleyballPosition,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(VolleyballPosition, { each: true })
  positions?: VolleyballPosition[];

  @ApiPropertyOptional({ description: 'Nome do convidado (apenas para guests)' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  guestName?: string;
}
