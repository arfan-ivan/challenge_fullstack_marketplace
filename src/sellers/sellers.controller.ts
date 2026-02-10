import { Controller, Get, Post, Body, Param, Render, Res, Query, Session, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { SellersService } from './sellers.service';

@Controller('admin/sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @Get()
  @Render('sellers/index')
  async index(@Query('search') search: string, @Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }
    const sellers = await this.sellersService.findAll(search);
    return {
      title: 'Sellers Management',
      sellers,
      search: search || '',
      user: session.user,
    };
  }

  @Get('create')
  @Render('sellers/create')
  createPage(@Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }
    return {
      title: 'Create Seller',
      user: session.user,
    };
  }

  @Post('create')
  async create(@Body() body: any, @Res() res: Response) {
    await this.sellersService.create(body);
    res.redirect('/admin/sellers');
  }

  @Get(':id')
  @Render('sellers/detail')
  async detail(@Param('id') id: string, @Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }
    const seller = await this.sellersService.findOne(parseInt(id));
    return {
      title: 'Seller Detail',
      seller,
      user: session.user,
    };
  }

  @Get(':id/edit')
  @Render('sellers/edit')
  async editPage(@Param('id') id: string, @Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }
    const seller = await this.sellersService.findOne(parseInt(id));
    return {
      title: 'Edit Seller',
      seller,
      user: session.user,
    };
  }

  @Post(':id/edit')
  async update(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    await this.sellersService.update(parseInt(id), body);
    res.redirect('/admin/sellers');
  }

  @Post(':id/delete')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.sellersService.delete(parseInt(id));
    res.redirect('/admin/sellers');
  }
}