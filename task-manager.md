# Task Manager Plan

## Overview
App de gerenciamento de tarefas com foco em analytics (Opção B), design premium (Dark Mode) e usabilidade direta.

## Project Type
WEB

## Success Criteria
- O usuário consegue se cadastrar e fazer login simplificado.
- O dashboard exibe métricas corretas (tarefas atrasadas, pra hoje, total) e tendências visuais.
- CRUD completo de tarefas (título, descrição, prazo, prioridade, categoria com cor fixa, tags).
- O app é responsivo, rápido e não utiliza frameworks CSS como Tailwind (usaremos CSS Modules / Vanilla moderno).

## Tech Stack
- **Frontend**: React (Vite), React Router, Lucide React (ícones), Recharts (se necessário para os gráficos).
- **Backend**: Node.js, Express, cors, jsonwebtoken (para token simples).
- **Database**: SQLite3 (better-sqlite3 para velocidade/sincronia).

## File Structure
```text
/backend
  /src
    /controllers
    /db
      schema.sql
      index.js
    /routes
    index.js
/frontend
  /src
    /components
      /layout
      /ui
    /pages
      Dashboard.jsx
      Tasks.jsx
      Login.jsx
    /context
    /services
    index.css
    App.jsx
```

## Task Breakdown
- **Task 1: Setup Base** (Agent: `backend-specialist` + `frontend-specialist`)
  - INPUT: Tech stack commands.
  - OUTPUT: Diretórios `frontend` e `backend` inicializados com dependências.
  - VERIFY: Vite e Express rodam sem erros nas suas portas (ex: 5173, 3000).

- **Task 2: Database Schema & API Base** (Agent: `database-architect` / `backend-specialist`)
  - INPUT: Especificação das tabelas (users, tasks, categories, tags).
  - OUTPUT: Arquivo SQLite gerado, rotas `/auth` e `/tasks` criadas no Express.
  - VERIFY: Requisições cURL restornam os dados e testam o ciclo de autenticação.

- **Task 3: Dashboard Analytics APIs** (Agent: `backend-specialist`)
  - INPUT: Entidades Tasks populadas.
  - OUTPUT: Rota `/dashboard/stats` retornando totalizadores considerando IDs, datas e *status*.
  - VERIFY: Dados combinam com as tasks inseridas no banco.

- **Task 4: Layout & Integração** (Agent: `frontend-specialist`)
  - INPUT: Index.css com Design System "premium".
  - OUTPUT: Sistema de navegação lateral (Sidebar) e rotas (react-router-dom) protegidas.
  - VERIFY: Telas contêm Header e Sidebar funcionando ao clicar.

- **Task 5: UI do Dashboard e Tarefas** (Agent: `frontend-specialist`)
  - INPUT: Componentização total do app.
  - OUTPUT: Tela de métricas renderizando gráficos/números vibrantes. Tela de Tasks permitindo adicionar e marcar itens como feitos.
  - VERIFY: As mudanças no Formúlario refletem imediatamente na API e no Dashboard.

## Phase X: Verification
- [ ] Segurança: no exposed secrets e login limpo.
- [ ] UX/UI: checagem de contraste e responsividade (mobile vs desktop).
- [ ] Execução dos scripts: `checklist.py`.
- [ ] Build & Run.
