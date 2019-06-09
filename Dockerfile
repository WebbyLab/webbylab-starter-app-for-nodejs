FROM node:10.15-alpine
WORKDIR /backend
ADD . .
CMD ["node", "runner.js"]