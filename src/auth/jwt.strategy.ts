import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
/**
 * JWT стратегия для аутентификации.
 *
 * @description
 * Этот класс реализует стратегию JWT, используя `passport-jwt`. Он извлекает токен из
 * заголовка авторизации и проверяет его с использованием секретного ключа, хранящегося в конфигурации.
 *
 * @property {ConfigService} configService - Сервис для получения конфигурационных значений, таких как `JWT_SECRET`.
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Создает экземпляр JWT стратегии.
   *
   * @param {ConfigService} configService - Сервис для доступа к конфигурации приложения.
   */
  constructor(
    @Inject('JWT_SECRET') jwtSecret: string,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Валидация полезной нагрузки токена.
   *
   * Этот метод проверяет полезную нагрузку JWT токена, извлекая информацию о пользователе.
   * Если аутентификация не удаётся, выбрасывается исключение `UnauthorizedException`.
   *
   * @param {any} payload - Полезная нагрузка JWT токена, содержащая информацию о пользователе.
   * @returns {Promise<{ userId: string; username: string }>} Объект с информацией о пользователе (userId и username) после успешной валидации.
   * @throws {UnauthorizedException} Выбрасывается, если аутентификация не удалась.
   */
  async validate(payload: any) {
    const user = await this.authService.signIn(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, username: payload.username };
  }
}
