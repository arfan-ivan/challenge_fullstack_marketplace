import { Controller, Get, Post, Body, Param, Render, Res, Session } from '@nestjs/common';
import type { Response } from 'express';
import { OrdersService } from './orders.service';
import { CartService } from '../cart/cart.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private cartService: CartService,
  ) {}

  @Get()
  @Render('orders/index')
  async listOrders(@Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const orders = await this.ordersService.getUserOrders(session.user.id);

    return {
      title: 'My Orders',
      user: session.user,
      orders,
    };
  }

  @Get('checkout')
  @Render('orders/checkout')
  async checkoutPage(@Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const cart = await this.cartService.getOrCreateCart(session.user.id);
    const total = await this.cartService.getCartTotal(session.user.id);

    if (cart.items.length === 0) {
      return { redirect: '/cart' };
    }

    return {
      title: 'Checkout',
      user: session.user,
      cart,
      total,
    };
  }

  @Post('checkout')
  async createOrder(
    @Body() body: { shippingAddress: string },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    if (!session.user) {
      return res.redirect('/auth/login');
    }

    try {
      const order = await this.ordersService.createOrder(
        session.user.id,
        body.shippingAddress,
      );
      return res.redirect(`/orders/${order.id}`);
    } catch (error) {
      return res.redirect('/cart');
    }
  }

  @Get(':id')
  @Render('orders/detail')
  async orderDetail(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const order = await this.ordersService.getOrderById(parseInt(id));

    if (!order) {
      return { redirect: '/orders' };
    }

    if (order.userId !== session.user.id && session.user.role !== 'admin') {
      return { redirect: '/orders' };
    }

    return {
      title: 'Order Detail',
      user: session.user,
      order,
    };
  }
}