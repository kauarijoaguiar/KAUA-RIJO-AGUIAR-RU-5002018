# Projeto Raízes do Nordeste - Back-end
Sistema de gerenciamento multicanal para rede de lanchonetes.

## 🚀 Tecnologias
- Node.js e Express
- SQLite e Sequelize (ORM)
- Bcrypt.js (Segurança/LGPD)

## 🛠️ Como rodar o projeto
1. Clone o repositório.
2. No terminal, execute: `npm install`
3. Inicie o servidor: `npm run dev`
4. O banco SQLite será criado automaticamente.

## 📌 Endpoints Principais
- `POST /users/register`: Cadastro de usuários.
- `POST /users/login`: Autenticação (JWT).
- `POST /orders/create`: Criação de pedido com **Simulação de Pagamento Mock**.
- `GET /orders/all`: Listagem de pedidos (Cozinha/Adm).

## 🛡️ LGPD e Segurança
- Senhas criptografadas com Hash (Bcrypt).
- Controle de acesso por perfis (ADMIN, COZINHA, CLIENTE).
