import { ImplementerDTO } from './implementer.DTO';

export class ProjectDTO {
  name: string;

  describe: string;

  status?: number;

  implementer?: ImplementerDTO;

  task?: string;

  timeStart?: Date;

  timeEnd?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
