# mns-app



## Build Docker Image
```shell
docker build -t {{user}}/mns-app .
```

## Run Docker Image
```shell
docker run -it -p {{port}}:{{port}} --env-file .env {{user}}/mns-app
```