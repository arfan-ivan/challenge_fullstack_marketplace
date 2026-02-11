import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service';

@Injectable()
export class CartMiddleware implements NestMiddleware {
    constructor(private cartService: CartService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const session = (req as any).session;

        if (session?.user) {
            res.locals.cartCount =
                await this.cartService.getCartItemCount(session.user.id);
            res.locals.user = session.user;
        } else {
            res.locals.cartCount = 0;
            res.locals.user = null;
        }

        next();
    }
}
