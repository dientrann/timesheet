import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
