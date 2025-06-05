#Sample Dockerfile for NodeJS Apps

FROM node:20.16.0

ENV NODE_ENV=production

WORKDIR /holybackend

COPY ["package*.json", "package-lock.json*", "./"]

RUN npm install 

COPY . .

EXPOSE 4000
EXPOSE 2000
EXPOSE 3000
CMD [ "node", "index.js" ]
CMD [ "node", "server.js" ]
CMD [ "node", "notification.js" ]
CMD [ "node", "emailJob.js" ]

