import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthPayload, UserAuthentication } from './payload.interface';
import { AuthService } from 'src/modules/Auth/auth.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies.token;
          }
          return token;
        },
      ]),
      secretOrKey: configService.get<string>('app.KeyToken'),
    });
  }

  async validate(payload: AuthPayload): Promise<UserAuthentication> {
    const user = await this.authService.validateUser(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
