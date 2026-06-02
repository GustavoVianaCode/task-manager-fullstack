// 🗣️ COMO EXPLICAR NA ENTREVISTA: Esse arquivo centraliza todas as chamadas
// para a API. Em vez de escrever fetch() em cada componente, eu tenho
// uma função aqui para cada endpoint. Se a URL da API mudar, mudo em um
// só lugar. A BASE_URL vem de uma variável de ambiente do Next.js.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Tipo que representa uma Tarefa — espelha a entidade do backend
export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
};

// Tipo dos parâmetros de filtro para a listagem
export type TaskFilters = {
  status?: 'pending' | 'completed' | 'all';
  search?: string;
};

// Tipo do payload para criar uma tarefa
export type CreateTaskPayload = {
  title: string;
  description?: string;
};

// GET /tasks — Busca tarefas com filtros opcionais
export async function fetchTasks(filters: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }
  if (filters.search) {
    params.set('search', filters.search);
  }

  const url = `${BASE_URL}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Falha ao buscar tarefas');
  }

  return response.json();
}

// POST /tasks — Cria uma nova tarefa
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao criar tarefa');
  }

  return response.json();
}

// PATCH /tasks/:id/complete — Marca uma tarefa como concluída
export async function completeTask(id: string): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Falha ao completar tarefa');
  }

  return response.json();
}
