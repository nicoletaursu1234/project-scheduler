import {
  Body,
  Controller,
  Post,
  Param,
  Delete,
  Put,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JWTAuthGuard } from 'src/auth/jwt.auth-guard';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('activity/:id')
  @UseGuards(JWTAuthGuard)
  async createMessage(
    @Param() activityId: { id: string },
    @Body() messageData: Prisma.MessageCreateInput,
    @Req() { user }: Request & { user: Prisma.UserUncheckedCreateInput },
  ): Promise<any> {
    return await this.messageService.createMessage(
      activityId.id,
      messageData,
      user,
    );
  }

  @Get('activity/:id')
  @UseGuards(JWTAuthGuard)
  async getAllMessagesByUser(
    @Param() activityId: { id: string },
  ): Promise<any> {
    return await this.messageService.getAllMessages(activityId.id);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  async deleteActivity(
    @Param('id') id: string,
    @Req() { user }: Request & { user: Prisma.UserUncheckedCreateInput },
  ) {
    return await this.messageService.deleteMessage(id, user);
  }
}
