import { create } from 'zustand';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: Eu usei o Zustand aqui em vez do useState
// para gerenciar estados de UI que precisam ser acessados por múltiplos
// componentes sem passar props (prop drilling). Por exemplo, o botão de
// "Nova Tarefa" está no cabeçalho, mas o modal está em outro componente.
// Com Zustand, qualquer componente pode chamar 'openModal()' diretamente.
// A store é simples: criada com a função 'create', ela define o estado
// e as ações que o modificam, tudo num só lugar.

type UIState = {
  // Estado do modal de criação de tarefas
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Estado dos filtros de busca/status
  statusFilter: 'all' | 'pending' | 'completed';
  setStatusFilter: (status: 'all' | 'pending' | 'completed') => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O 'create' do Zustand recebe uma função que
// retorna o estado inicial e as ações. O 'set' é a função que atualiza o estado
// de forma imutável — eu passo um objeto com o que quero mudar e o Zustand
// faz o merge automaticamente, sem precisar de '...state' (diferente do Redux).
export const useUIStore = create<UIState>((set) => ({
  // Estado inicial do modal
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  // Estado inicial dos filtros
  statusFilter: 'all',
  setStatusFilter: (status) => set({ statusFilter: status }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
