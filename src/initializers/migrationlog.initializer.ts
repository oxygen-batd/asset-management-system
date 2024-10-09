import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import {     
    DATABASE_CONNECTION,
    LOCATION_MODEL,
    MIGRATIONLOG_MODEL, } from '../database/constants';
import { MigrationLog } from '../database/schemas/migrationlog.schema';

@Injectable()
export class MigrationLogDataInitializerService implements OnModuleInit {
    constructor(
        @Inject(MIGRATIONLOG_MODEL) private migrationLogModel: Model<MigrationLog>,
    ) { }

    async onModuleInit(): Promise<void> {
        
    }
}
