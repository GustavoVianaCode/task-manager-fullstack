import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O Service é onde coloco toda a lógica de negócio.
// Separar Controller e Service é uma boa prática porque o Controller só cuida
// de HTTP (receber a requisição, retornar a resposta) e o Service cuida do
// "o que fazer". Se eu precisasse trocar o banco de dados ou adicionar cache,
// eu mudaria apenas o Service, sem tocar no Controller.

@Injectable()
export class TasksService {
  constructor(
    // 🗣️ COMO EXPLICAR NA ENTREVISTA: O @InjectRepository injeta o repositório do
    // TypeORM para a entidade Task. O repositório é um objeto que já tem os métodos
    // prontos como find(), findOne(), save() e delete(). É o padrão Repository Pattern.
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  // Lista todas as tarefas com filtro opcional de status e busca por texto
  async findAll(filterDto: FilterTaskDto): Promise<Task[]> {
    // 🗣️ COMO EXPLICAR NA ENTREVISTA: Aqui eu monto o objeto de filtro dinamicamente.
    // O ILike é uma função do TypeORM para busca case-insensitive no PostgreSQL.
    // Assim, buscar "REUNIÃO" vai encontrar "reunião", "Reunião", etc.
    // Eu só adiciono o filtro de status se ele não for 'all' ou undefined.

    const where: any = {};

    if (filterDto.status && filterDto.status !== 'all') {
      where.status = filterDto.status;
    }

    if (filterDto.search) {
      where.title = ILike(`%${filterDto.search}%`);
    }

    return this.tasksRepository.find({
      where,
      order: { createdAt: 'DESC' }, // Mais recentes primeiro
    });
  }

  // Cria uma nova tarefa a partir do DTO validado
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // 🗣️ COMO EXPLICAR NA ENTREVISTA: O .create() do TypeORM cria a instância
    // da entidade em memória. O .save() persiste no banco. Separo os dois passos
    // para ter mais clareza. O status padrão 'pending' vem da entidade (default no banco).
    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  // Marca uma tarefa como concluída pelo ID
  async complete(id: string): Promise<Task> {
    // 🗣️ COMO EXPLICAR NA ENTREVISTA: O findOne() busca uma tarefa pelo ID.
    // Se não encontrar, lanço um NotFoundException — o NestJS automaticamente
    // transforma isso em uma resposta HTTP 404 com uma mensagem clara.
    // Essa é a forma idiomática de tratar "recurso não encontrado" no NestJS.
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID "${id}" não encontrada.`);
    }

    task.status = 'completed';
    return this.tasksRepository.save(task);
  }
}
