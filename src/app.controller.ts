import {
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @Redirect()
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const jwt = (await this.authService.login(req.user)).access_token;
    response.cookie('jwt', jwt, { httpOnly: true });
    return { url: '/news' };
  }

  @Get('/login')
  @Render('login-form')
  async loginForm() {
    return { title: 'Аутентификация' };
  }

  @Get('/logout')
  @Redirect()
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('jwt', '', { expires: new Date() });
    return { url: '/news' };
  }

  //
  // API
  //

  @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  async loginAPIMethod(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/auth/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  //
  // garbage
  //

  getHello(): any {
    throw new Error('Method not implemented.');
  }
}
