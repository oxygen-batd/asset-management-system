import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, Connection, Types } from 'mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Organization } from './organization.schema';
import { Type } from 'class-transformer';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Device {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Location', required: true })
    @Type(() => Location)
    locationId: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization', required: true })
    @Type(() => Organization)
    organizationId: string;

    @Prop({ required: true })
    created_at: Date;

    @Prop({ required: true, enum: ['active', 'inactive'] })
    status: string;

    @Prop({ required: false })
    serial: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false })
    type: string;

    @Type(() => Location)
    locations: Location[];
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

export const createUserModel = (conn: Connection): Model<DeviceDocument> =>
    conn.model<DeviceDocument>('Device', DeviceSchema, 'devices');


DeviceSchema.virtual('locations', {
    ref: 'Location',
    localField: '_id',
    foreignField: 'locationId',
});

DeviceSchema.pre(['find', 'findOne'], function () {
    this.populate({
        path: 'organizationId',
        select: '_id name',
    });
});