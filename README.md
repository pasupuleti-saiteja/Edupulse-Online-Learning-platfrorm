# 🎓 Edupulse – Online Learning Platform

<p align="center">
  <b>A Full-Stack Learning Management System built with Spring Boot, React.js and MySQL</b>
</p>

<p align="center">
  A centralized digital learning platform connecting students, instructors and administrators.
</p>

---

## 📌 1. Project Overview

**Edupulse** is a full-stack Online Learning Management System (LMS) developed to simplify digital education and provide a centralized learning environment.

The application provides dedicated functionalities for three types of users:

- **Admin:** Manages students, instructors and courses.
- **Instructor:** Creates and manages courses and lessons.
- **Student:** Browses courses, enrolls in courses, accesses lessons and tracks learning progress.

Edupulse integrates a Spring Boot REST API backend with a React.js frontend and MySQL database to deliver a structured and secure learning experience.

## ✨ 2. Key Features

### 🔐 Authentication and Security
- User registration and login.
- JWT-based authentication.
- Spring Security integration.
- Role-based access control.
- Protected frontend routes.
- Secure user profile management.

### 👨‍🎓 Student Module
- Student dashboard.
- Browse available courses.
- View course details.
- Enroll in courses.
- Access enrolled courses.
- View lessons.
- Track course learning progress.
- Update personal profile.
- Change password.

### 👨‍🏫 Instructor Module
- Instructor dashboard.
- Create courses.
- Edit course details.
- Manage lessons.
- View course enrollment information.
- Manage course content.

### 🛡️ Admin Module
- Admin dashboard.
- Manage students.
- Manage instructors.
- Manage courses.
- Update user status.
- Monitor platform information.

### 📚 Learning Management
- Course listing and details.
- Course enrollment management.
- Lesson management.
- Lesson progress tracking.
- Student learning progress.

## 🛠️ 3. Technologies Used

| Category | Technologies |
|---|---|
| Backend Language | Java |
| Backend Framework | Spring Boot 3 |
| Security | Spring Security |
| Authentication | JWT |
| ORM | Spring Data JPA, Hibernate |
| Frontend | React.js |
| Programming Language | JavaScript |
| Web Technologies | HTML5, CSS3 |
| Database | MySQL |
| API Architecture | REST APIs |
| API Documentation | Springdoc OpenAPI / Swagger |
| API Testing | Postman |
| Build Tool | Maven |
| Version Control | Git and GitHub |

## 🏗️ 4. Project Architecture

Edupulse follows a frontend-backend architecture.

```text
                 EDUPULSE LMS
                      |
          +-----------+-----------+
          |                       |
      FRONTEND                 BACKEND
      React.js                Spring Boot
          |                       |
      Components              Controllers
      Pages                   Services
      Context                 Repositories
      Services                Entities
      Routes                  Security
          |                       |
          +----------+------------+
                     |
                  MySQL
                 Database
```

### Application Flow

1. Users interact with the React.js frontend.
2. Frontend services send HTTP requests to backend REST APIs.
3. Spring Security validates authentication and authorization.
4. Controllers handle incoming requests.
5. Service classes execute application business logic.
6. Spring Data JPA communicates with MySQL.
7. Backend returns responses to the frontend.

## 📂 5. Project Structure

```text
Edupulse-Online-Learning-Platform/
│
├── database/
│   ├── lms_database.sql
│   └── reset_database.sql
│
├── lms-backend/
│   ├── .mvn/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/lms/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── mapper/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── application-prod.yml
│   │   │
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── lms-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── package-lock.json
│
├── postman/
│   ├── LMS_API_Collection.json
│   └── LMS_Local_Environment.json
│
├── .gitignore
└── README.md
```

## ⚙️ 6. Prerequisites

Install the following software before running the project:

| Software | Purpose |
|---|---|
| Java JDK | Run Spring Boot backend |
| Maven | Build backend application |
| Node.js and npm | Run React frontend |
| MySQL Server | Database management |
| MySQL Workbench | Database administration |
| Visual Studio Code | Development environment |
| Postman | REST API testing |
| Git | Version control |

## 🗄️ 7. Database Setup

Edupulse uses MySQL as its relational database.

### Step 1: Start MySQL

Start your MySQL server using MySQL Workbench or Windows Services.

### Step 2: Create the database

Open MySQL Workbench and execute:

```sql
CREATE DATABASE lms_db;
```

### Step 3: Import the database script

Open the following SQL file:

```text
database/lms_database.sql
```

Execute the SQL script in MySQL Workbench.

The project also provides:

```text
database/reset_database.sql
```

Use the reset script only when you intentionally want to reset the database. Review its statements before executing because it may delete existing data.

## 🔧 8. Backend Configuration

Navigate to:

```text
lms-backend/src/main/resources/
```

The project contains two configuration files:

- `application.yml` – Development configuration.
- `application-prod.yml` – Production configuration.

### Development Environment Variables

The application uses environment variables to protect sensitive information.

Configure the following variables in Windows PowerShell:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_NAME = "lms_db"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "YOUR_MYSQL_PASSWORD"
```

Replace `YOUR_MYSQL_PASSWORD` with your actual local MySQL password.

### Generate JWT Secret

Generate a secure 256-bit JWT signing secret using PowerShell:

```powershell
$bytes = New-Object byte[] 32

$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

$rng.GetBytes($bytes)

$env:JWT_SECRET = [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
```

This generates a random secret for JWT signing.

Keep this secret private.

**Important:** Environment variables configured using `$env:` remain available only in the current PowerShell session and its child processes. Configure them again in a new terminal session.

## 🚀 9. Running the Backend Application

### Step 1: Navigate to the backend directory

```powershell
cd lms-backend
```

### Step 2: Run the Spring Boot application

Using Maven:

```bash
mvn spring-boot:run
```

Alternatively, on Windows, use the included Maven wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

### Step 3: Verify backend execution

The backend runs on:

```text
http://localhost:8080
```

### Swagger API Documentation

Open the following URL in your browser:

```text
http://localhost:8080/swagger-ui.html
```

API documentation:

```text
http://localhost:8080/v3/api-docs
```

Swagger provides an interface to explore and test the available REST APIs.

## 💻 10. Running the Frontend Application

Open a new VS Code terminal.

### Step 1: Navigate to frontend directory

```powershell
cd lms-frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the React application

```bash
npm start
```

### Step 4: Access the application

Open your browser:

```text
http://localhost:3000
```

Make sure the backend is running before using features that communicate with the APIs.

## 🔌 11. API Testing Using Postman

Edupulse includes Postman collections for testing backend REST APIs.

Navigate to:

```text
postman/
```

Available files:

- `LMS_API_Collection.json`
- `LMS_Local_Environment.json`

### Testing Instructions

1. Open Postman.
2. Import `LMS_API_Collection.json`.
3. Import `LMS_Local_Environment.json`.
4. Select the environment named `LMS Local Environment`.
5. Verify the `baseUrl` variable.

Default local backend URL:

```text
http://localhost:8080
```

### Authentication Testing

1. Register a user or use an existing test account.
2. Execute the login API.
3. Obtain the JWT token from the authentication response.
4. Use the token for protected API requests.
5. Test student, instructor and admin functionalities using appropriate accounts and permissions.

The Postman environment contains separate token variables:

```text
admin_token
instructor_token
student_token
```

Set these variables locally when testing authenticated APIs. Do not commit real tokens to GitHub.

## 🌐 12. Production Configuration

The production profile uses environment variables for database credentials and security settings.

The following variables must be configured in the production hosting environment:

| Environment Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `SPRING_DATASOURCE_URL` | Production MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Production database username |
| `SPRING_DATASOURCE_PASSWORD` | Production database password |
| `APP_JWT_SECRET` | Production JWT signing secret |
| `APP_JWT_EXPIRATION_MS` | JWT expiration time |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origin |

### Activate Production Profile

Using Maven:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Using a packaged JAR:

```bash
java -jar target/<generated-jar-name>.jar --spring.profiles.active=prod
```

Replace `<generated-jar-name>` with the actual JAR filename generated by Maven.

**Production security:** Never use development credentials in production. Configure strong database passwords, a separate randomly generated JWT secret and your actual deployed frontend URL.

## 🔒 13. Security Practices

Edupulse follows these security practices:

- JWT-based authentication.
- Spring Security integration.
- Role-based authorization.
- Environment-based credential configuration.
- Protected frontend routes.
- Separate development and production configurations.

### Important Security Guidelines

- Never upload database passwords.
- Never commit JWT signing secrets.
- Never commit access tokens or refresh tokens.
- Keep `.env` files out of GitHub.
- Use separate credentials for development and production.
- Rotate credentials immediately if exposed.

## 🧪 14. Testing

The backend contains service-level tests under:

```text
lms-backend/src/test/java/
```

Run the backend tests using:

```bash
mvn test
```

Postman collections are available for manual REST API testing.

## 🚧 15. Future Enhancements

Potential improvements for future versions:

- Online video streaming.
- Course completion certificates.
- Payment gateway integration.
- Email notifications.
- Course ratings and reviews.
- Advanced learning analytics.
- Cloud-based file storage.
- Deployment and CI/CD automation.

## 👨‍💻 16. Developer Information

**Saiteja Pasupuleti**

Full Stack Java Developer

GitHub Profile:

https://github.com/pasupuleti-saiteja

Project Repository:

https://github.com/pasupuleti-saiteja/Edupulse-Online-Learning-platfrorm

## ⭐ 17. Conclusion

Edupulse demonstrates the development of a full-stack Learning Management System using Java, Spring Boot, React.js and MySQL.

The project brings together authentication, role-based authorization, course management, enrollment, lesson management and learning progress tracking in one centralized platform.

It showcases practical experience in backend development, frontend integration, database management, REST API development and application security.

---

**Edupulse – Empowering Digital Learning.**