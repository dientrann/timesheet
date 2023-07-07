import { Implementer } from './implementer';

export class ProjectDTO {
  name: string;

  describe: string;

  status?: number;

  implementer?: Implementer;

  task?: Array<string>;

  timeStart?: Date;

  timeEnd?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
