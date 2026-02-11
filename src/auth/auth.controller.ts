import { Controller, Get, Post, Body, Render, Session, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('login')
  @Render('auth/login')
  loginPage(@Session() session: Record<string, any>) {
    if (session.user) {
      return { redirect: session.user.role === 'admin' ? '/admin/dashboard' : '/' };
    }
    return {
      title: 'Login - Marketplace',
      error: null
    };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.login(body.email, body.password);
      session.user = user;

      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else {
        return res.redirect('/');
      }
    } catch (error) {
      return res.status(401).render('auth/login', {
        title: 'Login - Marketplace',
        error: 'Invalid email or password',
      });
    }
  }

  @Get('register')
  @Render('auth/register')
  registerPage(@Session() session: Record<string, any>) {
    if (session.user) {
      return { redirect: session.user.role === 'admin' ? '/admin/dashboard' : '/' };
    }
    return {
      title: 'Register - Marketplace',
      error: null
    };
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string; phone?: string; address?: string },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.createUser(
        body.email,
        body.password,
        body.name,
        body.phone,
        body.address
      );

      const { password, ...userWithoutPassword } = user;
      session.user = userWithoutPassword;

      return res.redirect('/');
    } catch (error) {
      return res.status(400).render('auth/register', {
        title: 'Register - Marketplace',
        error: error.message || 'Registration failed. Email might already exist.',
      });
    }
  }

  @Get('logout')
  logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.destroy((err) => {
      res.redirect('/');
    });
  }
}