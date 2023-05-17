# Events API
Events API to CRUD events

## Getting Started
To get started, you just need to build the docker image and run it using these commands, or else, you can run it using the docker-compose file in the 4WEBD root folder.

Build the image with `docker build -t events-api .`

Run a database container with `docker run -p 3308:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root MYSQL_USER=user MYSQL_PASSWORD=password MYSQL_DATABASE=events-api -d mysql:latest`

Run the api container with `docker run -p 8080:8080 events-api`

## API Documentation
The API documentation is available using postman, you need to import the postman json file in the 4WEBD root folder.

## Built With
* [Spring Boot](https://spring.io/projects/spring-boot) - The web framework used
  * [Spring Data JPA](https://spring.io/projects/spring-data-jpa) - The data access framework used
  * [Spring Security](https://spring.io/projects/spring-security) - The security framework used
  * [Lombok](https://projectlombok.org/) - The code generator used
* [Maven](https://maven.apache.org/) - Dependency Management
* [MySQL](https://www.mysql.com/) - The database used
* [Docker](https://www.docker.com/) - The container platform used
* [Postman](https://www.postman.com/) - The API development environment used
