import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { ImplementerDTO } from 'src/modules/Project/DTO/implementer.DTO';

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
  implementer: ImplementerDTO;

  @Prop()
  task: string;

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
