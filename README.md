# Modelo tela customizada

## 🚀 Sobre
Projeto base para criação de telas personalizadas no Senior X.

## 📝 Requisitos
- Node v21.7.3
- Npm 10.5.0

## 🛠️ Criando telas
O projeto foi estruturado no modelo standalone, ou seja, para cada tela, será criado diretamente um componente em: _src/app/pages_.

A configuração de rota é feita no arquivo: _app.routes.ts_

Para cada componente, será necessário importar os módulos que serão utilizado em tela. Se o projeto demandar muitas telas com recursos compartilhados, pode-se criar um arquivo para centralizar a exportação dos módulos mais utilizados semelhante ao modelo antigo.

Por padrão, o projeto já vem com a tela inicial "Home".
