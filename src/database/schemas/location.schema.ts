import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, Connection } from 'mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Location {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: string;

    @Prop({ required: true })
    name: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);


export const createLocationModel = (conn: Connection): Model<LocationDocument> =>
    conn.model<LocationDocument>('Location', LocationSchema, 'locations');
