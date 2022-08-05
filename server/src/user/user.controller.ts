import {
  Body,
  Controller,
  Post,
  HttpCode,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { JWTAuthGuard } from 'src/auth/jwt.auth-guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async getUser(@Req() { user }: Request & { user: Prisma.UserWhereInput }) {
    return user;
  }

  @Post('signup')
  @HttpCode(201)
  async signUp(@Body() userCredentials: Prisma.UserCreateInput): Promise<any> {
    return await this.userService.signUp(userCredentials);
  }

  @Post('login')
  @HttpCode(200)
  async logIn(@Body() userCredentials: Prisma.UserCreateInput): Promise<any> {
    return await this.userService.logIn(userCredentials);
  }

  @Put()
  @UseGuards(JWTAuthGuard)
  async updateUser(
    @Body() userData: Prisma.UserUpdateInput,
    @Req() { user }: Request & { user: Prisma.UserWhereInput },
  ) {
    return await this.userService.updateUser(userData, user);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(JWTAuthGuard)
  async updateAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() { user }: Request & { user: Prisma.UserWhereInput },
  ) {
    return await this.userService.updateAvatar(user, avatar);
  }
}
