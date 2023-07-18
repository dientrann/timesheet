import {
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Implementer } from './implementer';

export class ProjectDTO {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(10, 225)
  describe: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  status?: number;

  @IsPhoneNumber('VN')
  clientPhone?: string;

  implementer?: Implementer;

  @IsOptional()
  @IsString({ each: true })
  @Length(2, 50, { each: true })
  task?: Array<string>;

  timeStart?: Date;

  timeEnd?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
