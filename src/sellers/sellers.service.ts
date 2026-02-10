import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {};

    return this.prisma.seller.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.seller.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    description?: string;
  }) {
    return this.prisma.seller.create({
      data,
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      description?: string;
    },
  ) {
    return this.prisma.seller.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.seller.delete({
      where: { id },
    });
  }
}