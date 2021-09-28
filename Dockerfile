ARG DISTRO="ubuntu:18.04"
FROM ${DISTRO}

RUN apt-get update && apt-get -y install git
WORKDIR /usr/src/app

COPY ./lib/node-v6.10.3-linux-x64.tar.gz /opt/
RUN tar -C /usr/local --strip-components 1 -xzf /opt/node-v6.10.3-linux-x64.tar.gz

EXPOSE 8000