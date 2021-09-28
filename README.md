# AngularJS_MockupDD

# Iniciar Contenedor

- Ejecutamos lo siguente

```
docker-compose run --rm --service-ports mockupdd bash
```

<!-- - En este punto estamos dentro del Contenedor ubicados en el directorio del proyecto, debemos ejecutar

```
npm install -g bower
bower install --allow-root
``` -->

- En este punto estamos dentro del Contenedor y ubicados en el directorio del proyecto.Ahora vamos a Iniciar el servicio

```
npm start
```

- En el Navegador ingresamos

```
0.0.0.0:8001
```

# Genenar nueva Imagen

Esto nos permite subir una nueva imagen al [Docker Hub](https://hub.docker.com/r/tomasjhon/mockupdd)

- Debemos movernos de branch

```
 git checkout feature_build_image_from_repo
```

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

- Subimos nuevo tag de la imagen al Docker Hub

```
docker push tomasjhon/mockupdd:latest
```

- Creamos Contenedor

```
docker run -d --name mockupdd -p PORT:8000 tomasjhon/mockupdd
```
