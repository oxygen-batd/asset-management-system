// src/device/device.service.ts
import { BadRequestException, Injectable, NotFoundException, Logger, Scope, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { DEVICE_MODEL } from '../../database/constants';

import { Device } from 'src/database/schemas/device.schema';
import { ResDeviceDto } from './dto/dto/response.device.dto';
import { CreateDeviceDto } from './dto/dto/create-device.dto';
import { UpdateDeviceDto } from './dto/dto/update-device.dto';


@Injectable({ scope: Scope.DEFAULT })
export class DeviceService {
    private readonly logger = new Logger(DeviceService.name);

    constructor(
        @Inject(DEVICE_MODEL) private deviceModel: Model<Device>,
    ) {
        this.logger.log('DeviceService initialized...');
    }

    findAll(): Observable<{ device: Device[] }> {
        return from(
            this.deviceModel.find()
                .populate('locationId')
                .populate('organizationId')
                .exec()
        ).pipe(
            map(devices => {
                return { device: devices };
            }),
            catchError(err => {
                this.logger.error(`Error retrieving devices: ${err.message}`);
                return throwError(() => new BadRequestException('Error retrieving devices'));
            })
        );
    }

    findById(id: string): Observable<{ device: ResDeviceDto }> {
        return from(
            this.deviceModel.findById(id)
                .populate('locationId')
                .populate('organizationId')
                .exec()
        ).pipe(
            switchMap(device => {
                if (!device) {
                    return throwError(() => new NotFoundException(`Device with ID ${id} not found`));
                }
                const resDeviceDto: ResDeviceDto = {
                    location: device.locationId,
                    organization: device.organizationId,
                    status: device.status,
                };
                return of({ device: resDeviceDto });
            }),
            catchError(err => {
                if (err instanceof NotFoundException) {
                    return throwError(() => err);
                }
                this.logger.error(`Error finding device by ID ${id}: ${err.message}`);
                return throwError(() => new BadRequestException('Invalid device ID'));
            })
        );
    }
    
    async save(createDeviceDto: CreateDeviceDto): Promise<Device> {
        try {
            const createdDevice = new this.deviceModel(createDeviceDto);
            return await createdDevice.save();
        } catch (error) {
            this.logger.error(`Error creating device: ${error.message}`);
            throw new BadRequestException('Invalid data provided');
        }
    }

    async updateDevice(id: string, updateDeviceDto: UpdateDeviceDto): Promise<{ device: Device }> {
        try {
            const updatedDevice = await this.deviceModel.findByIdAndUpdate(id, updateDeviceDto, { new: true })
                .populate('LocationId')
                .populate('organizationId')
                .exec();
            if (!updatedDevice) {
                throw new NotFoundException(`Device with ID ${id} not found`);
            }
            return { device: updatedDevice };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error updating device with ID ${id}: ${error.message}`);
            throw new BadRequestException('Invalid data provided');
        }
    }

    delete(id: string): Observable<Device> {
        return from(
            this.deviceModel.findByIdAndDelete(id)
                .populate('LocationId')
                .populate('organizationId')
                .exec()
        ).pipe(
            switchMap(deletedDevice => {
                if (!deletedDevice) {
                    return throwError(() => new NotFoundException(`Device with ID ${id} not found`));
                }
                return of(deletedDevice);
            }),
            catchError(err => {
                if (err instanceof NotFoundException) {
                    return throwError(() => err);
                }
                this.logger.error(`Error deleting device with ID ${id}: ${err.message}`);
                return throwError(() => new BadRequestException('Invalid device ID'));
            })
        );
    }
}
