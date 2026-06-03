import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsCpf } from '../../../common/decorators/is-cpf.decorator';

export class AddMemberDto {
  @ApiProperty({ description: 'Email do usuario a adicionar' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'CPF do membro (apenas numeros)' })
  @IsOptional()
  @IsCpf()
  cpf?: string;

  @ApiPropertyOptional({ description: 'Se o membro e capitao' })
  @IsOptional()
  isCaptain?: boolean;
}
