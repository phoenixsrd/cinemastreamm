# 🎥 Cinema Streamm

## 📖 Sobre o Projeto

**CinemaStreamm** é uma plataforma web moderna e simples para descobrir **filmes** e **séries** populares.  
Totalmente em português (Brasil), o projeto usa a API oficial do **TMDB** (The Movie Database) para trazer dados em tempo real.

- Cards com pôster, título e sinopse completa  
- Layout 100% responsivo (mobile-first)  
- Modo escuro ativado por padrão  

## ✨ Funcionalidades

- ✅ **Filmes Populares** e **Séries Populares** carregados automaticamente  
- ✅ Cards interativos com imagem do TMDB  
- ✅ Design responsivo (2 a 5 colunas)  
- ✅ Tema escuro nativo com ThemeContext  
- ✅ Rotas preparadas para detalhes (`/movie/[id]` e `/tv/[id]`)  
- ✅ Requisições com Axios + tratamento de erros  
- ✅ Totalmente escrito em **TypeScript**

## 🛠 Tecnologias Utilizadas

- **Next.js 15** (Pages Router)  
- **React 18**  
- **TypeScript**  
- **Axios**  
- **Tailwind CSS**  
- **TMDB API** (idioma `pt-BR`)  
- Deploy na **Vercel**

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18 ou superior  
- Chave da API TMDB (gratuita → [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))

### Passo a passo

1. Clone o repositório
```bash
   git clone https://github.com/phoenixsrd/cinemastreamm.git
```
```bash
   cd cinemastreamm
```
2. Instale as dependências
```bash
npm install
```
3. Aplique nos envoirements variables do vercel com esta variável
```bash
NEXT_PUBLIC_TMDB_API_KEY=sua_chave_aqui
```
4. Pronto agora e so dar deploy no projeto
