import { Controller, Get, Render, Session } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class PublicController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Render('public/landing')
  async landing(@Session() session: Record<string, any>) {
    const products = await this.prisma.product.findMany({
      include: {
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      title: 'Marketplace - Shop All Products',
      products,
      user: session.user || null,
    };
  }
}