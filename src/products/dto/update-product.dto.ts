import { IsNumber, IsPositive } from 'class-validator';

import { CreateProductDto } from './create-product.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  @IsPositive()
  id: number;
}
