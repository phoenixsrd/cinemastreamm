# 🎥 Cinema Streamm

O **Cinema Streamm** é uma plataforma web em português do Brasil para descobrir filmes e séries populares com uma experiência visual simples, responsiva e focada em capas, títulos e sinopses.

## Proposta

Em vez de procurar títulos em várias páginas, o usuário encontra uma vitrine organizada com conteúdos populares de filmes e séries. Os dados são obtidos da API do **TMDB (The Movie Database)** e apresentados em `pt-BR`.

## Funcionalidades

- Listagem automática de filmes populares.
- Listagem automática de séries populares.
- Cards com pôster, título e sinopse.
- Layout responsivo, pensado primeiro para telas menores.
- Tema escuro como experiência padrão.
- `ThemeContext` para centralizar o estado do tema.
- Requisições HTTP com Axios e tratamento de erros.
- Rotas preparadas para páginas de detalhes de filmes e séries (`/movie/[id]` e `/tv/[id]`).

## Tecnologias

- **Next.js 15.5** com Pages Router.
- **React 18.2**.
- **TypeScript 5**.
- **Axios** para consumo da API.
- **Tailwind CSS** e estilos do projeto para a interface.
- **TMDB API** como fonte de dados.

## Organização

```text
context/       # Contextos compartilhados, incluindo o tema
hooks/         # Hooks reutilizáveis da aplicação
pages/         # Rotas e páginas do Next.js
styles/        # Estilos globais e visuais
next.config.js # Configuração do Next.js
package.json   # Scripts e dependências
```

O fluxo principal é: as páginas e componentes solicitam dados ao TMDB através do Axios, exibem os resultados em cards e usam o contexto de tema para manter a aparência consistente. As rotas dinâmicas permitem evoluir a listagem para uma experiência completa de detalhes.

## Instalação e desenvolvimento

```bash
git clone https://github.com/phoenixsrd/cinemastreamm.git
cd cinemastreamm
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

O projeto também está preparado para deploy na Vercel. Para consumir o TMDB em produção, configure as credenciais exigidas pela implementação atual da API e nunca publique chaves privadas no código-fonte.

## Observações

O conteúdo, as imagens e os metadados exibidos pertencem ao TMDB e estão sujeitos à disponibilidade da API. Este projeto é uma interface de descoberta, não um serviço de hospedagem ou distribuição de conteúdo.
