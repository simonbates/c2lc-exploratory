# Coding to Learn and Create

Exploratory programming for the Coding to Learn and Create project.

To run the code:

- `npm install`
- `grunt server`
- Open http://localhost:8081/

## Docker

To build and run the code using the Docker container definitions (assuming you have Docker installed):

- `docker-compose up`

This builds the exploratory project in a node container, then copies the `build` directory to an nginx container for static deployment.

Available environment variables: 
- `STATIC_SITE_PORT`: controls the port mapped from the host to the port of the container's nginx service (default: 8081)