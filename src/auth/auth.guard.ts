import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Защита маршрутов с использованием JWT аутентификации.
 *
 * Этот класс расширяет стандартный `AuthGuard` из `@nestjs/passport` и
 * обеспечивает дополнительную логику обработки запросов.
 *
 * @extends AuthGuard
 */
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Проверяет, может ли текущий контекст активировать защиту.
   *
   * @param {ExecutionContext} context - Контекст выполнения запроса.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} Возвращает true, если доступ разрешен, иначе false.
   */
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  /**
   * Обрабатывает результаты аутентификации.
   *
   * @param {any} err - Ошибка, если такая имеется.
   * @param {any} user - Объект пользователя, если аутентификация успешна.
   * @param {any} info - Дополнительная информация о процессе аутентификации.
   * @param {ExecutionContext} context - Контекст выполнения запроса.
   * @param {any} [status] - Статус ответа, если установлен.
   * @returns {TUser} Объект пользователя, если аутентификация успешна.
   * @throws {UnauthorizedException} Выбрасывается, если аутентификация не удалась.
   */
  public handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
