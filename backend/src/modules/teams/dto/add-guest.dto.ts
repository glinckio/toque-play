import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsCpf } from '../../../common/decorators/is-cpf.decorator';

export class AddGuestDto {
  @ApiProperty({ description: 'Nome do convidado' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  guestName: string;

  @ApiPropertyOptional({ description: 'CPF do convidado (apenas numeros)' })
  @IsOptional()
  @IsCpf()
  cpf?: string;
}
