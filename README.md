# README #

### How to build docker image (Not working)? ###

* Clone the repository
* cd into the repository 'cd pawshots_waitlist'
* run 'npm install'  - use 4.x node.js
* To build image run 'docker build -t adzz52/pawshots_waitlist .'
* To push the image 'docker push adzz52/pawshots_waitlist'

Follow the build with bundled app steps here https://hub.docker.com/r/ulexus/meteor/

### How to run the project? ###
* Get the image - run 'docker pull adzz52/pawshots_waitlist:test'
* Run the server 'docker run --net=host -e MONGO_URL=mongodb://localhost:27017/photo -e ROOT_URL=http://waitlist.pawshotsphotography.com -d adzz52/pawshots_waitlist:test'

### Login to Docker Hub ###
* 'docker login'
* adzz52
* password

### Pull docker image from docker hub ###
* docker pull adzz52/pawshots_waitlist:test

### Start MongoDB ###
* docker run -d --net=host mongo

### Start waitlist - Updated Version ###
* docker run --net=host -e MONGO_URL=mongodb://localhost:27017/photo -e ROOT_URL=http://waitlist.pawshotsphotography.com -d adzz52/pawshots_waitlist:test

### Start waitlist - Old Version ###
* docker run --net=host -e MONGO_URL=mongodb://localhost:27017/photo -e ROOT_URL=http://waitlist.pawshotsphotography.com -d adzz52/pawshots_waitlist

### To delete old docker images - Please be careful as it will delete mongodb and all details ###
docker rm $(docker ps -aq)
docker rmi $(docker images -q)

### open firewall port ###
* iptables -A INPUT -p tcp --dport 80 -j ACCEPT

### Dump Database ###
* Copy Mongo_Dump folder
* cd into folder
* run npm install
* then
* MONGODB=mongodb://localhost:27017/photo node start.js


* 'docker ps'.. get the container id..
* 'docker exec -ti CONTAINER_ID bash'
