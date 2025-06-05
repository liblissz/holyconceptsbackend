FROM node:20.16.0

ENV NODE_ENV=production

WORKDIR /holybackend

COPY ["package*.json", "./"]

RUN npm install

COPY . .

# Expose the port you use in your main file (Render sets process.env.PORT)
EXPOSE 2000

CMD ["node", "index.js"]
