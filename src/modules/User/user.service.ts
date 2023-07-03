import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { UserDTO } from '../Auth/DTO/user.DTO';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async pageListUser(page: number) {
    const pageSize = await this.configService.get<number>('app.SIZEPAGE');
    const pageData = await this.UserModel.find({})
      .skip(page * pageSize - pageSize)
      .limit(pageSize);

    if (pageData.length == 0)
      throw new HttpException(
        'Exceeded the maximum number of pages',
        HttpStatus.BAD_REQUEST,
      );
    return pageData;
  }

  async createUserByAdmin(user: UserDTO): Promise<User> {
    const { username, password, fullName, email, phone, role } = user;
    const checkUsername = await this.UserModel.findOne({ username });
    if (checkUsername)
      throw new HttpException(
        'The username is already in use. Please select another username',
        HttpStatus.BAD_REQUEST,
      );
    const checkEmail = await this.UserModel.findOne({ email });
    if (checkEmail)
      throw new HttpException(
        'Email address already in use. Please provide a different email',
        HttpStatus.BAD_REQUEST,
      );
    const checkPhone = await this.UserModel.findOne({ phone });
    if (checkPhone)
      throw new HttpException(
        'Phone number already in use. Please provide a different phone number',
        HttpStatus.BAD_REQUEST,
      );
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('app.Salt'),
    );
    //Pass này là Password được mã hóa
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new this.UserModel({
      username: username,
      password: hashPassword,
      fullName: fullName,
      email: email,
      phone: phone,
      role: role,
    });
    return newUser.save();
  }

  async updateUser(id: string, user: UserDTO): Promise<User> {
    const { username, password, fullName, email, phone, role } = user;
    const checkUser = await this.UserModel.findById(id);
    if (!checkUser) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const newData: UserDTO = {
      username: username,
      password: password,
      fullName: fullName,
      email: email,
      phone: phone,
      role: role,
      updatedAt: now(),
    };
    const eidtUser = await this.UserModel.findByIdAndUpdate(id, newData);
    return eidtUser;
  }
}