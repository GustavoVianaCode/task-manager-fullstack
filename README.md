# Task Manager — Full Stack

Sistema de gerenciamento de tarefas construído com uma stack moderna para demonstração técnica.

**Stack:** NestJS · TypeORM · PostgreSQL · Next.js (App Router) · Tailwind CSS · TanStack Query · Zustand · React Hook Form · Zod

---

## Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### 1. Suba o Banco de Dados (PostgreSQL via Docker)

Na raiz do projeto, execute:

```bash
docker-compose up -d
```

Isso vai subir o container `task_manager_db` com o PostgreSQL na porta `5432`.

Para verificar se está rodando:

```bash
docker ps
```

---

### 2. Inicie o Backend (NestJS)

```bash
cd backend

# Instale as dependências
npm install

# Inicie o servidor em modo watch (auto-reload)
npm run start:dev
```

A API estará disponível em: **http://localhost:3001**

O TypeORM vai criar a tabela `tasks` automaticamente ao iniciar.

---

### 3. Inicie o Frontend (Next.js)

Em um novo terminal:

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tasks` | Lista todas as tarefas |
| GET | `/tasks?status=pending` | Filtra por status |
| GET | `/tasks?search=texto` | Busca por título |
| POST | `/tasks` | Cria nova tarefa |
| PATCH | `/tasks/:id/complete` | Marca como concluída |

### Exemplo de criação de tarefa (POST /tasks)

```json
{
  "title": "Revisar documentação",
  "description": "Verificar se o README está atualizado"
}
```

---

## Estrutura do Projeto

```
task-manager-fullstack/
├── backend/                    # API NestJS
│   └── src/
│       ├── tasks/
│       │   ├── dto/            # Validação de entrada (class-validator)
│       │   ├── entities/       # Entidade TypeORM (mapa para o banco)
│       │   ├── tasks.controller.ts
│       │   ├── tasks.service.ts
│       │   └── tasks.module.ts
│       ├── app.module.ts       # Módulo raiz (TypeORM + Config)
│       └── main.ts             # Entry point (ValidationPipe + CORS)
├── frontend/                   # App Next.js
│   ├── app/                    # App Router (layout + page)
│   ├── components/             # Componentes React
│   ├── hooks/                  # TanStack Query hooks
│   ├── lib/                    # Funções de API (fetch)
│   └── store/                  # Zustand store (estado de UI)
└── docker-compose.yml
```

---

## Decisões Técnicas

- **Zustand** para estado de UI (modal aberto/fechado, filtros) — evita prop drilling sem a complexidade do Redux.
- **TanStack Query** para busca e mutação de dados — gerencia cache, loading e refetch automaticamente.
- **React Hook Form + Zod** para o formulário — validação eficiente sem re-renders desnecessários.
- **class-validator no NestJS** para validar DTOs — o ValidationPipe global retorna 400 automaticamente.
- **Docker Compose** para o PostgreSQL — garante paridade entre ambientes de desenvolvimento.
