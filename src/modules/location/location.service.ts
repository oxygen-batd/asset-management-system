// src/device/device.service.ts
import { BadRequestException, Injectable, NotFoundException, Logger, Scope, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LOCATION_MODEL } from '../../database/constants';

import { ResLocationDto } from './dto/dto/response.location.dto';
import { UpdateLocationDto } from './dto/dto/update-location.dto';
import { CreateLocationDto } from './dto/dto/create-location.dto';
import { Location } from 'src/database/schemas/location.schema';


@Injectable({ scope: Scope.DEFAULT })
export class LocationService {
    private readonly logger = new Logger(LocationService.name);

    constructor(
        @Inject(LOCATION_MODEL) private locationModel: Model<Location>,
    ) {
        this.logger.log('Location initialized...');
    }

    findById(id: string): Observable<{ location: ResLocationDto }> {
        return from(
            this.locationModel.findById(id).exec()
        ).pipe(
            switchMap(loc => {
                if (!loc) {
                    return throwError(() => new NotFoundException(`Location with ID ${id} not found`));
                }
                const resLocationDto: ResLocationDto = {
                    name: loc.name.toString(),
                };
                return of({ location: resLocationDto });
            }),
            catchError(err => {
                if (err instanceof NotFoundException) {
                    return throwError(() => err);
                }
                this.logger.error(`Error finding location by ID ${id}: ${err.message}`);
                return throwError(() => new BadRequestException('Invalid location ID'));
            })
        );
    }

    async save(createLocationDto: CreateLocationDto): Promise<Location> {
        try {
            const createdLocation = new this.locationModel(createLocationDto);
            return await createdLocation.save();
        } catch (error) {
            this.logger.error(`Error creating location: ${error.message}`);
            throw new BadRequestException('Invalid data provided');
        }
    }

    async updateLocation(id: string, updateLocationDto: UpdateLocationDto): Promise<{ location: Location }> {
        try {
            const updatedLocation = await this.locationModel.findByIdAndUpdate(id, updateLocationDto, { new: true }).exec();
            if (!updatedLocation) {
                throw new NotFoundException(`Location with ID ${id} not found`);
            }
            return { location: updatedLocation };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error updating location with ID ${id}: ${error.message}`);
            throw new BadRequestException('Invalid data provided');
        }
    }

    delete(id: string): Observable<Location> {
        return from(
            this.locationModel.findByIdAndDelete(id).exec()
        ).pipe(
            switchMap(deletedLocation => {
                if (!deletedLocation) {
                    return throwError(() => new NotFoundException(`Location with ID ${id} not found`));
                }
                return of(deletedLocation);
            }),
            catchError(err => {
                if (err instanceof NotFoundException) {
                    return throwError(() => err);
                }
                this.logger.error(`Error deleting location with ID ${id}: ${err.message}`);
                return throwError(() => new BadRequestException('Invalid location ID'));
            })
        );
    }

    async findAll(): Promise<Location[]> {
        try {
            return await this.locationModel.find().exec();
        } catch (error) {
            this.logger.error(`Error fetching locations: ${error.message}`);
            throw new BadRequestException('Failed to fetch locations');
        }
    }
}
