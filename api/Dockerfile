FROM node:22-alpine
# Version bewusst festgepinnt: json-server ändert sich zwischen den Hauptversionen
RUN npm install -g json-server@0.17.4
WORKDIR /app
COPY db.seed.json merge-seed.js start.sh ./
RUN sed -i "s/\r$//" start.sh merge-seed.js && chmod +x start.sh
VOLUME /data
EXPOSE 3000
CMD ["./start.sh"]
