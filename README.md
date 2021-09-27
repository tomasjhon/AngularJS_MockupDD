# AngularJS_MockupDD

# Iniciar Contenedor

```
docker-compose run --service-ports mockupdd bash
.
.
.
```

# Genenar nueva Imagen

Esto nos permite subir una nueva imagen al [Docker Hub](https://hub.docker.com/r/tomasjhon/mockupdd)

- Crear imagen

```
docker build -t tomasjhon/mockupdd .
ó
docker build -t tomasjhon/mockupdd:{TAG} .

```

- Login en Docker Hub

```
docker login
```

- Subir nuevo tag de imagen al Docker Hub

```
docker push tomasjhon/mockupdd:latest
```
