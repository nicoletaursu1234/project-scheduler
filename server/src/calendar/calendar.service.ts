import { Prisma } from '.prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  PRISMA_ERROR_CODES,
  SUCCESS_MESSAGES,
} from 'src/shared/consts';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(private prisma: PrismaService) {}

  async createCalendar(
    calendarData,
    user: Prisma.UserWhereUniqueInput,
  ): Promise<Prisma.CalendarCreateInput | void> {
    const { name, isPublic } = calendarData;

    let calendar;
    try {
      if (!name || !isPublic === null) {
        throw new BadRequestException(ERROR_MESSAGES.ProvideAllRequiredData);
      }

      calendar = await this.prisma.calendar.create({
        data: {
          ...calendarData,
        },
        include: { members: true },
      });

      await this.prisma.user.update({
        where: { email: user.email },
        data: {
          calendars: {
            connect: {
              id: calendar.id,
            },
          },
        },
      });
    } catch (e) {
      this.logger.log(e.message);

      throw new InternalServerErrorException();
    }

    return calendar;
  }

  async getCalendarListByUserId(user: Prisma.UserWhereUniqueInput) {
    let calendars: Prisma.CalendarWhereUniqueInput[];

    try {
      if (!user) {
        throw new UnauthorizedException();
      }

      const userWithCalendars = await this.prisma.user.findUnique({
        where: { email: user.email },
        include: {
          calendars: {
            include: {
              activities: true,
            },
          },
        },
      });

      calendars = userWithCalendars.calendars;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    return calendars;
  }

  async getCalendarById(
    id: string,
    currUser: Prisma.UserWhereInput,
  ): Promise<Prisma.CalendarInclude> {
    let calendar;

    try {
      if (!id) throw new BadRequestException();

      calendar = await this.prisma.calendar.findUnique({
        where: { id },
        include: { members: true, activities: true },
      });

      if (!calendar)
        throw new NotFoundException(ERROR_MESSAGES.CalendarNotFound);

      const membersId = calendar?.members?.map((member) => member.id);

      if (!membersId.includes(currUser.id)) throw new ForbiddenException();
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    return calendar;
  }

  async inviteMemberToCalendar(member: string, calendarId: string) {
    try {
      if (!member || !calendarId) {
        throw new BadRequestException('Please provide all data');
      }

      console.log(member);
      const user = await this.prisma.user.findUnique({
        where: { email: member },
      });
      console.log({ user });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const calendar = await this.prisma.calendar.findUnique({
        where: { id: calendarId },
      });

      if (!calendar)
        throw new NotFoundException(ERROR_MESSAGES.CalendarNotFound);

      const updatedCalendar = await this.prisma.calendar.update({
        where: { id: calendarId },
        data: {
          isPublic: true,
          members: {
            connect: {
              email: member,
            },
          },
        },
        include: {
          members: true,
          activities: true,
        },
      });

      if (!calendar)
        throw new NotFoundException(ERROR_MESSAGES.CalendarNotFound);

      return { message: SUCCESS_MESSAGES.Success, calendar: updatedCalendar };
    } catch (e) {
      this.logger.error(e);

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_ERROR_CODES.ResourceNotFound) {
          throw new NotFoundException(ERROR_MESSAGES.CalendarNotFound);
        }
      }

      throw e;
    }
  }

  async removeMemberFromCalendar(calendarId: string, member: string, currUser) {
    try {
      if (!calendarId || !member)
        throw new BadRequestException(ERROR_MESSAGES.ProvideAllRequiredData);

      const calendar = await this.prisma.calendar.findUnique({
        where: { id: calendarId },
        include: { members: true },
      });

      if (!calendar)
        throw new NotFoundException(ERROR_MESSAGES.CalendarNotFound);

      const membersEmail = calendar?.members?.map((member) => member.email);

      if (!membersEmail.includes(currUser.email))
        throw new ForbiddenException();

      const updateCalendar = await this.prisma.calendar.update({
        where: { id: calendarId },
        data: {
          members: {
            disconnect: [{ email: member }],
          },
        },
        include: {
          members: true,
          activities: true,
        },
      });

      return {
        message: 'Successfully removed member',
        calendar: updateCalendar,
      };
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async updateCalendar(id: string, data: Prisma.CalendarCreateInput, currUser) {
    console.log(data);
    try {
      const calendar = await this.prisma.calendar.update({
        where: { id },
        data,
        include: { members: true, activities: true },
      });

      if (!calendar)
        throw new NotFoundException(ERROR_MESSAGES.CalendarNotFound);

      const membersId = calendar?.members?.map((member) => member.id);

      if (!membersId.includes(currUser.id)) throw new ForbiddenException();

      return calendar;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async deleteCalendar(id: string, currUser) {
    try {
      const calendar = await this.prisma.calendar.findUnique({
        where: { id },
        include: { members: true },
      });

      if (!calendar)
        throw new NotFoundException(ERROR_MESSAGES.CalendarNotFound);

      const membersId = calendar?.members?.map((member) => member.id);

      if (!membersId.includes(currUser.id)) throw new ForbiddenException();

      await this.prisma
        .$executeRaw`DELETE FROM "public"."Calendar" WHERE id=${id}`;

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
