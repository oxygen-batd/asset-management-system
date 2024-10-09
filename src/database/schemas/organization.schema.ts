import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, Connection } from 'mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Organization {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: string;

  @Prop({ required: true })
  name: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);


export const createOrganizationModel = (conn: Connection): Model<OrganizationDocument> =>
  conn.model<OrganizationDocument>('Organization', OrganizationSchema, 'organizations');