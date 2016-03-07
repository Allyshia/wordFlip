# Updated installed packages and package cache
sudo yum update -y

# Install Docker
sudo yum install -y docker

# Start Docker service
sudo service docker start

# Add the ec2-user to the docker group so you can execute Docker commands without using sudo.
sudo usermod -a -G docker ec2-user

# NOTE: will have to log out, log in and run the script again, will continue from below

# Pull mongo Docker image from Docker Hub
docker pull mongo

# Pull the asewdat/word-flip image built on NodeJS (only works as long as the Docker repo remains public)
docker pull asewdat/word-flip

# Start the mongo Docker image using default host volume
docker run --name mongo-img-0 -d mongo

# Start the node application on the word-flip Docker image and link it to the running mongo image
# NOTE: make the node app accessible on port 80
docker run -p 80:3000 --name word-flip-app --link mongo-img-0:mongo -d asewdat/word-flip