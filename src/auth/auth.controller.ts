import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from 'src/dto/signin.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Аутентификация пользователя с помощью email и пароля.
   *
   * @param {SigninDto} signinDto - DTO объект, содержащий email и пароль пользователя.
   * @returns {string} JWT токен, если аутентификация успешна.
   * @throws {BadRequestException} Если учетные данные неверны.
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto);
  }

  /**
   * Получение профиля аутентифицированного пользователя.
   *
   * @param {Request} req - Объект запроса, содержащий информацию о пользователе, установленную AuthGuard.
   * @returns {Object} Информация о пользователе, извлеченная из токена.
   * @throws {UnauthorizedException} Если пользователь не авторизован.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  /**
   * Завершает сессию пользователя.
   *
   * Этот метод вызывает функцию `logout` в объекте запроса (`req`),
   * которая завершает сессию пользователя и удаляет его аутентификационные данные.
   *
   * @param {Request} req - Объект запроса, содержащий данные сессии пользователя.
   * @returns {Promise<any>} Результат завершения сессии пользователя.
   */
  async logout(@Request() req): Promise<any> {
    return req.logout();
  }
}
