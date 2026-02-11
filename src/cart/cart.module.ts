import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartMiddleware } from './cart.middleware';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CartMiddleware)
      .forRoutes('*');
  }
}
