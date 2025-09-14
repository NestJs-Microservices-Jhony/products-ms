import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Type(() => Number)
  public price: number;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  public available?: boolean = true;
}
