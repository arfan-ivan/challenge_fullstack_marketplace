import { Controller, Get, Post, Body, Param, Render, Res, Session, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @Render('cart/index')
  async viewCart(@Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const cart = await this.cartService.getOrCreateCart(session.user.id);
    const total = await this.cartService.getCartTotal(session.user.id);

    return {
      title: 'Shopping Cart',
      user: session.user,
      cart,
      total,
    };
  }

  @Post('add/:productId')
  async addToCart(
    @Param('productId') productId: string,
    @Body() body: { quantity?: string },
    @Session() session: Record<string, any>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!session.user) {
      return res.redirect('/auth/login');
    }

    const quantity = body.quantity ? parseInt(body.quantity) : 1;
    await this.cartService.addToCart(session.user.id, parseInt(productId), quantity);

    const referer = req.get('Referer') || '/';
    return res.redirect(referer);
  }

  @Post('update/:itemId')
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() body: { quantity: string },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    if (!session.user) {
      return res.redirect('/auth/login');
    }

    await this.cartService.updateCartItem(parseInt(itemId), parseInt(body.quantity));
    return res.redirect('/cart');
  }

  @Post('remove/:itemId')
  async removeItem(
    @Param('itemId') itemId: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    if (!session.user) {
      return res.redirect('/auth/login');
    }

    await this.cartService.removeFromCart(parseInt(itemId));
    return res.redirect('/cart');
  }

  @Post('clear')
  async clearCart(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.user) {
      return res.redirect('/auth/login');
    }

    await this.cartService.clearCart(session.user.id);
    return res.redirect('/cart');
  }
}