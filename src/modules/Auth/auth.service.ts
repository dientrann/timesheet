import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserDTO } from './DTO/user.DTO';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AccountDTO } from './DTO/account.DTO';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(user: UserDTO): Promise<User> {
    const { username, password, fullName, email, phone } = user;
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
      role: 0,
    });
    return newUser.save();
  }

  async login(user: AccountDTO): Promise<string> {
    const { username, password } = user;
    const findUser = await this.UserModel.findOne({ username });

    if (!findUser)
      throw new HttpException(
        'User not found in the database',
        HttpStatus.NOT_FOUND,
      );
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword)
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    const dataUser = await this.UserModel.findOne({ username });
    const token = await this.jwtService.sign({
      username: username,
      password: password,
      role: dataUser.role,
    });
    return token;
  }
}
