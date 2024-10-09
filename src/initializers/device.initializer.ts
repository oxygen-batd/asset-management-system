import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import {     
    DEVICE_MODEL,
    LOCATION_MODEL,
    ORGANIZATION_MODEL, } from '../database/constants';
import { Device } from '../database/schemas/device.schema';
import { Organization } from 'src/database/schemas/organization.schema';

@Injectable()
export class AssetDataInitializerService implements OnModuleInit {
    constructor(
        @Inject(DEVICE_MODEL) private deviceModel: Model<Device>,
        @Inject(LOCATION_MODEL) private locationModel: Model<Location>,
        @Inject(ORGANIZATION_MODEL) private organizationModel: Model<Organization>,
    ) { }

    async onModuleInit(): Promise<void> {
        console.log('(MessageDataInitializerService) is initialized...');

        const organizations = [
            { name: 'PNS' },
            { name: 'PNJ' },
        ];

        const locations = [
            { name: 'Location 1' },
            { name: 'Location 2' },
            { name: 'Location 3' },
        ];

        const devices = [
            {
                locationId: null,
                organizationId: null,
                created_at: new Date(),
                status: 'active',
                serial: '0000001',
                description: 'Device 1 description',
                type: 'CIA1-10',
            },
            {
                locationId: null,
                organizationId: null,
                created_at: new Date(),
                status: 'inactive',
                serial: '0000002',
                description: 'Device 2 description',
                type: 'CIA1-11',
            },
            {
                locationId: null,
                organizationId: null,
                created_at: new Date(),
                status: 'active',
                serial: '0000003',
                description: 'Device 3 description',
                type: 'CIA1-12',
            },
        ];

        try {
            await this.deviceModel.deleteMany({});
            await this.locationModel.deleteMany({});
            await this.organizationModel.deleteMany({});

            const createdOrganizations = await this.organizationModel.insertMany(organizations);

            const createdLocations = await this.locationModel.insertMany(locations);

            for (let i = 0; i < devices.length; i++) {
                devices[i].organizationId = createdOrganizations[i % createdOrganizations.length]._id;
                devices[i].locationId = createdLocations[i % createdLocations.length]._id;
            }

            // Create Devices
            const createdDevices = await this.deviceModel.insertMany(devices);
        } catch (error) {
        }
    }
}
