import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SigninDto } from 'src/dto/signin.dto';
import { SignupDto } from 'src/dto/signup.dto';
import { User } from 'src/models/user.schema';
import { hashPassword, verifyPassword } from 'src/utils/hash.password';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>,
  ) {}
  /**
   * Поиск пользователя на основе email
   * @param signinDto - DTO объект, содержащий данные логина и пароля.
   * @returns найденного полльзователя
   * @throws {BadRequestException} Если учетные данные неверны (пользователь не найден или пароль неверный).
   */
  async findUser(signinDto: SigninDto) {
    const { email, password } = signinDto;
    // Поиск пользователя в базе данных
    const findedUser = await this.authModel.findOne({ email });
    if (!findedUser) {
      throw new BadRequestException('User not found');
    }
    const validatePassword = await verifyPassword(
      password,
      findedUser.password,
    );

    if (!validatePassword) {
      throw new BadRequestException('Wrong password');
    }
    return findedUser;
  }
  /**
   * Регистрация нового пользователя и
   * @param {SignupDto} signupDto - DTO объект, содержащий данные нового пользователя (email, пароль, имя и фамилию).
   * @throws {BadRequestException} Если пользователь с таким email уже существует.
   * @returns зарегистрированного пользователя
   */
  async registrationUser(signupDto: SignupDto) {
    const { email, password, firstName, lastName } = signupDto;

    // Проверка существования пользователя с таким email
    const findedUser = await this.authModel.findOne({ email });
    if (findedUser) {
      throw new BadRequestException('User already exists');
    }

    // Хеширование пароля пользователя
    const saltLength =
      email.length > 32 ? 32 : email.length < 16 ? 16 : email.length;
    const hashedPassword = await hashPassword(password, saltLength);

    // Создание нового пользователя
    const newUser = new this.authModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Сохранение пользовател в базе данных
    await newUser.save();

    return newUser;
  }
}
