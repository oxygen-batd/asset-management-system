import { Connection } from 'mongoose';
import {
    DATABASE_CONNECTION,
    DEVICE_MODEL,
    LOCATION_MODEL,
    ORGANIZATION_MODEL
} from './constants';

import { DeviceSchema } from './schemas/device.schema';
import { LocationSchema } from './schemas/location.schema';
import { OrganizationSchema } from './schemas/organization.schema';


export const databaseModelsProviders = [
    {
        provide: DEVICE_MODEL,
        useFactory: (connection: Connection) => connection.model('Device', DeviceSchema),
        inject: [DATABASE_CONNECTION],
    },
    {
        provide: LOCATION_MODEL,
        useFactory: (connection: Connection) => connection.model('Location', LocationSchema),
        inject: [DATABASE_CONNECTION],
    },
    {
        provide: ORGANIZATION_MODEL,
        useFactory: (connection: Connection) => connection.model('Organization', OrganizationSchema),
        inject: [DATABASE_CONNECTION],
    }
];
