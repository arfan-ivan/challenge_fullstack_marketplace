import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import session from 'express-session';

const hbs = require('hbs');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(process.cwd(), 'views', 'partials'));

  hbs.registerHelper('eq', (a, b) => a === b);

  hbs.registerHelper('formatPrice', (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price),
  );

  hbs.registerHelper('formatDate', (date) =>
    new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  );

  hbs.registerHelper('multiply', function (a, b) {
    return a * b;
  });

  hbs.registerHelper('gt', function (a, b) {
    return a > b;
  });
                
  app.useStaticAssets(join(process.cwd(), 'public'));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );

  app.use(require('body-parser').urlencoded({ extended: true }));

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Login at: http://localhost:3000/auth/login');
}

bootstrap();
