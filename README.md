# Gerenciamento de Empreendimentos (Santa Catarina)

Aplicação web desenvolvida em Next.js para apoiar o cadastro, organização e acompanhamento de empreendimentos em municípios de Santa Catarina. A proposta do sistema é centralizar informações de empreendedores em uma interface única, com visão operacional (cadastro e manutenção) e visão analítica (resumo com indicadores e gráficos), permitindo acompanhamento rápido do cenário local.

## Proposta da solução

O sistema foi estruturado como um painel administrativo com autenticação e navegação por módulos. A experiência foi pensada para uso diário, com ações rápidas, feedback visual para operações e layout responsivo para desktop e mobile.

O fluxo principal é:

1. Acessar o sistema por login.
2. Visualizar o módulo de resumo com indicadores e gráficos.
3. Gerenciar empreendimentos no módulo de listagem.
4. Cadastrar, editar, ativar/inativar e excluir registros.
5. Localizar rapidamente informações com busca, filtros e paginação.

## Dados gerenciados

Cada empreendimento contém os campos:

- Nome do empreendimento
- Nome do(a) empreendedor(a) responsável
- Município de Santa Catarina
- Segmento de atuação (Tecnologia, Comércio, Indústria, Serviços, Agronegócio)
- E-mail ou meio de contato
- Status (ativo ou inativo)

## Funcionalidades implementadas

- Autenticação básica com sessão por cookie
- Dashboard com menu por seções (Resumo e Empreendimentos)
- Resumo com indicadores e gráficos por status, segmento e município
- Cadastro por modal
- Edição por modal
- Exclusão com confirmação visual
- Alteração rápida de status (ativo/inativo)
- Busca textual no listado
- Filtros por status, segmento e município
- Paginação do listado
- Botão para limpar filtros
- Toasts de sucesso/erro
- Barras de progresso em operações de carregamento
- Interface responsiva

## Armazenamento em JSON

Os dados são persistidos localmente em arquivos JSON, sem banco de dados externo.

- Empreendimentos: `data/empreendimentos.json`
- Usuários de autenticação: `data/usuarios.json`

Esse formato facilita execução local, inspeção direta dos registros e uso em contexto acadêmico/protótipo.

## Tecnologias utilizadas

- Next.js (App Router)
- React
- Tailwind CSS
- MagicUI (`magicui-next`) com configuração global via `MagicUIProvider`
- Recharts

## Frontend e base visual

O frontend é construído com base em Next.js + Tailwind e integra MagicUI por meio do `MagicUIProvider` no layout global da aplicação. Essa integração define tema, tokens visuais e estrutura base de UI para o painel.

Este projeto contou com assistência de IA no processo de construção e otimização do frontend, apoiando decisões de estrutura visual, responsividade e refinamento da experiência de uso.

Sobre os componentes de tela:

- Parte da interface utiliza componentes customizados com Tailwind para manter aderência ao fluxo de gestão.
- A base de estilo e contexto visual é fornecida pela integração com MagicUI.
- Os gráficos analíticos são renderizados com Recharts, mantendo consistência com o tema da aplicação.

## Como executar o projeto

```bash
npm install
npm run dev
```

Acesse em: `http://localhost:3000`

## Ambiente de teste (hosteado)

Para fins de validação, o projeto está disponível em:

- `https://gerenciamento-empreendimentos.vercel.app`

Credenciais para teste:

- Usuário: `admin`
- Senha: `admin123`

## Credenciais padrão

- Usuário: `admin`
- Senha: `admin123`

## Rotas principais

- `/login`
- `/dashboard/resumo`
- `/dashboard/empreendimentos`

## Endpoints da API interna

- `GET /api/empreendimentos`
- `POST /api/empreendimentos`
- `PUT /api/empreendimentos/:id`
- `DELETE /api/empreendimentos/:id`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
