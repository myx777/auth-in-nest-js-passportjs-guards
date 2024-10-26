import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SigninDto } from 'src/dto/signin.dto';
import { SignupDto } from 'src/dto/signup.dto';
import { User } from 'src/models/user.schema';
import { ConfigService } from '@nestjs/config';
import { hashPassword, verifyPassword } from 'src/utils/hash.password';

@Injectable()
/**
 * Сервис аутентификации
 *
 */
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

    /**
   * Аутентификация пользователя
   * 
   * @param {SigninDto} signinDto - Данные для аутентификации пользователя
   * @throws {BadRequestException} Если учетные данные неверны
   * 
   */
  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const findedUser = await this.authModel.findOne({ email });

    if (!findedUser) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await verifyPassword(email, password);

     if (!isPasswordValid) {
         throw new BadRequestException('Wrong password');
     }

     return findedUser;
  }

  /**
   * Регистрация нового пользователя
   *
   * @param {SignupDto} signupDto - Данные для регистрации пользователя
   * @throws {BadRequestException} Если пользователь с таким email уже существует
   */
  async signup(signupDto: SignupDto) {
    const { email, password, firstName, lastName } = signupDto;

    const findedUser = await this.authModel.findOne({ email });

    if (findedUser) {
      throw new BadRequestException('User already exists');
    }

    const saltLength = email.length;
    const hashedPassword = await hashPassword(password, saltLength);

    const newUser = new this.authModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newUser.save();
  }
}
