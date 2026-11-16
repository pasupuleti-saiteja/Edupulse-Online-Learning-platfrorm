# LMS Backend - Spring Boot 3 REST API

Enterprise RESTful API engine for the Online Learning Management System (LMS).

## Tech Stack
- **Framework:** Spring Boot 3.3.4 (Java 17/21)
- **Security:** Spring Security 6 with JJWT (0.12.6)
- **Database Access:** Spring Data JPA & Hibernate ORM
- **Database Engine:** MySQL 8.x
- **Connection Pool:** HikariCP
- **Documentation:** SpringDoc OpenAPI 3.0 / Swagger UI
- **Build Tool:** Apache Maven

## Directory Structure
```
src/main/java/com/lms/
├── LmsApplication.java     # Application Bootstrapper
├── config/                 # OpenAPI & CORS Configurations
├── controller/             # REST Endpoints
├── dto/                    # Request & Response Data Transfer Objects
├── entity/                 # JPA Domain Entities
├── exception/              # Global Exception Handling & Error Responses
├── mapper/                 # DTO <-> Entity Mappers
├── repository/             # Spring Data Repositories
├── security/               # JWT Token Provider, Auth Filter & SecurityFilterChain
└── service/                # Business Logic Interfaces & Implementations
```

## Running the Application
```bash
# Using Maven
mvn clean spring-boot:run

# Or with environment variable overrides:
mvn clean spring-boot:run -Dspring-boot.run.arguments="--DB_PASSWORD=your_password"
```

## Interactive API Documentation
Once running, navigate to:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec:** `http://localhost:8080/v3/api-docs`
