FROM node:23.7.0

WORKDIR /usr/local/app/server
 
COPY ./server ./

USER root
RUN chmod a+rw -R /home

RUN yarn install
RUN yarn global add typescript
RUN yarn build 
RUN yarn add cors

EXPOSE 3000

RUN useradd server

USER server

CMD ["yarn", "start"]