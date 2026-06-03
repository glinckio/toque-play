import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiPropertyOptional({ description: 'Se o membro e capitao' })
  @IsBoolean()
  @IsOptional()
  isCaptain?: boolean;
}
