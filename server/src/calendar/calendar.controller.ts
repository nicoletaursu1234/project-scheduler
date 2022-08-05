import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Prisma } from '.prisma/client';
import { CalendarService } from './calendar.service';
import { JWTAuthGuard } from 'src/auth/jwt.auth-guard';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('new')
  @UseGuards(JWTAuthGuard)
  async createCalendar(
    @Body() calendarData: Prisma.CalendarCreateManyInput,
    @Req() { user }: Request & { user: Prisma.UserWhereUniqueInput },
  ): Promise<any> {
    return await this.calendarService.createCalendar(calendarData, user);
  }

  @Get('all')
  @UseGuards(JWTAuthGuard)
  async getCalendarListByUserId(
    @Req() { user }: Request & { user: Prisma.UserWhereUniqueInput },
  ): Promise<any> {
    return await this.calendarService.getCalendarListByUserId(user);
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async getCalendarById(
    @Param('id') id: string,
    @Req() { user }: Request & { user: Prisma.UserWhereInput },
  ) {
    return await this.calendarService.getCalendarById(id, user);
  }

  @Post('member/invite')
  @UseGuards(JWTAuthGuard)
  async inviteMemberToCalendar(@Body() data) {
    return await this.calendarService.inviteMemberToCalendar(
      data?.member,
      data?.id,
    );
  }

  @Post('member/remove')
  @UseGuards(JWTAuthGuard)
  async removeMemberFromCalendar(
    @Body() data,
    @Req() { user }: Request & { user: Prisma.UserWhereInput },
  ) {
    return await this.calendarService.removeMemberFromCalendar(
      data?.id,
      data?.member,
      user,
    );
  }

  @Put(':id')
  @UseGuards(JWTAuthGuard)
  async updateCalendar(
    @Param('id') id: string,
    @Body() data: Prisma.CalendarCreateInput,
    @Req() { user }: Request & { user: Prisma.UserWhereInput },
  ) {
    return await this.calendarService.updateCalendar(id, data, user);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  async deleteCalendar(
    @Param('id') id: string,
    @Req() { user }: Request & { user: Prisma.UserWhereInput },
  ) {
    return await this.calendarService.deleteCalendar(id, user);
  }
}
