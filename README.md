# Backend Starter CLI

Welcome to **Backend Starter CLI**! 🚀 This command-line interface (CLI) tool helps developers quickly scaffold a backend project with customizable options like framework selection, database setup, and boilerplate code generation. Simplify your workflow and focus on building amazing applications!

---

## Features

- **Framework Selection**: Choose between popular backend frameworks:
  - **Node.js Frameworks:**
    - Express
    - NestJS
    - Koa
  - **Python Frameworks:**
    - Flask
    - Django
    - FastAPI
  - **Java Frameworks:**
    - Spring Boot
    - Quarkus
    - Micronaut
  - **Go Frameworks:**
    - Gin
    - Echo
    - Fiber
  - **C# (.NET) Frameworks:**
    - ASP.NET Core
    - Minimal APIs
    - Carter
- **Database Setup**: Includes support for:
  - MongoDB
  - PostgreSQL
  - MySQL
  - SQLite
- **Multi-Language Support**: Automatically detects and supports Node.js, Python, Java, Go, and C# (.NET) environments
- **Project Management**: Automatic setup for npm (Node.js), virtual environments (Python), Maven (Java), Go modules (Go), and .NET CLI (C#)
- **Automatic Environment Configuration**: Generate an `.env` file for your project
- **Git Integration**: Optionally initialize a Git repository with appropriate `.gitignore` files
- **Custom Template Code**: Generate framework-specific starter code with best practices
- **Development Tools**: Includes linting and formatting configurations for all supported languages

---

## Installation

### Prerequisites

To use the `backend-starter` CLI, you need at least one of the following:
- [Node.js](https://nodejs.org/) (version 20 or higher) - for Node.js framework support
- [Python](https://python.org/) (version 3.8 or higher) - for Python framework support
- [Java](https://openjdk.java.net/) (version 11 or higher) - for Java framework support
  - [Maven](https://maven.apache.org/) 3.6+ (optional - Maven wrapper is included)
- [Go](https://golang.org/) (version 1.19 or higher) - for Go framework support
- [.NET](https://dotnet.microsoft.com/) (version 8.0 or higher) - for C# framework support

**Note:** The CLI will automatically detect which runtimes are available and show relevant framework options.

### Global Installation

Install the package globally using npm:
```bash
npm install -g backend-starter-cli
```

Now you can use the CLI anywhere with:
```bash
backend-starter-cli
```

### One-Time Use with NPX

Alternatively, you can use it without installation via npx:
```bash
npx backend-starter-cli
```

---

## Usage

### Starting a New Project

Run the CLI and follow the interactive prompts:
```bash
backend-starter-cli
```

You will be asked to provide the following details:
- **Project Name**: The name of your new project.
- **Initialize Git**: Whether to initialize a Git repository.
- **Framework**: Select your preferred backend framework.
- **Include Database Setup**: Choose whether to configure a database.

### Example Workflow

#### 1. Scaffold a Project
```bash
backend-starter-cli
```
*Example prompt interaction:*
```
? Enter your project name: my-awesome-backend
? Do you want to Initialize git? (Y/n) Yes
? Choose a backend framework: (Use arrow keys)
--- Node.js Frameworks ---
  > Express
    NestJS
    Koa
--- Python Frameworks ---
    Flask
    Django
    FastAPI
--- Java Frameworks ---
    Spring Boot
    Quarkus
    Micronaut
--- Go Frameworks ---
    Gin
    Echo
    Fiber
--- C# (.NET) Frameworks ---
    ASP.NET Core
    Minimal APIs
    Carter
? Do you want to include a database setup? (Y/n) Yes
? Choose a database type: (Use arrow keys)
  > PostgreSQL
    MongoDB
    MySQL
    SQLite
```

#### 2. Navigate to Your New Project
```bash
cd my-awesome-backend
```

#### 3. Setup and Install Dependencies

**For Node.js projects:**
```bash
npm install
npm run dev
```

**For Python projects:**
```bash
chmod +x setup.sh && ./setup.sh
source venv/bin/activate
python main.py
```

**For Java projects:**
```bash
./mvnw clean install
./mvnw spring-boot:run  # for Spring Boot
# OR
./mvnw quarkus:dev      # for Quarkus
# OR  
./mvnw mn:run           # for Micronaut
```

**For Go projects:**
```bash
go mod tidy
go run main.go
```

**For C# (.NET) projects:**
```bash
dotnet restore
dotnet run
```

#### 4. Start Building 🚀
Start coding with your generated boilerplate!

---

## Project Structure

### Node.js Project (Express example)
```
my-awesome-backend/
├── .env                 # Environment variables
├── .eslintrc.cjs        # ESLint configuration
├── .gitignore           # Git ignore file
├── .prettierrc.json     # Prettier configuration
├── index.js             # Entry point for the application
├── package.json         # Project metadata and dependencies
├── README.md            # Project documentation
└── node_modules/        # Installed dependencies (after npm install)
```

### Python Project (Flask example)
```
my-awesome-backend/
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── main.py              # Entry point for the application
├── pyproject.toml       # Project configuration and metadata
├── README.md            # Project documentation
├── requirements.txt     # Python dependencies
├── setup.sh             # Virtual environment setup script
└── venv/                # Virtual environment (after running setup.sh)
```

### Java Project (Spring Boot example)
```
my-awesome-backend/
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── .mvn/                # Maven wrapper
├── mvnw                 # Maven wrapper script (Unix)
├── mvnw.cmd             # Maven wrapper script (Windows)
├── pom.xml              # Maven project file
├── README.md            # Project documentation
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/
│   │   │       └── Application.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
└── target/              # Build output (after mvn compile)
```

### Go Project (Gin example)
```
my-awesome-backend/
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── main.go              # Main application file
├── go.mod               # Go module file
├── go.sum               # Dependencies checksum (auto-generated)
├── README.md            # Project documentation
├── cmd/                 # Command line applications
├── internal/            # Private application code
└── pkg/                 # Public library code
```

---

## Requirements

### For the CLI itself:
- Node.js >= 20.0.0
- npm >= 10.0.0 or higher

### For generated projects:
**Node.js projects:**
- Node.js >= 20.0.0
- npm >= 10.0.0 or higher

**Python projects:**
- Python >= 3.8
- pip (Python package installer)
- venv module (usually included with Python)

**Java projects:**
- Java >= 11 (JDK recommended)
- Maven >= 3.6.0 (or use included Maven wrapper)

**Go projects:**
- Go >= 1.19
- Go modules (included with Go)

---

## Contributing

For guidelines on contributing, please see [CONTRIBUTING.md](CONTRIBUTING.md)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Feedback

If you encounter any issues or have suggestions, please open an [issue](https://github.com/your-repo/backend-starter/issues) or contact us.

---

### Happy Building! 🎉
