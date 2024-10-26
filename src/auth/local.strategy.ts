import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from 'src/dto/signin.dto';

@Injectable()
/**
 * Локальная стратегия аутентификации.
 *
 * Использует Passport для проверки учетных данных пользователя и его аутентификации.
 */
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Создает экземпляр локальной стратегии.
   * @param {AuthService} authService - Сервис для аутентификации пользователей.
   */
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Валидирует учетные данные пользователя.
   *
   * @param {SigninDto} signinDto - DTO объект с email и паролем пользователя.
   * @returns {Promise<any>} Объект пользователя, если аутентификация успешна.
   * @throws {UnauthorizedException} Если учетные данные неверны.
   */
  async validate(signinDto: SigninDto): Promise<any> {
    const user = await this.authService.signIn(signinDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}