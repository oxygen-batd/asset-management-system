// src/schedule/schedule.module.ts
import { Module } from '@nestjs/common';
import { ScheduleDayService } from './schedule.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [
        DatabaseModule,
    ],
    providers: [ScheduleDayService],
})
export class ScheduleDayModule {}
