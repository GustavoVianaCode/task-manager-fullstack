import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O Controller é a camada mais externa da API —
// é ele que recebe as requisições HTTP e define as rotas. Eu uso decorators
// como @Get(), @Post() e @Patch() para mapear os métodos HTTP às funções.
// O Controller não tem lógica de negócio: ele só recebe os dados,
// chama o Service e retorna a resposta. Isso segue o princípio de
// responsabilidade única (Single Responsibility Principle).

@Controller('tasks') // Prefixo de rota: todas as rotas aqui começam com /tasks
export class TasksController {
  // 🗣️ COMO EXPLICAR NA ENTREVISTA: A injeção de dependência é feita pelo construtor.
  // O NestJS injeta automaticamente a instância do TasksService — eu não preciso
  // fazer 'new TasksService()'. Esse é o padrão de Inversão de Controle (IoC)
  // que o NestJS implementa com o seu container de DI.
  constructor(private readonly tasksService: TasksService) {}

  // GET /tasks?status=pending&search=reunião
  @Get()
  findAll(@Query() filterDto: FilterTaskDto) {
    // 🗣️ COMO EXPLICAR NA ENTREVISTA: O @Query() extrai os query params da URL
    // e os injeta já validados pelo DTO FilterTaskDto, graças ao ValidationPipe global.
    return this.tasksService.findAll(filterDto);
  }

  // POST /tasks
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna 201 em vez de 200
  create(@Body() createTaskDto: CreateTaskDto) {
    // 🗣️ COMO EXPLICAR NA ENTREVISTA: O @Body() extrai o corpo da requisição JSON
    // e o valida automaticamente contra o CreateTaskDto. Se falhar, o NestJS
    // retorna um 400 Bad Request com a lista de erros antes mesmo de chegar aqui.
    return this.tasksService.create(createTaskDto);
  }

  // PATCH /tasks/:id/complete
  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    // 🗣️ COMO EXPLICAR NA ENTREVISTA: Eu uso PATCH (e não PUT) porque estou
    // atualizando parcialmente o recurso — apenas o campo 'status'.
    // O PUT seria usado se eu fosse substituir o recurso inteiro.
    // O @Param('id') extrai o parâmetro de rota dinâmico ':id'.
    return this.tasksService.complete(id);
  }
}
