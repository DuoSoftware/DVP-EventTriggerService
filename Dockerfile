FROM node:9.9.0
ARG VERSION_TAG
RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-EventTriggerService.git /usr/local/src/eventtriggerservice
RUN cd /usr/local/src/eventtriggerservice
WORKDIR /usr/local/src/eventtriggerservice
RUN npm install
EXPOSE 3637
CMD [ "node", "/usr/local/src/eventtriggerservice/app.js" ]
