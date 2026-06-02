'use client';

import { useUIStore } from '@/store/useUIStore';
import { useTasksQuery } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O TaskList é o componente principal da página.
// Ele lê os filtros do Zustand (statusFilter e searchQuery) e os usa como
// parâmetros para o hook useTasksQuery. Quando o usuário muda o filtro,
// o Zustand atualiza o estado, o componente re-renderiza com os novos valores
// e o TanStack Query refaz a requisição automaticamente porque a queryKey mudou.
// É um fluxo de dados muito limpo e rastreável.

export function TaskList() {
  // Lê os filtros do Zustand
  const statusFilter = useUIStore((state) => state.statusFilter);
  const searchQuery = useUIStore((state) => state.searchQuery);

  // Usa os filtros como parâmetro do query
  const { data: tasks, isLoading, isError, error } = useTasksQuery({
    status: statusFilter,
    search: searchQuery || undefined,
  });

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Skeleton loading: placeholder visual enquanto os dados carregam */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm font-medium text-red-600">
          ❌ Erro ao carregar tarefas
        </p>
        <p className="mt-1 text-xs text-red-400">
          {error instanceof Error ? error.message : 'Tente novamente'}
        </p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-sm font-medium text-slate-600">
          Nenhuma tarefa encontrada
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Crie uma nova tarefa clicando no botão acima.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
