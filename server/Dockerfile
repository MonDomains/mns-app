FROM node:23.7.0

WORKDIR /usr/local/app

COPY package.json ./
COPY tsconfig.json ./

RUN yarn install

COPY src ./src

USER root
RUN yarn global add typescript && yarn build && yarn add cors
RUN apt-get update; apt-get install -y fontconfig
RUN fc-cache -f -v
RUN chmod a+rw -R /home
RUN apt install -y pango1.0-tools

EXPOSE 3000

RUN useradd api
USER api

CMD ["yarn", "start"]