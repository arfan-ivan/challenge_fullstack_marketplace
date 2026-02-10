import { Controller, Get, Render, Session } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('dashboard')
  @Render('admin/dashboard')
  async dashboard(@Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const totalSellers = await this.prisma.seller.count();
    const totalProducts = await this.prisma.product.count();
    const recentSellers = await this.prisma.seller.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    const recentProducts = await this.prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { seller: true },
    });

    return {
      title: 'Admin Dashboard',
      user: session.user,
      stats: {
        totalSellers,
        totalProducts,
      },
      recentSellers,
      recentProducts,
    };
  }
}