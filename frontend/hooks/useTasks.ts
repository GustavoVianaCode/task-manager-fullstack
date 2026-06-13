import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, completeTask, TaskFilters, CreateTaskPayload } from '@/lib/api';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: Eu coloco os hooks do TanStack Query aqui
// para separar a lógica de data fetching dos componentes. Assim, o componente
// fica limpo — ele só chama o hook e recebe os dados. Os hooks encapsulam
// toda a lógica de cache, loading, erro e refetch automático.

// Hook para buscar a lista de tarefas com filtros
export function useTasksQuery(filters: TaskFilters) {
  // 🗣️ COMO EXPLICAR NA ENTREVISTA: O useQuery gerencia o ciclo de vida da
  // requisição. A 'queryKey' é como o TanStack Query identifica e cacheia
  // os dados — se os filtros mudarem, ele refaz a requisição automaticamente.
  // O 'staleTime' define por quanto tempo os dados são considerados "frescos"
  // antes de uma refetch em background. Isso evita requisições desnecessárias.
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
    staleTime: 1000 * 30, // Dados são frescos por 30 segundos
  });
}

// Hook para criar uma nova tarefa
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  // 🗣️ COMO EXPLICAR NA ENTREVISTA: O useMutation é para operações que modificam
  // dados (POST, PUT, DELETE). O 'onSuccess' é executado quando a requisição
  // tem sucesso. Eu uso o 'queryClient.invalidateQueries' para invalidar o cache
  // da lista de tarefas — isso força o TanStack Query a refazer a busca e
  // mostrar a nova tarefa na lista automaticamente. É um padrão muito elegante.
  // 
  // O 'onError' é executado quando a requisição falha, garantindo que o usuário
  // receba feedback imediato e que o estado de loading seja resetado.
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      // Invalida o cache da listagem para refetch automático
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      // 🗣️ COMO EXPLICAR NA ENTREVISTA: O 'onError' é disparado quando a mutação falha.
      // TanStack Query automaticamente reseta 'isPending' para false, destravando o botão.
      // Exibimos um alerta simples para o usuário saber que algo deu errado.
      // Em uma aplicação real, usaríamos um Toast/Snackbar em vez de alert().
      const message = error instanceof Error ? error.message : 'Erro ao conectar com o servidor';
      alert(`❌ ${message}`);
    },
  });
}

// Hook para marcar uma tarefa como concluída
export function useCompleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: () => {
      // Após completar, atualiza a lista
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
