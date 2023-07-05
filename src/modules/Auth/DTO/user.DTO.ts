import { IsString, Length, IsEmail, IsPhoneNumber } from 'class-validator';

export class UserDTO {
  @IsString()
  @Length(2, 50)
  username: string;

  @IsString()
  @Length(2, 50)
  password: string;

  @IsString()
  @Length(2, 50)
  fullName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  role?: number;

  createdAt?: Date;

  updatedAt?: Date;
}
