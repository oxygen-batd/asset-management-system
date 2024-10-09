import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { AssetDataInitializerService } from '../../initializers/device.initializer';

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [DeviceController],
    providers: [DeviceService, AssetDataInitializerService],
    exports: [DeviceService]
})
export class DeviceModule { }
