import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

import { Type } from 'class-transformer';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public page?: number = 1;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public limit?: number = 10;
}
