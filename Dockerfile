FROM nginx:alpine
COPY patterns.html /usr/share/nginx/html/index.html
COPY patterns.css /usr/share/nginx/html/patterns.css
COPY patterns.js /usr/share/nginx/html/patterns.js
EXPOSE 80
