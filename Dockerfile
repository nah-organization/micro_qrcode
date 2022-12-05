FROM node:18-alpine AS build

WORKDIR /build/
COPY tsconfig.json package.json /build/
RUN npm install

COPY src /build/src
RUN npm run build

FROM node:18-alpine

EXPOSE 443
WORKDIR /app/
COPY package.json /app/
RUN npm install --omit=dev --cache /tmp/empty-cache && rm -rf /tmp/empty-cache

COPY --from=build /build/dist /app/dist
ENTRYPOINT [ "npm", "start" ]
