import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import {     
    DATABASE_CONNECTION,
    LOCATION_MODEL,
    MIGRATIONLOG_MODEL, } from '../database/constants';
import { Location } from '../database/schemas/location.schema';

@Injectable()
export class LocationDataInitializerService implements OnModuleInit {
    constructor(
        @Inject(LOCATION_MODEL) private locationModel: Model<Location>,
    ) { }

    async onModuleInit(): Promise<void> {
        
    }
}
