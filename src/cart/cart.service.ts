import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(userId: number, productId: number, quantity: number = 1) {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  async updateCartItem(cartItemId: number, quantity: number) {
    if (quantity <= 0) {
      return this.prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    }
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeFromCart(cartItemId: number) {
    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }

  async getCartTotal(userId: number): Promise<number> {
    const cart = await this.getOrCreateCart(userId);

    let total = 0;
    for (const item of cart.items) {
      total += Number(item.product.price) * item.quantity;
    }

    return total;
  }
  
  async getCartItemCount(userId: number): Promise<number> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      select: {
        items: {
          select: { quantity: true },
        },
      },
    });

    if (!cart) return 0;

    return cart.items.reduce((sum, i) => sum + i.quantity, 0);
  }
}