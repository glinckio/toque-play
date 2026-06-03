import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubstitutionDto {
  @ApiProperty({ description: 'ID do time que fez a substituição' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'ID do jogador que saiu' })
  @IsUUID()
  playerOutId: string;

  @ApiProperty({ description: 'ID do jogador que entrou' })
  @IsUUID()
  playerInId: string;
}
