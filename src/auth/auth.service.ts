import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SigninDto } from 'src/dto/signin.dto';
import { SignupDto } from 'src/dto/signup.dto';
import { User } from 'src/models/user.schema';
import { hashPassword, verifyPassword } from 'src/utils/hash.password';
import { JwtService } from '@nestjs/jwt';

@Injectable()
/**
 * Сервис аутентификации.
 *
 * Обеспечивает регистрацию, аутентификацию и генерацию JWT токена для пользователей.
 */
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Аутентификация пользователя на основе email и пароля.
   *
   * @param {SigninDto} signinDto - DTO объект, содержащий email и пароль пользователя.
   * @returns {string} Возвращает JWT токен, если аутентификация успешна.
   * @throws {BadRequestException} Если учетные данные неверны (пользователь не найден или пароль неверный).
   */
  async signIn(signinDto: SigninDto): Promise<string> {
    const { email, password } = signinDto;

    // Поиск пользователя в базе данных
    const findedUser = await this.authModel.findOne({ email });
    if (!findedUser) {
      throw new BadRequestException('User not found');
    }

    // Проверка пароля пользователя
    const isPasswordValid = await verifyPassword(password, findedUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Wrong password');
    }

    // Генерация и возврат JWT токена
    const payload = { sub: findedUser._id, email: findedUser.email };
    return this.jwtService.sign(payload);
  }

  /**
   * Регистрация нового пользователя и генерация JWT токена.
   *
   * @param {SignupDto} signupDto - DTO объект, содержащий данные нового пользователя (email, пароль, имя и фамилию).
   * @returns {string} Возвращает JWT токен для зарегистрированного пользователя.
   * @throws {BadRequestException} Если пользователь с таким email уже существует.
   */
  async signUp(signupDto: SignupDto): Promise<string> {
    const { email, password, firstName, lastName } = signupDto;

    // Проверка существования пользователя с таким email
    const findedUser = await this.authModel.findOne({ email });
    if (findedUser) {
      throw new BadRequestException('User already exists');
    }

    // Хеширование пароля пользователя
    const saltLength = email.length > 32 ? 32 : email.length <  16 ? 16 : email.length;
    const hashedPassword = await hashPassword(password, saltLength);

    // Создание нового пользователя
    const newUser = new this.authModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Сохранение пользователя в базе данных
    await newUser.save();

    // Генерация и возврат JWT токена
    return this.jwtService.sign({ sub: newUser._id, email: newUser.email });
  }
}
