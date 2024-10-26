import { Injectable } from '@nestjs/common';
import { SigninDto } from 'src/dto/signin.dto';
import { SignupDto } from 'src/dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
/**
 * Сервис аутентификации.
 *
 * Обеспечивает регистрацию, аутентификацию и генерацию JWT токена для пользователей.
 */
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Аутентификация пользователя на основе email и пароля.
   *
   * @param {SigninDto} signinDto - DTO объект, содержащий email и пароль пользователя.
   * @returns {string} Возвращает JWT токен, если аутентификация успешна.
   */
  async signIn(signinDto: SigninDto): Promise<string> {
    const findedUser = await this.usersService.findUser(signinDto)

    // Генерация и возврат JWT токена
    const payload = { sub: findedUser._id, email: findedUser.email };
    return this.jwtService.sign(payload);
  }

  /**
   * Регистрация нового пользователя и генерация JWT токена.
   *
   * @param {SignupDto} signupDto - DTO объект, содержащий данные нового пользователя (email, пароль, имя и фамилию).
   * @returns {string} Возвращает JWT токен для зарегистрированного пользователя.
   */
  async signUp(signupDto: SignupDto): Promise<string> {
    const newUser = await this.usersService.registrationUser(signupDto);
    // Генерация и возврат JWT токена
    return this.jwtService.sign({ sub: newUser._id, email: newUser.email });
  }
}
