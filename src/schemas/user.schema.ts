import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  role: number;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
