import { Controller, Get, Post, Body, Param, Render, Res, Query, Session } from '@nestjs/common';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @Render('products/index')
  async index(@Query('search') search: string, @Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const products = await this.productsService.findAll(search);
    return {
      title: 'Products Management',
      products,
      search: search || '',
      user: session.user,
    };
  }

  @Get('create')
  @Render('products/create')
  async createPage(@Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const sellers = await this.prisma.seller.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      title: 'Create Product',
      sellers,
      user: session.user,
    };
  }

  @Post('create')
  async create(@Body() body: any, @Res() res: Response) {
    const data = {
      ...body,
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      sellerId: parseInt(body.sellerId),
    };

    await this.productsService.create(data);
    res.redirect('/admin/products');
  }

  @Get(':id')
  @Render('products/detail')
  async detail(@Param('id') id: string, @Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const product = await this.productsService.findOne(parseInt(id));
    return {
      title: 'Product Detail',
      product,
      user: session.user,
    };
  }

  @Get(':id/edit')
  @Render('products/edit')
  async editPage(@Param('id') id: string, @Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const product = await this.productsService.findOne(parseInt(id));
    const sellers = await this.prisma.seller.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      title: 'Edit Product',
      product,
      sellers,
      user: session.user,
    };
  }

  @Post(':id/edit')
  async update(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    const data = {
      ...body,
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      sellerId: parseInt(body.sellerId),
    };

    await this.productsService.update(parseInt(id), data);
    res.redirect('/admin/products');
  }

  @Post(':id/delete')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.productsService.delete(parseInt(id));
    res.redirect('/admin/products');
  }
}