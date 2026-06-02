'use client';

import { useUIStore } from '@/store/useUIStore';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O FilterBar é onde o usuário controla os filtros.
// Quando ele digita no campo de busca ou clica nos botões de status,
// eu atualizo o Zustand. O TaskList está "ouvindo" esses valores no Zustand
// e o TanStack Query refaz a busca automaticamente. Não há comunicação
// direta entre FilterBar e TaskList — o Zustand é o mediador.

export function FilterBar() {
  const statusFilter = useUIStore((state) => state.statusFilter);
  const setStatusFilter = useUIStore((state) => state.setStatusFilter);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  const filters: { label: string; value: 'all' | 'pending' | 'completed' }[] = [
    { label: '📋 Todas', value: 'all' },
    { label: '⏳ Pendentes', value: 'pending' },
    { label: '✅ Concluídas', value: 'completed' },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Campo de busca por texto */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          🔍
        </span>
        <input
          id="search-input"
          type="text"
          placeholder="Buscar tarefa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Botões de filtro de status */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            id={`filter-${filter.value}`}
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 ${
              statusFilter === filter.value
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-sky-300 hover:text-sky-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
