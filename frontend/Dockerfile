FROM node:14.15.0

WORKDIR /usr/src/app/

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm cache clean --force \
    && rm -rf node_modules \
    && npm update \
    && npm install \
    && npm install -g @angular/cli@14.2.1
COPY ./ ./

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]