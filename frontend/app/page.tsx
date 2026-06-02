'use client';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: Essa é a página principal da aplicação.
// No Next.js App Router, cada arquivo page.tsx dentro de uma pasta representa
// uma rota. O 'use client' no topo indica que esse componente roda no browser —
// é necessário porque ele usa hooks (Zustand, TanStack Query) que precisam
// do ambiente do browser. Componentes sem 'use client' rodam no servidor
// por padrão, o que é mais performático para conteúdo estático.

import { useUIStore } from '@/store/useUIStore';
import { FilterBar } from '@/components/FilterBar';
import { TaskList } from '@/components/TaskList';
import { CreateTaskModal } from '@/components/CreateTaskModal';

export default function HomePage() {
  // 🗣️ COMO EXPLICAR NA ENTREVISTA: Aqui eu pego apenas a função 'openModal'
  // do Zustand. O componente não vai re-renderizar quando 'isModalOpen' mudar,
  // porque eu não estou selecionando esse valor — só a função. Isso é uma
  // otimização de performance sutil mas importante do Zustand.
  const openModal = useUIStore((state) => state.openModal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo / Título */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white font-bold text-lg shadow-sm">
                ✓
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 leading-tight">
                  Task Manager
                </h1>
                <p className="text-xs text-slate-400">Gerenciador de Tarefas</p>
              </div>
            </div>

            {/* Botão Nova Tarefa */}
            <button
              id="open-modal-btn"
              onClick={openModal}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 active:scale-95"
            >
              <span className="text-base leading-none">+</span>
              Nova Tarefa
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Seção de filtros */}
        <section className="mb-6">
          <FilterBar />
        </section>

        {/* Lista de tarefas */}
        <section>
          <TaskList />
        </section>
      </main>

      {/* Modal de criação de tarefa (renderizado aqui mas controlado pelo Zustand) */}
      <CreateTaskModal />
    </div>
  );
}
