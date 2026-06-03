import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Nome do usuario' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Email do usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuario' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Confirmacao de senha' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o: RegisterDto) => o.password !== o.confirmPassword)
  confirmPassword: string;
}
