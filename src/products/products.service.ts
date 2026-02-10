import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { category: { contains: search } },
          ],
        }
      : {};

    return this.prisma.product.findMany({
      where,
      include: {
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: true,
      },
    });
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
    sellerId: number;
  }) {
    return this.prisma.product.create({
      data,
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      category?: string;
      imageUrl?: string;
      sellerId?: number;
    },
  ) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}