import { Exclude } from 'class-transformer';
import {
  IsString,
  Length,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class UserDTO {
  @IsString()
  @Length(2, 50)
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  password?: string;

  @IsString()
  @Length(2, 50)
  fullName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('VN')
  phone: string;

  isAdmin?: boolean;

  isEmployeeManager?: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}
