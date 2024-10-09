import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { DeviceModule } from './modules/device/device.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { LocationModule } from './modules/location/location.module';
import { ScheduleDayModule } from './modules/schedule/schedule.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    DatabaseModule,
    DeviceModule,
    OrganizationModule,
    LocationModule,
    ScheduleDayModule
  ],
  controllers: [

  ],
  providers: [

  ],
})
export class AppModule {}
