'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUIStore } from '@/store/useUIStore';
import { useCreateTaskMutation } from '@/hooks/useTasks';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O Zod é uma biblioteca de validação de schema
// baseada em TypeScript. Eu defino o formato esperado dos dados como um objeto
// e o Zod valida automaticamente. A vantagem sobre o class-validator do backend
// é que o Zod infere o tipo TypeScript automaticamente — então eu tenho
// validação E tipagem em um só lugar, com zero duplicação.

const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(255, 'O título deve ter no máximo 255 caracteres'),
  description: z.string().optional(),
});

// Inferindo o tipo TypeScript a partir do schema Zod
type TaskFormData = z.infer<typeof taskSchema>;

export function CreateTaskModal() {
  // Controle do modal via Zustand
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const closeModal = useUIStore((state) => state.closeModal);

  // Mutation do TanStack Query para criar tarefa
  const { mutate: create, isPending, isSuccess } = useCreateTaskMutation();

  // 🗣️ COMO EXPLICAR NA ENTREVISTA: O React Hook Form gerencia o estado do formulário
  // de forma eficiente — ele não re-renderiza o componente a cada digitação,
  // diferente do useState. O 'zodResolver' conecta o schema Zod ao React Hook Form,
  // então quando o usuário tenta enviar, o Zod valida e o RHF exibe os erros.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  // Fecha o modal e reseta o formulário após sucesso
  useEffect(() => {
    if (isSuccess) {
      reset();
      closeModal();
    }
  }, [isSuccess, reset, closeModal]);

  // Fecha o modal com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  const onSubmit = (data: TaskFormData) => {
    // 🗣️ COMO EXPLICAR NA ENTREVISTA: O 'handleSubmit' do React Hook Form só
    // chama a função 'onSubmit' se o formulário passar na validação do Zod.
    // Se houver erro, ele popula o objeto 'errors' automaticamente.
    create(data);
  };

  if (!isModalOpen) return null;

  return (
    // Backdrop do modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={closeModal}
    >
      {/* Corpo do modal — stopPropagation evita fechar ao clicar dentro */}
      <div
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Nova Tarefa</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Adicione uma nova tarefa à sua lista
            </p>
          </div>
          <button
            id="close-modal-btn"
            onClick={closeModal}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Título <span className="text-red-400">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              placeholder="Ex: Revisar documentação do projeto"
              {...register('title')}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all ${
                errors.title
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Campo Descrição */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Descrição{' '}
              <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="task-description-input"
              placeholder="Adicione mais detalhes sobre a tarefa..."
              rows={3}
              {...register('description')}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="submit-task-btn"
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? 'Criando...' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
