# Usar apenas a imagem base do Node.js
FROM node:20 AS development
WORKDIR /app

# Copiar o yarn.lock da raiz do monorepo e o package.json específico do serviço
COPY ./client-api/yarn.lock ./
COPY ./client-api/package.json ./

# Instalar dependências de desenvolvimento
RUN yarn install --frozen-lockfile

# Copiar o restante do código do serviço para o contêiner
COPY ./client-api ./

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["sh", "-c", "yarn migration:run && yarn start:dev"]

