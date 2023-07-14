import { IsString, Length,  } from "class-validator";


export class TimeSheetDTO {
  project: string;

  @IsString()
  @Length(2, 50)
  task: string;

  note: string;

  workingtime: string;

  type: string;

  @IsString()
  @Length(2, 50)
  user: string;

  createdAt?: Date;

  updatedAt?: Date;
}
