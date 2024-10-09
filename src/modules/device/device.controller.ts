import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Req
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeviceService } from './device.service';
import { Device } from '../../database/schemas/device.schema';
import { ParseObjectIdPipe } from '../../shared/pipe/parse-object-id.pipe';
import { ResDeviceDto } from './dto/dto/response.device.dto';
import { UpdateDeviceDto } from './dto/dto/update-device.dto';
import { CreateDeviceDto } from './dto/dto/create-device.dto';


@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) { }

    @Get()
    getAll(): Observable<{ device: Device[] }> {
        return this.deviceService.findAll();
    }

    @Get(':id')
    getDeviceById(@Param('id', ParseObjectIdPipe) id: string): Observable<{ device: ResDeviceDto }> {
        return this.deviceService.findById(id);
    }

    @Post()
    async createDevice(
        @Body() createAssetDto: CreateDeviceDto,
        @Req() req: Request
    ): Promise<Device> {
        return this.deviceService.save(createAssetDto);
    }


    @Put(':id')
    updateDevice(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateAssetDto: UpdateDeviceDto,
    ): Promise<{ device: Device}> {
        return this.deviceService.updateDevice(id, updateAssetDto);
    }

    @Delete(':id')
    deleteDevice(@Param('id', ParseObjectIdPipe) id: string): Observable<Device> {
        return this.deviceService.delete(id);
    }
}