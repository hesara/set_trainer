FROM node:alpine AS build
WORKDIR /app
COPY patterns.ts .
RUN npm install typescript && npx tsc --target es2017 --lib es2017,dom patterns.ts

FROM nginx:alpine
COPY patterns.html /usr/share/nginx/html/index.html
COPY patterns.css /usr/share/nginx/html/patterns.css
COPY --from=build /app/patterns.js /usr/share/nginx/html/patterns.js
EXPOSE 80
