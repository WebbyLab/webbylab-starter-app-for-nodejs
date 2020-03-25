FROM node:13-alpine as BUILDER

WORKDIR /app
COPY . .
RUN npm install

FROM node:13-alpine
WORKDIR /app
COPY --from=BUILDER /app .

# Here you can copy all additional data and commands to be added to image
# For example: configuration for crontabs:
# COPY crontabs/busybox.conf /etc/busybox.conf
# RUN chmod 600 /etc/busybox.conf

ENV DB_HOST=db

ENV PORT=8080
EXPOSE 8080

CMD [ "npm", "start"]