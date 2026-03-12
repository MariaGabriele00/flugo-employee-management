# Flugo - Employee Management

Este projeto consiste em um sistema para gestão de colaboradores com sincronização em tempo real utilizando Firebase Firestore.

## Requisitos Prévios

Antes de começar, você precisará ter instalado em sua máquina:

- Node.js (versão 16 ou superior)
- Um gerenciador de pacotes (npm ou yarn)

## Guia de Instalação e Execução Local

### 1. Clonar o Repositório

Abra o seu terminal e execute o comando abaixo para baixar o projeto:

```bash
git clone https://github.com/MariaGabriele00/flugo-employee-management.git
cd flugo-employee-management

```

### 2. Instalar Dependências

Instale todos os pacotes necessários listados no arquivo package.json:

```bash
npm install

```

### 3. Configurar Variáveis de Ambiente

O projeto depende do Firebase para funcionar. Crie um arquivo chamado **.env** na raiz do projeto e preencha com as suas credenciais obtidas no Console do Firebase:

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

```

### 4. Executar o Projeto

Para iniciar o servidor de desenvolvimento e visualizar o projeto no navegador:

```bash
npm start

```

O sistema abrirá automaticamente no endereço **http://localhost:3000**.

## Tecnologias Utilizadas

- React 18 e TypeScript
- Material UI v6 (Componentização e UI)
- Firebase Firestore (Banco de dados em tempo real)
- Zod (Validação de dados)
- React Router DOM (Navegação SPA)

## Teste já

**https://flugo-employee-management.vercel.app/**.
