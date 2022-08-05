import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { createHmac } from 'crypto';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUserByEmail(email: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password.');
    }

    return user;
  }

  async encryptPassword(password): Promise<string> {
    return createHmac('sha256', password).digest('hex');
  }

  async generateToken(user: User): Promise<any> {
    this.logger.log('Token generated');

    return {
      expiresIn: this.configService.get('JWT_EXPIRATION'),
      accessToken: this.jwtService.sign({ ...user }),
    };
  }
}
