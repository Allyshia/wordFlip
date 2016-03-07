# Pull latest word-flip Docker image
docker pull asewdat/word-flip

# Kill existing word-flip app if running
docker kill word-flip-app

# Remove word-flip-app container if exists
docker rm word-flip-app

# Start word-flip-app using latest image
docker run -p 80:3000 --name word-flip-app --link mongo-img-0:mongo -d asewdat/word-flip