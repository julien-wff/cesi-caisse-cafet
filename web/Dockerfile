FROM node:16-alpine as build

WORKDIR /usr/src/app/
RUN wget -qO- https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch && pnpm install -r --offline

ARG VITE_API_ENDPOINT
ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT

ADD . ./
RUN pnpm build


FROM sebp/lighttpd:latest as production

WORKDIR /var/www/servers/cafet-cesi/
COPY ./lighttpd /etc/lighttpd

COPY --from=build /usr/src/app/dist .

EXPOSE 80
