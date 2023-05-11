FROM node:16.3.0-alpine 

WORKDIR /usr/src/app/backend/

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm cache clean --force \
    && rm -rf node_modules \
    && npm install
RUN npm i -S argon2@0.30.3 --build-from-source
COPY ./ ./

EXPOSE 3000
CMD ["node", "index.js"]