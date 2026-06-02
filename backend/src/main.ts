import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: Aqui é o ponto de entrada da aplicação NestJS.
// O mais importante dessa função é o 'ValidationPipe' com 'whitelist: true'.
// Isso significa que, se o cliente mandar algum campo que não está no meu DTO,
// ele é automaticamente removido, o que é uma proteção contra dados inesperados.
// O 'enableCors' libera o frontend (que roda em outra porta) de fazer chamadas
// para a API — sem isso, o browser bloquearia as requisições por segurança.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para o frontend Next.js conseguir chamar a API
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  // Pipe global de validação: valida todos os DTOs automaticamente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Remove campos extras não declarados no DTO
      forbidNonWhitelisted: true, // Retorna erro se vier campo desconhecido
      transform: true,       // Transforma os dados para os tipos do DTO
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 API rodando em: http://localhost:${port}`);
}

bootstrap();
