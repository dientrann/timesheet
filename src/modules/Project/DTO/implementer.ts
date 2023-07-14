import { IsOptional, IsString, Length } from 'class-validator';

export class Implementer {
  @IsString()
  @Length(2, 50)
  leader: string;

  @IsOptional()
  @IsString({ each: true })
  @Length(2, 50, { each: true })
  staff?: Array<string>;
}
