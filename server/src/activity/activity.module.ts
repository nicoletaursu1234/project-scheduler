import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityService, PrismaService],
})
export class ActivityModule {}
