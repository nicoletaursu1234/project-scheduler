import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import sizeOf from 'image-size';
import { User, Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ERROR_MESSAGES,
  PRISMA_ERROR_CODES,
  SUCCESS_MESSAGES,
} from 'src/shared/consts';
import { scaleImage } from 'src/shared/utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          dateOfBirth: new Date(data.dateOfBirth),
        },
      });

      return await this.authService.generateToken(user);
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async signUp(data: Prisma.UserCreateInput): Promise<User> {
    const isAllData = Object.values(data).every(Boolean);

    if (!isAllData)
      throw new BadRequestException(ERROR_MESSAGES.ProvideAllRequiredData);

    const { email } = data;

    try {
      const user = await this.getUserByEmail(email);

      if (user || user?.email === email) {
        throw new ConflictException('User already exists');
      }
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    try {
      const encryptedPassword = await this.authService.encryptPassword(
        data.password,
      );

      return await this.createUser({
        ...data,
        password: encryptedPassword,
        dateOfBirth: new Date(data.dateOfBirth),
      });
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }
  }

  async logIn(userCredentials: Prisma.UserCreateInput): Promise<any> {
    const { email, password } = userCredentials;

    if (!password || !email)
      throw new BadRequestException(ERROR_MESSAGES.ProvideAllRequiredData);

    let user;
    try {
      user = await this.getUserByEmail(email);

      if (!user) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        });
      }
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    try {
      const isPasswordCorrect =
        (await this.authService.encryptPassword(password)) === user.password;

      if (isPasswordCorrect) {
        const { accessToken, expiresIn } = await this.authService.generateToken(
          user,
        );
        return { accessToken, expiresIn };
      } else {
        throw new BadRequestException('Wrong password. Please try again');
      }
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async updateUser(userData: Prisma.UserUpdateInput, currUser) {
    let newPassword: string;

    if (userData.password) {
      newPassword = await this.authService.encryptPassword(userData.password);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: currUser.id },
        data: {
          ...userData,
          password: newPassword,
        },
      });

      return { message: SUCCESS_MESSAGES.SuccessfullyUpdated, user };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          [
            PRISMA_ERROR_CODES.UniqueConstraintFailed,
            PRISMA_ERROR_CODES.UniqueConstraintOnFieldFailed,
          ].includes(e.code)
        ) {
          throw new ConflictException('Email already exists');
        }
      }

      this.logger.debug(e);

      throw e;
    }
  }

  async updateAvatar(currUser, avatar: Express.Multer.File) {
    if (!avatar)
      throw new BadRequestException(ERROR_MESSAGES.ProvideAllRequiredData);

    const newAvatar = await this.processAvatar(avatar, currUser);

    try {
      await this.prisma.user.update({
        where: { id: currUser.id },
        data: {
          avatar: newAvatar,
        },
      });

      return {
        message: SUCCESS_MESSAGES.SuccessfullyUpdated,
        avatar: newAvatar,
      };
    } catch (e) {
      this.logger.debug(e);

      throw e;
    }
  }

  async processAvatar(file, user) {
    const imageTypes = ['jpg', 'jpeg', 'png'];
    const { mimetype, size, buffer } = file;

    const { height, width } = sizeOf(buffer);
    const [, format] = mimetype.split('/');
    const errors = [];

    if (!imageTypes.includes(format)) {
      errors.push('Image format should be PNG or JPG');
    }

    if (size > 1e6) {
      errors.push('Image size is too big');
    }

    if (width > 2000 || height > 2000) {
      errors.push(
        'Image dimensions are too big. Should be less than 2000x2000px',
      );
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    try {
      const hash = createHmac('sha256', user.email).digest('hex');
      const imagePath = await scaleImage(buffer, `${hash}.jpeg`);

      return imagePath;
    } catch (e) {
      this.logger.debug(e);

      throw e;
    }
  }
}
