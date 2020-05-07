FROM node:14-alpine as BUILDER

WORKDIR /app
COPY . .
RUN npm install --prod

FROM node:14-alpine
WORKDIR /app
COPY --from=BUILDER /app .

# Here you can copy all additional data and commands to be added to image
# For example: configuration for crontabs:
# COPY crontabs/busybox.conf /etc/busybox.conf
# RUN chmod 600 /etc/busybox.conf

ENV DB_HOST=db

ENV PORT=8000
EXPOSE 8000
ENV WSS_PORT=12345
EXPOSE 8080:12345

CMD [ "npm", "start"]