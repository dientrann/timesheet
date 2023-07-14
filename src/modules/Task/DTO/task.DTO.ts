import { Transform } from 'class-transformer';
import {
  IsString,
  Length,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsNumber,
  IsIn,
  IsPositive,
} from 'class-validator';

export class TaskDTO {
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
  complete?: number;

  updatedAt?: Date;
}

export class FilterQuery {
  @IsNumber()
  @IsIn([0, 1, 2], { message: 'Invalid value for "complete" query parameter' })
  complete: number;

  @IsNumber()
  @IsPositive({ message: 'Invalid value for "time" query parameter' })
  time: number;
}
