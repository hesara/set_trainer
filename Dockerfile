FROM node:alpine AS build
WORKDIR /app
COPY patterns.ts .
RUN npx tsc patterns.ts

FROM nginx:alpine
COPY patterns.html /usr/share/nginx/html/index.html
COPY patterns.css /usr/share/nginx/html/patterns.css
COPY --from=build /app/patterns.js /usr/share/nginx/html/patterns.js
EXPOSE 80
