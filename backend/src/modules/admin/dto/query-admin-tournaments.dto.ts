import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryAdminTournamentsDto {
  @ApiPropertyOptional({ description: 'Filter by tournament status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Buscar por nome' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ['BEACH', 'COURT'] })
  @IsOptional()
  @IsIn(['BEACH', 'COURT'])
  modality?: 'BEACH' | 'COURT';

  @ApiPropertyOptional({
    description: 'Data inicial (filtra por stages.date >= from)',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'Data final (filtra por stages.date <= to)',
  })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
