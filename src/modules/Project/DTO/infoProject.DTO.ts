export class InfoProjectDTO {
  nameProject: string;

  status: number;

  leader: string;

  leaderName: string;

  leaderPhone: string;

  staff: Array<string>;

  task: Array<string>;

  timeStart?: Date;

  timeEnd?: Date;
}
