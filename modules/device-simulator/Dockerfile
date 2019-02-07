# Set the base image to Ubuntu
FROM    node:alpine

# Install nodemon
RUN npm install -g pm2

# Copy npm package
ADD package.json /tmp/package.json

RUN cd /tmp && npm install
RUN mkdir -p /server \
    && cp -a /tmp/node_modules /server/

RUN mkdir -p /server
ADD . /server/

# Define working directory
WORKDIR /server

EXPOSE 80

# Run app using nodemon
CMD ["pm2", "start", "src/index.js"]