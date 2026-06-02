import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O AppModule é o módulo raiz da aplicação — é
// ele que "liga tudo". Aqui eu configuro duas coisas importantes:
// 1. O ConfigModule lê o arquivo .env e disponibiliza as variáveis pelo sistema inteiro.
// 2. O TypeOrmModule conecta ao PostgreSQL usando essas variáveis. O 'synchronize: true'
//    faz o TypeORM criar/atualizar as tabelas automaticamente com base nas Entidades.
//    Em produção, isso seria false e eu usaria migrations para não perder dados.

@Module({
  imports: [
    // Carrega as variáveis de ambiente do arquivo .env
    ConfigModule.forRoot({
      isGlobal: true, // Disponível em todos os módulos sem re-importar
    }),

    // Configuração do banco de dados com TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'taskuser'),
        password: configService.get<string>('DB_PASSWORD', 'taskpassword'),
        database: configService.get<string>('DB_NAME', 'taskmanager'),
        entities: [Task],
        synchronize: true, // ⚠️ Apenas para desenvolvimento — cria tabelas automaticamente
        logging: false,
      }),
      inject: [ConfigService],
    }),

    // Importa o módulo de tarefas
    TasksModule,
  ],
})
export class AppModule {}
