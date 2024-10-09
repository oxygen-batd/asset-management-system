import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type MigrationLogDocument = HydratedDocument<MigrationLog>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class MigrationLog {

    @Prop({ required: true, unique: true })
    version: number;
    
    // 1. class MigrationLog DB
    // 2. use: nest-commander
    // 3. create Migration Service
    // 4. create function: run/down
    // 5. run cmd: npm run start:dev migrate

    // note: You can implement a CI/CD workflow to run migrations based on version tags.
}

export const MigrationLogSchema = SchemaFactory.createForClass(MigrationLog);