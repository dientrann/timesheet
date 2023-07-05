import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  name: string;

  @Prop()
  describe: string;

  @Prop()
  complete: boolean;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
