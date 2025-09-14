import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from './../common/dto/pagination.dto';
import { PrismaClient } from 'generated/prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createProductDto: CreateProductDto) {
    const data = await this.product.create({ data: createProductDto });
    return {
      meta: {
        isCreated: data ? true : false,
      },
      data,
      links: {
        self: `/products/${data.id}`,
        create: `/products`,
        update: `/products/${data.id}`,
        delete: `/products/${data.id}`,
      },
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const totalItems = await this.product.count({ where: { available: true } });

    const data = await this.product.findMany({
      where: { available: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      meta: {
        totalItems: totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
      data,
      links: {
        self: `/products?page=${page}&limit=${limit}`,
        next: `/products?page=${page + 1}&limit=${limit}`,
        previous: page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null,
        first: `/products?page=1&limit=${limit}`,
        last: `/products?page=${Math.ceil(totalItems / limit)}&limit=${limit}`,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return {
      meta: {
        currentPage: 1,
        itemsPerPage: 1,
        totalItems: 1,
        itemCount: 1,
        totalPages: 1,
      },
      data: product,
      links: {
        self: `/products/${id}`,
        create: `/products`,
        update: `/products/${id}`,
        delete: `/products/${id}`,
      },
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...data } = updateProductDto;

    const product = await this.findOne(id);
    if (product) {
      const updatedData = await this.product.update({
        where: { id },
        data: data,
      });
      return {
        meta: {
          isUpdated: updatedData ? true : false,
        },
        data: updatedData,
        links: {
          self: `/products/${id}`,
          create: `/products`,
          update: `/products/${id}`,
          delete: `/products/${id}`,
        },
      };
    }

    throw new BadRequestException(`Product with ID ${id} not found`);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (product) {
      const data = await this.product.update({
        where: { id },
        data: { available: false },
      });
      return {
        meta: {
          isDeleted: data ? true : false,
        },
        data,
        links: {
          self: `/products/${id}`,
          create: `/products`,
          update: `/products/${id}`,
          delete: `/products/${id}`,
        },
      };
    }

    throw new NotFoundException(`Product with ID ${id} not found`);
  }
}
