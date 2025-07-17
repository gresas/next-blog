# Personal Blog

Este é um projeto de blog pessoal desenvolvido com [Next.js](https://nextjs.org), utilizando o App Router, autenticação, temas customizados com Material UI e integração com API para notícias, comentários e contato.

## Funcionalidades

- Cadastro e login de usuários
- Listagem e visualização de notícias
- Comentários em notícias
- Página de contato
- Layout responsivo com tema personalizado
- Atualização automática de token de autenticação

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Material UI](https://mui.com)
- [TypeScript](https://www.typescriptlang.org)
- API REST interna (rotas em `/app/api`)

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

- `app/` - Código principal do frontend e rotas de API
- `app/components/` - Componentes reutilizáveis (Navbar, Footer, NewsCard, etc)
- `app/context/` - Contextos globais (ex: autenticação)
- `app/api/` - Rotas de API para autenticação, notícias, comentários, contato
- `app/hooks/` - Hooks customizados
- `public/` - Arquivos estáticos
- `README.md` - Documentação do projeto

## Personalização

- As cores principais do tema são:
  - Azul: `#0057B8`
  - Laranja: `#FF5C00`
  - Cinza claro: `#F5F5F5`
- O layout pode ser ajustado em `app/layout.tsx`.

## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para sugerir melhorias ou corrigir bugs.

## Licença

Este projeto é open source sob a licença [MIT](LICENSE).
