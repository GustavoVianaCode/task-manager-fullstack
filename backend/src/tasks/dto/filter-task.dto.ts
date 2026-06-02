import { IsOptional, IsString, IsIn } from 'class-validator';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: Esse DTO é diferente do CreateTaskDto — ele é
// usado para validar os query params da rota GET /tasks. O @IsOptional() garante
// que o parâmetro pode ser omitido. O @IsIn() restringe o valor de 'status' apenas
// para 'pending' ou 'completed', impedindo qualquer outro valor inválido.
// Isso mostra que DTOs não servem só para POST — posso validar query strings também.

export class FilterTaskDto {
  @IsOptional()
  @IsString()
  search?: string; // Busca por texto no título

  @IsOptional()
  @IsIn(['pending', 'completed', 'all'], {
    message: "Status deve ser 'pending', 'completed' ou 'all'",
  })
  status?: 'pending' | 'completed' | 'all';
}
