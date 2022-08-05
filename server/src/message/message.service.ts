import { Prisma } from '.prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/shared/consts';
import { hasAllProperties } from 'src/shared/utils';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(private prisma: PrismaService) {}

  async createMessage(
    activityId: string,
    msgBody: Prisma.MessageCreateInput,
    sender: Prisma.UserUncheckedCreateInput,
  ) {
    try {
      const { text, attachments } = msgBody;

      if (!(sender || activityId || text))
        throw new BadRequestException(ERROR_MESSAGES.ProvideAllRequiredData);

      const activity = await this.prisma.activity.findUnique({
        where: { id: activityId },
      });

      if (!activity)
        throw new NotFoundException(ERROR_MESSAGES.ActivityNotFound);

      const message = await this.prisma.message.create({
        data: {
          activity: {
            connect: {
              id: activityId,
            },
          },
          text,
          sender: {
            fullName: `${sender.firstName + ' ' + sender.lastName}`,
            avatar: sender.avatar,
            id: sender.id,
            country: sender.country,
          },
          createdAt: new Date().toISOString(),
        },
      });

      return message;
    } catch (e) {
      this.logger.error(e.message);

      throw e;
    }
  }

  async getAllMessages(activityId) {
    try {
      const activity = await this.prisma.activity.findUnique({
        where: { id: activityId },
        include: {
          messages: true,
        },
      });

      if (!activity)
        throw new NotFoundException(ERROR_MESSAGES.ActivityNotFound);

      return activity.messages;
    } catch (e) {
      this.logger.error(e.message);

      throw e;
    }
  }

  async deleteMessage(id, user) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
      });

      if (!message) throw new NotFoundException(ERROR_MESSAGES.NotFound);

      if ((message.sender as Prisma.UserUncheckedCreateInput).id !== user.id)
        throw new ForbiddenException();

      await this.prisma.message.delete({
        where: { id },
      });

      return { message: SUCCESS_MESSAGES.SuccessfullyDeleted };
    } catch (e) {
      this.logger.error(e.message);

      throw e;
    }
  }
}
