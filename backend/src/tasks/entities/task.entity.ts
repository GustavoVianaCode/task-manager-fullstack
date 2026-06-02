import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: Essa é a Entidade Task — ela é o "mapa" entre
// o mundo do TypeScript e a tabela do banco de dados. Com o TypeORM, eu uso
// decorators como @Entity, @Column e @PrimaryGeneratedColumn para descrever
// como a tabela deve ser. O TypeORM lê esses decorators e cria a tabela
// automaticamente no PostgreSQL. É o conceito de ORM: Object-Relational Mapping.

@Entity('tasks') // O nome da tabela no banco será 'tasks'
export class Task {
  // 🗣️ COMO EXPLICAR NA ENTREVISTA: Eu uso UUID em vez de um ID numérico incremental
  // porque UUID é mais seguro — não é possível adivinhar o próximo ID,
  // e escala melhor em sistemas distribuídos.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // 🗣️ COMO EXPLICAR NA ENTREVISTA: O status é uma string com valor padrão 'pending'.
  // Optei por uma abordagem simples com string em vez de enum do banco para
  // facilitar a demonstração. Em produção, eu usaria um tipo enum nativo do Postgres.
  @Column({ type: 'varchar', default: 'pending' })
  status: 'pending' | 'completed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
