ARG DIRECTUS_VERSION=latest

# Build the extensions
FROM node:16-alpine AS builder

WORKDIR /directus

COPY package.json .

RUN npm install --prod

COPY . .

RUN npm run build


# Create the directus image
FROM directus/directus:${DIRECTUS_VERSION}

COPY --from=builder /directus/extensions /directus/extensions

CMD npx directus bootstrap && npx directus start
