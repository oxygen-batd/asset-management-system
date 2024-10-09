import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import { Device } from 'src/database/schemas/device.schema';
import { Location } from 'src/database/schemas/location.schema';
import { Organization } from 'src/database/schemas/organization.schema';
import { ORGANIZATION_MODEL, LOCATION_MODEL, DEVICE_MODEL } from '../../database/constants';
import { ClientSession } from 'mongoose';

@Injectable()
export class ScheduleDayService {
    private readonly logger = new Logger(ScheduleDayService.name);

    constructor(
        @Inject(ORGANIZATION_MODEL) private organizationModel: Model<Organization>,
        @Inject(DEVICE_MODEL) private deviceModel: Model<Device>,
        @Inject(LOCATION_MODEL) private locationModel: Model<Location>,
    ) {}

    @Cron('0 0 * * *')
    async synchronizeDevices() {
        const session = await this.deviceModel.db.startSession();
        session.startTransaction();

        try {
            this.logger.log('Fetching assets from BR Company...');
            const response = await axios.get('https://669ce22d15704bb0e304842d.mockapi.io/assets');
            const assets = response.data;

            const organization = await this.organizationModel.findOne().session(session).exec();
            if (!organization) {
                throw new Error('No organization found. Please ensure at least one organization exists.');
            }

            for (const asset of assets) {
                const createdDate = new Date(asset.created_at * 1000);
                if (asset.status === 'actived' && createdDate < new Date()) {
                    const locationExists = await this.checkLocationExists(asset.location_id, session);
                    if (locationExists) {
                        await this.deviceModel.updateOne(
                            { _id: asset.id },
                            {
                                $set: {
                                    type: asset.type,
                                    serial: asset.serial,
                                    status: asset.status,
                                    description: asset.description,
                                    created_at: createdDate,
                                    updated_at: new Date(asset.updated_at * 1000),
                                    locationId: asset.location_id,
                                    organizationId: organization._id, // default
                                },
                            },
                            { upsert: true, session }
                        );
                        this.logger.log(`Synchronized asset: ${asset.id}`);
                    }
                }
            }

            await session.commitTransaction();
            this.logger.log('Assets synchronization completed.');
        } catch (error) {
            await session.abortTransaction();
            this.logger.error('Error fetching assets:', error.message);
        } finally {
            session.endSession();
        }
    }

    private async checkLocationExists(locationId: string, session: ClientSession): Promise<boolean> {
        const location = await this.locationModel.findById(locationId).session(session).exec();
        return !!location;
    }
}
