FROM node:23.7.0

WORKDIR /usr/local/app/server
 
COPY ./server ./

RUN yarn install
RUN yarn global add typescript
RUN yarn build 
RUN yarn add cors

USER root
RUN chmod a+rw -R /home
RUN useradd app
RUN mkdir /home/app && chown -R app:app /home/app
USER app

EXPOSE 3000

CMD ["yarn", "start"]