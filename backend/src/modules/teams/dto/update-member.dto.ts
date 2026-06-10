import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiPropertyOptional({ description: 'Se o membro e capitao' })
  @IsBoolean()
  @IsOptional()
  isCaptain?: boolean;

  @ApiPropertyOptional({ description: 'Posicao do jogador (levantador, ponteiro, oposto, central, libero)' })
  @IsString()
  @IsOptional()
  position?: string;
}
