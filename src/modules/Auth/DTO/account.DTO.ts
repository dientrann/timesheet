import { IsString, Length } from 'class-validator';

export class AccountDTO {
  @IsString()
  @Length(2, 50)
  username: string;

  @IsString()
  @Length(2, 50)
  password: string;
}
