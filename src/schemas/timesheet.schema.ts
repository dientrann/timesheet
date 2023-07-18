import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';

export type TimeSheetDocument = TimeSheet & Document;

@Schema()
export class TimeSheet {
  @Prop()
  project: string;

  @Prop()
  task: string;

  @Prop()
  note: string;

  @Prop()
  workingtime: string;

  @Prop()
  type: string;

  @Prop()
  user: string;

  @Prop()
  status: number;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const TimeSheetSchema = SchemaFactory.createForClass(TimeSheet);
