'use client';

import { Task } from '@/lib/api';
import { useCompleteTaskMutation } from '@/hooks/useTasks';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O TaskCard é um componente de apresentação —
// ele recebe os dados de uma tarefa via props e exibe na tela. Ele também
// tem o botão de "Completar" que chama a mutation do TanStack Query.
// Separar componentes assim segue o princípio de componentes pequenos e focados.

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const { mutate: complete, isPending } = useCompleteTaskMutation();

  const isCompleted = task.status === 'completed';

  // Formata a data de criação de forma legível
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(task.createdAt));

  return (
    <div
      className={`group relative rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-slate-200 bg-white hover:border-sky-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Conteúdo da tarefa */}
        <div className="flex-1 min-w-0">
          {/* Badge de status */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium mb-2 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {isCompleted ? 'Concluída' : 'Pendente'}
          </span>

          {/* Título */}
          <h3
            className={`text-base font-semibold leading-tight ${
              isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
            }`}
          >
            {task.title}
          </h3>

          {/* Descrição */}
          {task.description && (
            <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Data */}
          <p className="mt-3 text-xs text-slate-400">{formattedDate}</p>
        </div>

        {/* Botão de completar (só aparece se tarefa está pendente) */}
        {!isCompleted && (
          <button
            id={`complete-task-${task.id}`}
            onClick={() => complete(task.id)}
            disabled={isPending}
            className="flex-shrink-0 rounded-xl bg-sky-50 px-3 py-2 text-xs font-medium text-sky-600 ring-1 ring-sky-200 transition-all hover:bg-sky-600 hover:text-white hover:ring-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? '...' : '✓ Concluir'}
          </button>
        )}
      </div>
    </div>
  );
}
