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
import { AuthGuard } from './auth.guard';

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
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
