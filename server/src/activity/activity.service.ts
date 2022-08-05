import { Prisma } from '.prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  PRISMA_ERROR_CODES,
  SUCCESS_MESSAGES,
} from 'src/shared/consts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(private prisma: PrismaService) {}

  async createActivity(
    activityData,
    user: Prisma.UserWhereUniqueInput,
  ): Promise<Prisma.ActivityCreateInput | void> {
    const { calendarId, ...rest } = activityData;
    let activity;

    try {
      activity = await this.prisma.activity.create({
        data: {
          ...rest,
          calendar: {
            connect: {
              id: calendarId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          messages: {
            create: [],
          },
        },
        include: { messages: true, calendar: true, user: true },
      });
    } catch (e) {
      this.logger.log(e.message);

      throw new InternalServerErrorException();
    }

    return activity;
  }

  async getAllActivitiesByUser(user: Prisma.UserWhereUniqueInput, id: string) {
    let activities: Prisma.ActivityWhereUniqueInput[];

    try {
      const calendarWithActivities = await this.prisma.calendar.findUnique({
        where: { id },
        include: {
          activities: true,
        },
      });

      activities = calendarWithActivities.activities;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    return activities;
  }

  async getActivityById(
    id: string,
    currUser: Prisma.UserUncheckedCreateInput,
  ): Promise<Prisma.CalendarInclude> {
    let activity;

    try {
      if (!id) throw new BadRequestException();

      activity = await this.prisma.activity.findUnique({
        where: { id },
        include: { user: true, messages: true, calendar: true },
      });

      if (!activity)
        throw new NotFoundException(ERROR_MESSAGES.ActivityNotFound);

      const calendar = await this.prisma.calendar.findUnique({
        where: { id: activity?.calendar?.id },
        include: { members: true },
      });
      const membersId = calendar?.members?.map((member) => member.id);

      if (!membersId.includes(currUser.id)) throw new ForbiddenException();
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    return activity;
  }

  async updateActivity(
    id: string,
    data: Prisma.ActivityCreateInput,
    currUser: Prisma.UserUncheckedCreateInput,
  ) {
    try {
      const activity = await this.prisma.activity.update({
        where: { id },
        data,
        include: { messages: true, calendar: true, user: true },
      });

      if (!activity)
        throw new NotFoundException(ERROR_MESSAGES.ActivityNotFound);

      const calendar = await this.prisma.calendar.findUnique({
        where: { id: activity?.calendar?.id },
        include: { members: true },
      });
      const membersId = calendar?.members?.map((member) => member.id);

      if (!membersId.includes(currUser.id)) throw new ForbiddenException();

      return activity;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async deleteActivity(id: string, currUser: Prisma.UserUncheckedCreateInput) {
    try {
      const activity = await this.prisma.activity.findUnique({
        where: { id },
        include: { calendar: true },
      });

      if (!activity)
        throw new NotFoundException(ERROR_MESSAGES.ActivityNotFound);

      const calendar = await this.prisma.calendar.findUnique({
        where: { id: activity?.calendar?.id },
        include: { members: true },
      });
      const membersId = calendar?.members?.map((member) => member.id);

      if (!membersId.includes(currUser.id)) throw new ForbiddenException();

      await this.prisma
        .$executeRaw`DELETE FROM "public"."Activity" WHERE id=${id}`;

      return { message: SUCCESS_MESSAGES.SuccessfullyDeleted };
    } catch (e) {
      this.logger.error(e);

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_ERROR_CODES.ResourceNotFound) {
          throw new NotFoundException(ERROR_MESSAGES.NotFound);
        }
      }

      throw e;
    }
  }
}
