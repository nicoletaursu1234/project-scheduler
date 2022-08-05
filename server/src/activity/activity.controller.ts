import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Prisma } from '.prisma/client';
import { JWTAuthGuard } from 'src/auth/jwt.auth-guard';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('')
  @UseGuards(JWTAuthGuard)
  async createActivity(
    @Body() activityData: Prisma.ActivityCreateInput,
    @Req() { user }: Request & { user: Prisma.UserWhereUniqueInput },
  ): Promise<any> {
    return await this.activityService.createActivity(activityData, user);
  }

  @Get('all/:id')
  @UseGuards(JWTAuthGuard)
  async getAllActivitiesByUser(
    @Req() { user }: Request & { user: Prisma.UserWhereUniqueInput },
    @Param('id') calendarId: string,
  ): Promise<any> {
    return await this.activityService.getAllActivitiesByUser(user, calendarId);
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async getActivityById(
    @Param('id') id: string,
    @Req() { user }: Request & { user: Prisma.UserUncheckedCreateInput },
  ) {
    return await this.activityService.getActivityById(id, user);
  }

  @Put(':id')
  @UseGuards(JWTAuthGuard)
  async updateActivity(
    @Param('id') id: string,
    @Body() data: Prisma.ActivityCreateInput,
    @Req() { user }: Request & { user: Prisma.UserUncheckedCreateInput },
  ) {
    return await this.activityService.updateActivity(id, data, user);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  async deleteActivity(
    @Param('id') id: string,
    @Req() { user }: Request & { user: Prisma.UserUncheckedCreateInput },
  ) {
    return await this.activityService.deleteActivity(id, user);
  }
}
