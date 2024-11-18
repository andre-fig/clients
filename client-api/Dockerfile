# Usar apenas a imagem base do Node.js
FROM node:20 AS development
WORKDIR /app

# Copiar apenas os arquivos necessários para instalar dependências
COPY ./client-api/package.json ./client-api/yarn.lock ./

# Forçar a instalação limpa para evitar problemas de dependências
RUN yarn install --check-files

# Copiar o restante do código para o contêiner
COPY ./client-api ./

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["sh", "-c", "yarn migration:run && yarn start:dev"]
