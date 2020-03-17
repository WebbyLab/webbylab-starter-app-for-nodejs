FROM node:13 as BUILDER

WORKDIR /app

# since we first copy package.json and run npm install
# (and only later add the rest of the application), Docker will run those steps from cache
# (unless there were no changes in package.json) which will greatly reduce the build time.
# The install time for dependencies is pretty long and this is how we optimize it.
COPY package.json /app
RUN npm install
COPY . /app

# From previous version:
# COPY . .
# RUN npm install

FROM node:13
WORKDIR /app
COPY --from=BUILDER /app .

# Here you can copy all additional data and commands to be added to image
# For example: configuration for crontabs:
# COPY crontabs/busybox.conf /etc/busybox.conf
# RUN chmod 600 /etc/busybox.conf


USER root

ENV DB_HOST=db
ENV MODE=production

ENV PORT=8080
EXPOSE 8080

CMD [ "node", "app.js"]