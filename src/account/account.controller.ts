import { Controller, Get, Post, Body, Render, Res, Session } from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('account')
export class AccountController {
  constructor(private prisma: PrismaService) {}

  @Get('profile')
  @Render('account/profile')
  async profile(@Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return {
      title: 'My Profile',
      user: session.user,
      profile: user,
      success: null,
      error: null,
    };
  }

  @Post('profile')
  async updateProfile(
    @Body() body: { name: string; phone?: string; address?: string },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    if (!session.user) {
      return res.redirect('/auth/login');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: body.name,
          phone: body.phone,
          address: body.address,
        },
      });

      // Update session
      const { password, ...userWithoutPassword } = updatedUser;
      session.user = userWithoutPassword;

      return res.render('account/profile', {
        title: 'My Profile',
        user: session.user,
        profile: updatedUser,
        success: 'Profile updated successfully!',
        error: null,
      });
    } catch (error) {
      return res.render('account/profile', {
        title: 'My Profile',
        user: session.user,
        profile: await this.prisma.user.findUnique({ where: { id: session.user.id } }),
        success: null,
        error: 'Failed to update profile',
      });
    }
  }

  @Get('change-password')
  @Render('account/change-password')
  changePasswordPage(@Session() session: Record<string, any>) {
    if (!session.user) {
      return { redirect: '/auth/login' };
    }

    return {
      title: 'Change Password',
      user: session.user,
      success: null,
      error: null,
    };
  }

  @Post('change-password')
  async changePassword(
    @Body() body: { currentPassword: string; newPassword: string; confirmPassword: string },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    if (!session.user) {
      return res.redirect('/auth/login');
    }

    try {
      if (body.newPassword !== body.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(body.currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      await this.prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      });

      return res.render('account/change-password', {
        title: 'Change Password',
        user: session.user,
        success: 'Password changed successfully!',
        error: null,
      });
    } catch (error) {
      return res.render('account/change-password', {
        title: 'Change Password',
        user: session.user,
        success: null,
        error: error.message || 'Failed to change password',
      });
    }
  }
}