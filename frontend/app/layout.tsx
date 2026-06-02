import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

// 🗣️ COMO EXPLICAR NA ENTREVISTA: O layout.tsx é o arquivo raiz do Next.js App Router.
// Tudo que está aqui é compartilhado por todas as páginas. Eu coloco aqui
// os metadados da página (SEO) e o componente Providers, que precisa envolver
// toda a aplicação para o TanStack Query funcionar em qualquer componente filho.
// O App Router renderiza layouts e pages aninhados — é mais eficiente que o Pages Router.

export const metadata: Metadata = {
  title: 'Task Manager | Gerenciador de Tarefas',
  description:
    'Sistema de gerenciamento de tarefas construído com NestJS, Next.js, TanStack Query e Zustand.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
