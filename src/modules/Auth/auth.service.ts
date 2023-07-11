import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AccountDTO } from '../User/DTO/account.DTO';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../User/user.service';
import { UserAuthentication } from './Verification/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

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
    const token = await this.jwtService.sign({
      username: username,
    });
    return token;
  }

  async validateUser(username: string): Promise<UserAuthentication> {
    const user = await this.userService.findOne(username);
    const { fullName, email, phone, isAdmin } = user;
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    const result: UserAuthentication = {
      username: username,
      fullName: fullName,
      email: email,
      phone: phone,
      isAdmin: isAdmin,
    };
    return result;
  }
}
