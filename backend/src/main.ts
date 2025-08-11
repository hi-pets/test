import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import 'dotenv/config';

async function bootstrap() {
  dotenv.config(); // .env 환경변수 로드

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // 쿠키 파싱 (필요 시)

  // CORS 설정 (프론트엔드 React 주소 허용)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // 쿠키 전달 허용
  });

  await app.listen(3001);
  console.log(`NestJS server running on http://localhost:3001`);
}
bootstrap();
