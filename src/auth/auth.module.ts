import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/models/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtSecretProvider } from './jwt.config';
import { UsersModule } from 'src/users/users.module';

/**
 * Модуль аутентификации.
 *
 * @description
 * AuthModule предоставляет функционал для аутентификации пользователей,
 * используя JWT для генерации токенов и MongoDB для хранения информации о пользователях.
 * Секретный ключ для JWT загружается из конфигурации и передается в AuthGuard и JwtModule.
 */
@Module({
  imports: [
    /**
     * Модуль конфигурации для работы с переменными окружения.
     */
    ConfigModule.forRoot({isGlobal: true, envFilePath: '.development.env'}),

    /**
     * Подключение коллекции пользователей к MongoDB.
     * @see MongooseModule.forFeature - подключает модель `User` к MongoDB для хранения данных о пользователях.
     */
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),

    /**
     * Настройка JWT-модуля с использованием асинхронной конфигурации.
     * @description
     * Секретный ключ `JWT_SECRET` загружается из провайдера конфигурации `JwtSecretProvider`,
     * чтобы обеспечить защиту токенов. Конфигурация `expiresIn` указывает время жизни токена.
     * @param {string} jwtSecret - Секретный ключ для шифрования JWT.
     * @returns {JwtModuleOptions} Настройки для конфигурации JWT.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: ['JWT_SECRET'],
      useFactory: (jwtSecret: string) => ({
        secret: jwtSecret,
        signOptions: { expiresIn: '60s' },
      }),
    }),
    /**
     * Модуль пользователей.
     */
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    /**
     * Сервис аутентификации, обрабатывающий логику регистрации и входа.
     * @see AuthService - основной сервис для управления пользователями.
     */
    AuthService,

    /**
     * Провайдер для получения секретного ключа JWT из конфигурации.
     * @see JwtSecretProvider - провайдер, возвращающий секрет для JWT.
     */
    JwtSecretProvider,
  ],
  exports: [AuthService, JwtSecretProvider],
})
export class AuthModule {}


