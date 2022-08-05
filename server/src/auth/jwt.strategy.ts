import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({
    iat,
    exp,
    email,
  }: {
    iat: number;
    exp: number;
    email: string;
  }): Promise<Partial<Prisma.UserCreateInput>> {
    const isExpired = exp - iat <= 0;
    const user = await this.authService.validateUserByEmail(email);

    if (!user || isExpired) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
