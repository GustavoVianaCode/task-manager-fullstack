import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: DTO significa Data Transfer Object. É um objeto
// que define exatamente quais dados eu aceito nessa rota, com as validações.
// Eu uso a lib 'class-validator' com decorators como @IsString e @IsNotEmpty
// para validar automaticamente. O NestJS, com o ValidationPipe configurado no
// main.ts, intercepta a requisição e valida antes de chegar no Controller.
// Se a validação falhar, ele retorna um 400 automaticamente — sem eu precisar
// escrever um if para cada campo.

export class CreateTaskDto {
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título não pode ser vazio' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres' })
  title: string;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional() // Campo opcional — não vai falhar se não for enviado
  description?: string;
}
