import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O Module agrupa tudo relacionado à feature de Tasks.
// O NestJS é baseado em módulos — cada funcionalidade tem seu próprio módulo
// com seus controllers, services e repositórios. Isso organiza o código e
// deixa a aplicação escalável: se eu precisar adicionar "Metas" (Goals),
// crio um GoalsModule separado sem mexer neste aqui.

@Module({
  imports: [
    // Registra a entidade Task no TypeORM dentro deste módulo
    // Isso cria o repositório que é injetado no TasksService
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
