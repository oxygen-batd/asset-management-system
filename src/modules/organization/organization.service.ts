// src/device/device.service.ts
import { BadRequestException, Injectable, NotFoundException, Logger, Scope, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { ORGANIZATION_MODEL } from '../../database/constants';

import { Organization } from 'src/database/schemas/organization.schema';
import { ResOrganizationDto } from './dto/dto/response.organization.dto';
import { CreateOrganizationDto } from './dto/dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/dto/update-organization.dto';


@Injectable({ scope: Scope.DEFAULT })
export class OrganizationService {
    private readonly logger = new Logger(OrganizationService.name);

    constructor(
        @Inject(ORGANIZATION_MODEL) private organizationModel: Model<Organization>,
    ) {
        this.logger.log('organizationModel initialized...');
    }

    findById(id: string): Observable<{ organization: ResOrganizationDto }> {
        return from(
            this.organizationModel.findById(id).exec()
        ).pipe(
            switchMap(org => {
                if (!org) {
                    return throwError(() => new NotFoundException(`Organization with ID ${id} not found`));
                }
                const resOrganizationDto: ResOrganizationDto = {
                    name: org.name,
                };
                return of({ organization: resOrganizationDto });
            }),
            catchError(err => {
                if (err instanceof NotFoundException) {
                    return throwError(() => err);
                }
                this.logger.error(`Error finding organization by ID ${id}: ${err.message}`);
                return throwError(() => new BadRequestException('Invalid organization ID'));
            })
        );
    }

    /**
     * Tạo và lưu một tổ chức mới
     * @param createOrganizationDto Dữ liệu để tạo tổ chức
     */
    async save(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        try {
            const createdOrganization = new this.organizationModel(createOrganizationDto);
            return await createdOrganization.save();
        } catch (error) {
            this.logger.error(`Error creating organization: ${error.message}`);
            throw new BadRequestException('Invalid data provided');
        }
    }

    async updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<{ organization: Organization }> {
        try {
            const updatedOrganization = await this.organizationModel.findByIdAndUpdate(id, updateOrganizationDto, { new: true }).exec();
            if (!updatedOrganization) {
                throw new NotFoundException(`Organization with ID ${id} not found`);
            }
            return { organization: updatedOrganization };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error updating organization with ID ${id}: ${error.message}`);
            throw new BadRequestException('Invalid data provided');
        }
    }

    delete(id: string): Observable<Organization> {
        return from(
            this.organizationModel.findByIdAndDelete(id).exec()
        ).pipe(
            switchMap(deletedOrg => {
                if (!deletedOrg) {
                    return throwError(() => new NotFoundException(`Organization with ID ${id} not found`));
                }
                return of(deletedOrg);
            }),
            catchError(err => {
                if (err instanceof NotFoundException) {
                    return throwError(() => err);
                }
                this.logger.error(`Error deleting organization with ID ${id}: ${err.message}`);
                return throwError(() => new BadRequestException('Invalid organization ID'));
            })
        );
    }

    async findAll(): Promise<Organization[]> {
        try {
            return await this.organizationModel.find()
            .select('-updatedAt -__v -_id')
            .exec();
        } catch (error) {
            this.logger.error(`Error fetching organizations: ${error.message}`);
            throw new BadRequestException('Failed to fetch organizations');
        }
    }
}
