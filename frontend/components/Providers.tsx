'use client';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O Providers é um componente wrapper que
// configura todos os provedores de contexto da aplicação em um só lugar.
// O QueryClientProvider fornece o cliente do TanStack Query para todos os
// componentes filhos. Eu preciso desse wrapper porque o Next.js App Router
// renderiza componentes no servidor por padrão, mas o TanStack Query e o
// Zustand precisam rodar no cliente (daí o 'use client').

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ children }: { children: React.ReactNode }) {
  // 🗣️ COMO EXPLICAR NA ENTREVISTA: Eu uso useState para criar o QueryClient
  // dentro do componente para garantir que cada requisição no servidor crie
  // um novo cliente (evitando compartilhamento de estado entre usuários).
  // Essa é uma recomendação oficial da documentação do TanStack Query.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Se a requisição falhar, o TanStack Query vai tentar novamente 1 vez
            retry: 1,
            // Não refaz a requisição quando a janela recebe foco (em dev é mais confortável)
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools visível só em desenvolvimento para inspecionar o cache */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
