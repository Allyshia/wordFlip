# WordFlip
A simple application for managing messages. Supports basic CRUD around messages and a query feature that allows the user to gain more information about a given message. Today this means determining whether or not a message's text is a palindrome.

Check it out [here](http://ec2-52-23-242-43.compute-1.amazonaws.com/ "WordFlip").

## Architecture overview
WordFlip is :

1. A REST API built on NodeJS. See full REST API docs [here](http://ec2-52-23-242-43.compute-1.amazonaws.com/docs "REST API Docs") (click on "messages : Operations around messages" to get started).
2. An AngularJS client

Its technology stack looks something like this:

- AngularJS + Bootstrap CSS (UI/REST client using the Angular framework)
- Express (REST API NodeJS framework)
- NodeJS (Javascript backend)
- Swagger UI + Swagger 2.0 Specification (REST API documentation)
- MongoDB (NoSQL database)
- Docker (container used in deployment)
- Jasmine (testing framework)
- Travis CI (continuous integration)

This app is deployed on AWS.

## Developer workflow

The developer workflow and deployment pipeline are organized in 3 key stages:

### Local development
To get this app running locally:

1. Install and start MongoDB. MongoDB is the only external dependency, and you can find its installation guide [here](https://docs.mongodb.org/manual/installation/ "MongoDB Install Guide").
2. Run the following:

```
npm install
npm run dev
```

This will run the application in 'development' mode, which expects MongoDB to run on localhost at the default port 27017.

To run system tests, run:
```
npm test
```

This will start the application, make some REST calls, verify output, and stop the application afterwards.

### 'Integration' environment
To get this app running locally in a way that simulates the production environment:

1. Install and start Docker. See installation guide [here](https://docs.docker.com/engine/installation/ "Docker Install Guide").
2. Pull the latest MongoDB Docker image from the Docker Hub:

`docker pull mongo`
3. Either build the docker image from source using `docker build -t asewdat/word-flip` or grab the latest from Docker Hub using `docker pull asewdat/word-flip`.

4. Start both docker images like this:
```
docker run --name mongo-img-0 -d mongo
docker run -p 80:3000 --name word-flip-app --link mongo-img-0:mongo -d asewdat/word-flip
```
This will make the application available on your docker-machine host at port 80.

**NOTE**: To get the IP of your docker-machine if you are on MacOS run:
```
eval $(docker-machine env)
```
If you are on Linux, your localhost is your docker machine.

Hit your docker machine IP in a browser window and you should see the app running!

### Production environment

Finally, the way this works in continuous integration mode is that Travis CI picks up changes from GitHub on every push and fires off a build that creates the asewdat/word-flip Docker containers.

An AWS EC2 instance is provisioned with a MongoDB Docker Image, and pulling and running the latest asewdat/word-flip image is all that is required to get the app fully deployed. The entire process takes around 3 minutes.

- For a new install on a Linux machine: run ``sh install.sh``
- To update an existing deployment with new code, run: ``sh update.sh``

## Sequence diagram
Below is a brief overview of the application's flow. The DB and other backend components have been omitted for simplicity, assuming their functions are obvious.
![WordFlip sequence diagram](/word_flip_seq_diagram.png "Optional Title")
