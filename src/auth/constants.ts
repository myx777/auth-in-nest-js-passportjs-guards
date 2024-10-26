import { ConfigService } from "@nestjs/config";

export const getJwtConstants = (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
  });
  