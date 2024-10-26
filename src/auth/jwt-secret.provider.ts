import { ConfigService } from '@nestjs/config';

/**
 * Провайдер для получения секретного ключа JWT из конфигурации.
 *
 * @description
 * JwtSecretProvider использует `ConfigService` для получения значения переменной окружения `JWT_SECRET`.
 * Этот провайдер может быть внедрен в другие модули или сервисы, где необходим доступ к секрету JWT.
 * 
 * @returns {Object} Объект провайдера, который предоставляет ключ `JWT_SECRET`.
 * @property {string} provide - Имя провайдера, используемое для внедрения зависимостей.
 * @property {Function} useFactory - Функция, которая возвращает значение `JWT_SECRET`.
 * @property {Array<ConfigService>} inject - Массив зависимостей, которые будут внедрены в `useFactory`.
 */
export const JwtSecretProvider = {
  provide: 'JWT_SECRET',
  useFactory: (configService: ConfigService) => configService.get<string>('JWT_SECRET'),
  inject: [ConfigService],
};
