# Clients App

## Sumário

1. [Demonstração](#demonstração)
2. [Questionamento](#questionamento-acerca-do-desenvolvimento-do-painel-administrativo)
3. [Estrutura Sugerida](#estrutura-sugerida-para-o-client-app)
4. [Descrição](#descrição)
5. [Funcionalidades](#funcionalidades)
6. [Pré-requisitos](#pré-requisitos)
7. [Usando a Aplicação](#usando-a-aplicação)
8. [Testes](#testes)
9. [Pontos de Melhoria](#pontos-de-melhoria)
   - [Escalabilidade Horizontal](#escalabilidade-horizontal)
   - [Migração para OAuth](#migração-para-oauth)

## Demonstração

Veja o sistema em funcionamento neste [vídeo demonstrativo](https://www.youtube.com/watch?v=RhPaOpDePy4).

## Questionamento acerca do Desenvolvimento do Painel Administrativo

### 1. Quanto tempo levaria?

Estima-se que o desenvolvimento de um painel administrativo para a aplicação levaria cerca de 50 horas, conforme detalhamento das tarefas a seguir. Esse prazo pode ser concluído em aproximadamente 7 dias úteis com 1 desenvolvedor ou em 4 dias úteis com uma equipe de 2 desenvolvedores, devido à divisão de tarefas.

- Configuração inicial: 5 horas.

  - Setup do backend (3 horas).
    - Configuração do Nest.js com TypeORM e PostgreSQL.
    - Conexão com o banco de dados.
    - Estruturação inicial de módulos, controllers e serviços.
  - Setup do frontend (React com Material-UI): 2 horas.

- Desenvolvimento backend (16 horas).

  - Criação de APIs para o CRUD de clientes: 8 horas.
  - Documentação das APIs com Swagger: 2 horas.
  - Implementação de testes unitários com Jest: 4 horas.
  - Adição de logs e monitoramento básico: 2 horas.

- Desenvolvimento frontend (17 horas).

  - Criação da tela de login e autenticação: 4 horas.
  - Tela de listagem de clientes: 6 horas.
  - Tela de cadastro/edição de clientes: 4 horas.
  - Tela de visualização de cliente: 2 horas.
  - Validação de formulários e ajustes de UX: 1 hora.

- Teste e Qualidade (4 horas):

  - Testes unitários no frontend (React Testing Libary ou Jest): 2 horas.
  - Análise de qualidade do código com SonarQube/ESLint: 1 hora.
  - Revisão manual e ajustes gerais: 1 hora.

- DevOps e Deploy (6 horas):

  - Configuração de Dockerfiles e docker-compose: 2 horas.
  - Configuração de pipelines CI/CD: 2 horas.
  - Deploy do painel (AWS S3/CloudFront ou outro): 2 horas.

- Extras (2 horas):

  - Documentação do projeto (README detalhado): 1 horas.
    - Instruções para rodar localmente, usar APIs e configurar o ambiente.
  - Gravação de vídeo demonstrativo: 1 horas.

### 2. Quantos desenvolvedores?

Recomenda-se uma equipe composta por um ou dois desenvolvedores, dependendo do prazo desejado para o projeto.

### 3. Qual a senioridade dos desenvolvedores?

- Opção com 1 desenvolvedor:

  - 1 Desenvolvedor Full-Stack (Pleno ou Sênior);

- Opção com 2 desenvolvedores:
  - 1 Desenvolvedor Backend (Pleno ou Sênior):
  - 1 Desenvolvedor Frontend (Pleno);

## Estrutura sugerida para o Client App

### Fluxo de Dados

1. O usuário realiza uma ação no aplicativo.
2. A requisição é enviada ao API Gateway (Kong) para autenticação e roteamento.
3. O backend processa a lógica e interage com:
   - PostgreSQL para dados estruturados.
   - AWS S3 para armazenamento de arquivos.
   - Redis (BullMQ) para filas ou caching.
4. Logs e métricas são enviados ao AWS CloudWatch.
5. A resposta é retornada ao frontend.

### 1. Mobile App (Frontend)

- **Tecnologia:** React Native + Expo
- **Função:**
  - Prover a interface do usuário para interação com o sistema.
  - Enviar requisições e dados ao backend através de APIs REST.
  - Receber e apresentar informações processadas do backend.

### 2. API Gateway

- **Tecnologia:** Kong
- **Infraestrutura:** Hospedado em AWS EC2 ou Containerizado (Docker)
- **Função:**
  - Centralizar e gerenciar requisições de entrada.
  - Prover funcionalidades como:
    - **Autenticação e Autorização:** Controle de acesso usando plugins de segurança (JWT, OAuth2).
    - **Rate Limiting:** Controle de número de requisições para proteger o backend.
    - **Roteamento:** Direcionamento de requisições para os serviços backend apropriados.
    - **Observabilidade:** Registro e monitoramento das requisições.

### 3. Backend

- **Tecnologia:** Nest.js + TypeORM
- **Função:**
  - Implementar a lógica de negócio e gerenciar as interações com bancos de dados e serviços externos.
  - Garantir consistência e validação de dados.
  - Expor APIs RESTful para o frontend.

### 4. Banco de Dados (Persistência de Dados)

- **Tecnologia:** PostgreSQL
- **Infraestrutura:** AWS RDS
- **Função:**
  - Armazenar dados estruturados e persistentes, como informações de clientes, registros financeiros, etc.
  - Prover suporte a consultas eficientes e consistentes.

### 5. Armazenamento de Arquivos

- **Tecnologia:** AWS S3
- **Função:**
  - Armazenar arquivos e objetos de forma segura e escalável.
  - Gerenciar documentos ou mídias enviados pelo sistema.

### 6. Filas de Processamento e Cache

- **Tecnologia:** Redis com BullMQ
- **Função:**
  - Implementar filas para processamento assíncrono de tarefas (e.g., envio de e-mails, cálculos pesados).
  - Utilizar cache para otimizar consultas frequentes e reduzir a carga no banco de dados.

### 7. Monitoramento e Logs

- **Tecnologia:** AWS CloudWatch
- **Função:**
  - Monitorar métricas de performance e logs do sistema.
  - Identificar problemas, como alta latência ou falhas, e enviar alertas proativos.

## Descrição

Este projeto permite gerenciar clientes. O sistema oferece funcionalidades para cadastro de clientes, visualização de uma lista de todos os clientes cadastrados, edição das informações de clientes, e exclusão de registros.

A aplicação utiliza o Kong como API Gateway e o backend foi desenvolvido como uma API RESTful utilizando Node.js com o framework NestJS, garantindo robustez e escalabilidade. O sistema está integrado a um banco de dados para armazenamento seguro das informações. A interface do usuário foi desenvolvida com React Native utilizando Expo, permitindo a execução do aplicativo em dispositivos móveis de forma moderna e responsiva.

## Funcionalidades

- Permite que o usuário insira seu nome para autenticação ou identificação básica.
- Exibe uma lista de todos os clientes cadastrados.
- Formulário para inserção ou atualização de informações do cliente.
- Opção para deletar e selecionar clientes.

## Pré-requisitos

- Node >=18.13.0
- Docker

## Usando a Aplicação

1. Clone o repositório:

```bash
git clone https://github.com/andre-fig/clients
cd clients
```

2. Execute os contêineres:

```bash
docker-compose build --no-cache
docker-compose up
```

4. Acesse a documentação da API no Swagger:

- http://localhost:8000/admin/docs

## Testes

Este projeto inclui testes unitários para os serviços de autenticação e CRUD de clientes.

```bash
yarn install
yarn test:cov
```

## Pontos de Melhoria

### Migração para OAuth

A autenticação atual é baseada em JWT com login/senha. Para aumentar a segurança e facilitar a integração com outros serviços, uma migração para OAuth2 ou OpenID Connect pode ser considerada, permitindo o uso de provedores de identidade como Google ou um servidor OAuth próprio.
