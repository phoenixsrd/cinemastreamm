# 🎥 Cinema Streamm

O **Cinema Streamm** é uma plataforma web em português do Brasil para descobrir filmes e séries. Reúne um catálogo com busca, filtros, favoritos e páginas de detalhes, usando a API do **TMDB (The Movie Database)** com dados em `pt-BR`.

## Funcionalidades

- Catálogo de filmes e de séries, cada um com paginação por botão **Carregar mais**.
- Busca global (filmes e séries) com debounce de 400 ms e filtro por tipo (Todos, Filmes, Séries).
- Filtros do catálogo: gênero, ano, idioma original e nota mínima (0, 5, 6, 7 ou 8).
- Ordenação por mais populares, melhor avaliados ou lançamento recente.
- Cards com pôster, título, sinopse, nota e data de lançamento.
- Favoritos salvos no `localStorage` do navegador (chave `cinema_streamm_favorites`), disponíveis nos cards e nas páginas de detalhes.
- Páginas de detalhes em `/movie/[id]` e `/tv/[id]`, com sinopse, duração, idioma, gêneros, trailer do YouTube, elenco principal (9 nomes) e até 10 recomendações.
- Skeleton de carregamento, mensagem de erro com botão **Tentar novamente** e tema escuro padrão via `ThemeContext`.

## Tecnologias

- **Next.js 15.5** (Pages Router), **React 18.2** e **TypeScript 5**.
- **Axios** para as requisições ao TMDB.
- **Tailwind CSS** carregado por CDN em `pages/_app.tsx`, não instalado como dependência.
- **TMDB API** como fonte de dados e de imagens (`image.tmdb.org`).
- Deploy na **Vercel** (`vercel.json`) e Dependabot em `.github/`.

## Estrutura

```text
pages/
  _app.tsx        # ThemeProvider e configuração do Tailwind via CDN
  index.tsx       # Home: busca, filtros, catálogo e favoritos
  movie/[id].tsx  # Detalhes de filme (renderização no servidor)
  tv/[id].tsx     # Detalhes de série (renderização no servidor)
context/          # ThemeContext
hooks/            # useInterval
styles/           # Estilos globais
next.config.js    # Domínio de imagens do TMDB liberado
vercel.json       # Comandos de build para a Vercel
```

A home consulta o TMDB direto do navegador. As páginas de detalhes buscam os dados no servidor com `getServerSideProps`, validando que o `id` é numérico.

## Requisitos

- Node.js 24 ou superior (campo `engines` do `package.json`).
- Uma chave de API do TMDB (v3), criada em https://www.themoviedb.org/settings/api.

## Configuração

Crie um arquivo `.env.local` na raiz:

```text
NEXT_PUBLIC_TMDB_API_KEY=sua_chave_do_tmdb
```

Como a variável tem o prefixo `NEXT_PUBLIC_`, a chave é incluída no código enviado ao navegador. Use uma chave dedicada a este projeto. Na Vercel, cadastre a mesma variável em **Settings > Environment Variables**.

## Desenvolvimento

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

## Observações

- O projeto não possui testes automatizados.
- Os favoritos ficam só no navegador em uso e não são sincronizados entre aparelhos.
- O conteúdo, as imagens e os metadados pertencem ao TMDB e dependem da disponibilidade da API. Este projeto é uma interface de descoberta, não um serviço de hospedagem ou distribuição de conteúdo.
