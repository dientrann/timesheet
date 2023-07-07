import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { Implementer } from 'src/modules/Project/DTO/implementer';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop()
  name: string;

  @Prop()
  describe: string;

  @Prop()
  status: number;

  @Prop()
  client: string;

  @Prop()
  implementer: Implementer;

  @Prop()
  task: Array<string>;

  @Prop()
  timeStart: Date;

  @Prop()
  timeEnd: Date;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
