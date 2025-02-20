  

# mns-app
Monad Domains React Web Application

## Install Dependencies
to install dependencies, run the following command

```shell
yarn  install
```

## Run
to run app, first you need to set you env variables. rename .env.template file to .env then run the following command

```shell
yarn  start
```

## How to set REACT_META_DATA_URL correctly?
use the following format to set META_DATA_URL env.

```shell
REACT_APP_METADATA_URL={{META_DATA_URL}}/{{NETWORK_NAME}}/{{REGISTRAR_CONTROLLER_CONTRACT_ADDRESS}}/{{TOKEN_ID}}/image
```

## Build Docker Image
```shell
docker build -t user/mns-app --build-arg REACT_APP_PROJECT_ID="b6713ccd023958a1da397c790d050436" --build-arg REACT_APP_NODE_ENV="production" .
```

## Run Docker Image
```shell
docker run -it -p 3000:80 user/mns-app
```