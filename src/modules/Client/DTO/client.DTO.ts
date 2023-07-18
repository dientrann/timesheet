import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class ClientDTO {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  @Length(10, 225)
  address: string;

  updatedAt?: Date;
}
