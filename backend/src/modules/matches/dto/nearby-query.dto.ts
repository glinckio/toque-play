import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class NearbyQueryDto {
  @ApiPropertyOptional({ description: 'User latitude' })
  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @ApiPropertyOptional({ description: 'User longitude' })
  @Type(() => Number)
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional({ description: 'Search radius in km', default: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  radius?: number = 10;
}
