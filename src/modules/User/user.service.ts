import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { UserDTO } from './DTO/user.DTO';
import * as bcrypt from 'bcrypt';
import { UserAuthentication } from '../Auth/Verification/payload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
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
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new this.UserModel({
      username: username,
      password: hashPassword,
      fullName: fullName,
      email: email,
      phone: phone,
      isAdmin: false,
      isEmployeeManager: false,
    });
    return newUser.save();
  }

  async pageListUser(page: number, itemPage: number) {
    const pageSize =
      itemPage == 0
        ? this.configService.get<number>('app.PageSize')
        : itemPage || this.configService.get<number>('app.PageSize');

    const totalItem = await this.UserModel.countDocuments();
    const pageData = await this.UserModel.find({})
      .select('-password')
      .skip(page * pageSize - pageSize)
      .limit(pageSize);

    const infoPage = {
      pageData: pageData,
      totalItem: totalItem,
      maxPage: Math.ceil(totalItem / pageSize),
    };
    return infoPage;
  }

  async createUserByAdmin(user: UserDTO): Promise<User> {
    const {
      username,
      password,
      fullName,
      email,
      phone,
      isAdmin,
      isEmployeeManager,
    } = user;
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
      isAdmin: isAdmin || false,
      isEmployeeManager: isEmployeeManager || false,
    });
    return newUser.save();
  }

  async updateUser(id: string, user: UserDTO): Promise<User> {
    const { username, fullName, email, phone, isAdmin, isEmployeeManager } =
      user;
    const checkUser = await this.UserModel.findById(id);
    if (!checkUser) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const newData: UserDTO = {
      username: username,
      fullName: fullName,
      email: email,
      phone: phone,
      isAdmin: isAdmin,
      isEmployeeManager: isEmployeeManager,
      updatedAt: now(),
    };
    const eidtUser = await this.UserModel.findByIdAndUpdate(id, newData);
    return eidtUser;
  }

  async checkUser(name: string): Promise<boolean> {
    const check = await this.UserModel.findOne({ username: name });
    if (!check) return false;
    return true;
  }

  async checkUserbyId(id: string): Promise<UserAuthentication> {
    const check = await this.UserModel.findById(id);
    if (!check) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const { username, fullName, email, phone, isAdmin, isEmployeeManager } =
      check;
    const newUser: UserAuthentication = {
      username,
      fullName,
      email,
      phone,
      isAdmin,
      isEmployeeManager,
    };
    return newUser;
  }

  async dataUserbyName(name: string): Promise<User> {
    const user = await this.UserModel.findOne({ username: name });
    return user;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.UserModel.findOne({ username });
  }
}
