import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type MigrationLogDocument = HydratedDocument<MigrationLog>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class MigrationLog {

    @Prop({ required: true, unique: true })
    asset_id: number;
  
    @Prop({ required: true })
    migrated_at: Date;

}

export const MigrationLogSchema = SchemaFactory.createForClass(MigrationLog);