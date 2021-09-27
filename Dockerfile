ARG DISTRO="node:6.13.1"
FROM ${DISTRO}

WORKDIR /usr/src/app
RUN git clone https://github.com/tomasjhon/AngularJS_MockupDD.git
WORKDIR /usr/src/app/AngularJS_MockupDD
# RUN git fetch && git checkout main
RUN chmod -R 777 /usr/src/app/AngularJS_MockupDD
RUN npm install -g bower
RUN bower install --allow-root
EXPOSE 8000
COPY start.sh start.sh
RUN chmod +x start.sh
# CMD ["npm" "start"]
ENTRYPOINT ["./start.sh"]
# CMD ["./start.sh"]