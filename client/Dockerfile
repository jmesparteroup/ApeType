# base image (all dockerfiles should have this)
FROM node:alpine
 
# set working directory
WORKDIR /ng-app
 
### install and cache app dependencies
 
# copy package.json & package-lock.json to ./ inside the Docker image
COPY package.json .
 
# install dependencies of the app
RUN npm install
 
# copy the source code to the Docker image
COPY . .
 
# expose the port where the app will listen to
EXPOSE 4200
 
# start the server
CMD ./node_modules/.bin/ng serve --host 0.0.0.0