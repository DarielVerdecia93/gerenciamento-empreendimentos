# Gerenciamento de Empreendimentos (Santa Catarina)

Sistema web desenvolvido em Next.js para cadastro, análise e gestão de empreendimentos.
O projeto atende ao contexto de organização de empreendedores com foco nos municípios de Santa Catarina,
permitindo operações de CRUD, autenticação básica, visualização analítica e experiência responsiva.

## Escopo implementado

Cada empreendimento cadastrado contém os campos obrigatórios:

- Nome do empreendimento
- Nome do(a) empreendedor(a) responsável
- Município de Santa Catarina
- Segmento de atuação: Tecnologia, Comércio, Indústria, Serviços, Agronegócio
- E-mail ou meio de contato
- Status: ativo/inativo

## Funcionalidades principais

- Autenticação básica com usuários em JSON e sessão por cookie
- Dashboard com menu por seções (Resumo e Empreendimentos)
- Indicadores e gráficos (status, segmentos e municípios)
- Cadastro por modal
- Edição por modal
- Exclusão com confirmação visual
- Busca textual por múltiplos campos
- Filtros por status, segmento e município
- Paginação no estilo DataTable
- Botão de limpeza de filtros
- Toasts de sucesso/erro nas operações
- Progress bar para estados de carregamento
- Interface responsiva (menu e listagem adaptados para mobile)

## Stack e arquitetura

- Framework: Next.js (App Router)
- UI: Tailwind CSS + componentes utilitários
- Visual analytics: Recharts
- Persistência local: arquivos JSON
- API: rotas internas em `/api`

Estrutura de persistência:

- Dados de empreendimentos: `data/empreendimentos.json`
- Usuários de login: `data/usuarios.json`

## Como executar

```bash
npm install
npm run dev
```

Aplicação: `http://localhost:3000`

## Acesso padrão

- Usuário: `admin`
- Senha: `admin123`

## Rotas de interface

- `/login`
- `/dashboard/resumo`
- `/dashboard/empreendimentos`

## API interna

- `GET /api/empreendimentos`
- `POST /api/empreendimentos`
- `PUT /api/empreendimentos/:id`
- `DELETE /api/empreendimentos/:id`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

## Qualidade de código e boas práticas aplicadas

- Separação de responsabilidades entre UI, rotas e camada de dados
- Validação de entrada no backend
- Reaproveitamento de componentes de interface
- Mensagens de erro e sucesso orientadas ao usuário
- Código legível, modular e com nomenclatura consistente
- Lint aplicado para manter padrão e reduzir regressões

## Critérios de avaliação (status atual)

1. Documentação (README): **atendido** (mais de 1200 caracteres)
2. Branches: **pendente** (é necessário inicializar Git e criar múltiplas branches)
3. Commits: **pendente** (é necessário histórico com commits distintos e relevantes)
4. Aderência ao escopo: **atendido** (funcionalidades obrigatórias implementadas)
5. Qualidade do código: **atendido** (organização, legibilidade e coerência com o README)

## Próximo passo para fechar 100% da rubrica

Para cumprir os critérios de versionamento e commits, inicialize o repositório e trabalhe com fluxo por branches,
registrando commits temáticos (ex.: auth, dashboard, filtros/paginação, responsividade, documentação).
