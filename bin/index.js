#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Check if Python is available
function checkPythonAvailability() {
  try {
    execSync('python3 --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if Node.js is available
function checkNodeAvailability() {
  try {
    execSync('node --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if Java is available
function checkJavaAvailability() {
  try {
    execSync('java -version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if Maven is available
function checkMavenAvailability() {
  try {
    execSync('mvn --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if Go is available
function checkGoAvailability() {
  try {
    execSync('go version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if .NET is available
function checkDotNetAvailability() {
  try {
    execSync('dotnet --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function setupProject() {
  try {
    console.log(chalk.blue('\nWelcome to the Backend Starter CLI! 🚀\n'));

    const pythonAvailable = checkPythonAvailability();
    const nodeAvailable = checkNodeAvailability();
    const javaAvailable = checkJavaAvailability();
    const mavenAvailable = checkMavenAvailability();
    const goAvailable = checkGoAvailability();
    const dotnetAvailable = checkDotNetAvailability();

    // Build framework choices based on available runtimes
    const frameworkChoices = [];
    if (nodeAvailable) {
      frameworkChoices.push(
        new inquirer.Separator('--- Node.js Frameworks ---'),
        'Express',
        'NestJS',
        'Koa'
      );
    }
    if (pythonAvailable) {
      frameworkChoices.push(
        new inquirer.Separator('--- Python Frameworks ---'),
        'Flask',
        'Django',
        'FastAPI'
      );
    }
    if (javaAvailable) {
      frameworkChoices.push(
        new inquirer.Separator('--- Java Frameworks ---'),
        'Spring Boot',
        'Quarkus',
        'Micronaut'
      );
    }
    if (goAvailable) {
      frameworkChoices.push(
        new inquirer.Separator('--- Go Frameworks ---'),
        'Gin',
        'Echo',
        'Fiber'
      );
    }
    if (dotnetAvailable) {
      frameworkChoices.push(
        new inquirer.Separator('--- C# (.NET) Frameworks ---'),
        'ASP.NET Core',
        'Minimal APIs',
        'Carter'
      );
    }

    if (frameworkChoices.length === 0) {
      console.log(chalk.red('\nError: No supported runtime is available on your system.'));
      console.log(chalk.yellow('Please install one of the following and try again:'));
      console.log(chalk.yellow('  • Node.js (https://nodejs.org/) for Node.js frameworks'));
      console.log(chalk.yellow('  • Python 3.8+ (https://python.org/) for Python frameworks'));
      console.log(chalk.yellow('  • Java 11+ (https://openjdk.java.net/) for Java frameworks'));
      console.log(chalk.yellow('  • Go 1.19+ (https://golang.org/) for Go frameworks'));
      console.log(chalk.yellow('  • .NET 6+ (https://dotnet.microsoft.com/) for C# frameworks'));
      process.exit(1);
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter your project name:',
        default: 'my-backend-project',
      },
      {
        type: 'confirm',
        name: 'versionControl',
        message: 'Do you want to initialize Git?',
        default: true,
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Choose a backend framework:',
        choices: frameworkChoices,
        default: nodeAvailable ? 'Express' : pythonAvailable ? 'Flask' : javaAvailable ? 'Spring Boot' : goAvailable ? 'Gin' : 'ASP.NET Core',
      },
      {
        type: 'confirm',
        name: 'addDatabase',
        message: 'Do you want to include database configuration?',
        default: true,
      },
    ]);

    let dbConfig = {};
    if (answers.addDatabase) {
      dbConfig = await inquirer.prompt([
        {
          type: 'list',
          name: 'databaseType',
          message: 'Choose a database type:',
          choices: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
          default: 'PostgreSQL',
        },
        {
          type: 'confirm',
          name: 'createEnvFile',
          message: 'Do you want to create an .env file for your database configuration?',
          default: true,
        },
      ]);
    }

    const { projectName, framework, versionControl, addDatabase } = answers;
    const projectPath = path.resolve(process.cwd(), projectName);
    const isPythonFramework = ['Flask', 'Django', 'FastAPI'].includes(framework);
    const isJavaFramework = ['Spring Boot', 'Quarkus', 'Micronaut'].includes(framework);
    const isGoFramework = ['Gin', 'Echo', 'Fiber'].includes(framework);
    const isDotNetFramework = ['ASP.NET Core', 'Minimal APIs', 'Carter'].includes(framework);

    // Create project directory
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`Directory "${projectName}" already exists! Exiting.`));
      process.exit(1);
    }
    fs.mkdirSync(projectPath);

    // Framework dependencies
    const nodeDependencies = {
      Express: ['express'],
      NestJS: ['@nestjs/core', '@nestjs/common', 'reflect-metadata'],
      Koa: ['koa'],
    };

    const pythonDependencies = {
      Flask: ['Flask==3.0.0', 'python-dotenv==1.0.0'],
      Django: ['Django==5.0.0', 'python-dotenv==1.0.0'],
      FastAPI: ['fastapi==0.109.0', 'uvicorn[standard]==0.25.0', 'python-dotenv==1.0.0'],
    };

    // Java framework information (Maven-based)
    const javaFrameworkInfo = {
      'Spring Boot': {
        groupId: 'com.example',
        artifactId: projectName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        version: '0.0.1-SNAPSHOT',
        javaVersion: '17',
        springBootVersion: '3.2.1',
        mainClass: 'Application'
      },
      'Quarkus': {
        groupId: 'com.example',
        artifactId: projectName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        version: '1.0.0-SNAPSHOT',
        javaVersion: '17',
        quarkusVersion: '3.6.4',
        mainClass: 'Application'
      },
      'Micronaut': {
        groupId: 'com.example',
        artifactId: projectName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        version: '0.1',
        javaVersion: '17',
        micronautVersion: '4.2.3',
        mainClass: 'Application'
      }
    };

    // Go framework dependencies
    const goDependencies = {
      Gin: ['github.com/gin-gonic/gin@v1.9.1'],
      Echo: ['github.com/labstack/echo/v4@v4.11.4'],
      Fiber: ['github.com/gofiber/fiber/v2@v2.52.0'],
    };

    // C# (.NET) framework information
    const dotnetFrameworkInfo = {
      'ASP.NET Core': {
        template: 'webapi',
        framework: 'net8.0',
        packages: [],
      },
      'Minimal APIs': {
        template: 'web',
        framework: 'net8.0',
        packages: [],
      },
      'Carter': {
        template: 'web',
        framework: 'net8.0',
        packages: ['Carter'],
      },
    };

    // Database-specific dependencies
    const databaseDependencies = {
      node: {
        MongoDB: ['mongoose'],
        PostgreSQL: ['pg'],
        MySQL: ['mysql2'],
        SQLite: ['sqlite3'],
      },
      python: {
        MongoDB: ['pymongo==4.6.0'],
        PostgreSQL: ['psycopg2-binary==2.9.9', 'SQLAlchemy==2.0.25'],
        MySQL: ['mysql-connector-python==8.2.0', 'SQLAlchemy==2.0.25'],
        SQLite: ['SQLAlchemy==2.0.25'],
      },
      java: {
        MongoDB: ['org.springframework.boot:spring-boot-starter-data-mongodb'],
        PostgreSQL: ['org.springframework.boot:spring-boot-starter-data-jpa', 'org.postgresql:postgresql'],
        MySQL: ['org.springframework.boot:spring-boot-starter-data-jpa', 'mysql:mysql-connector-java'],
        SQLite: ['org.springframework.boot:spring-boot-starter-data-jpa', 'org.xerial:sqlite-jdbc'],
      },
      go: {
        MongoDB: ['go.mongodb.org/mongo-driver@v1.13.1'],
        PostgreSQL: ['github.com/lib/pq@v1.10.9', 'gorm.io/gorm@v1.25.5', 'gorm.io/driver/postgres@v1.5.4'],
        MySQL: ['github.com/go-sql-driver/mysql@v1.7.1', 'gorm.io/gorm@v1.25.5', 'gorm.io/driver/mysql@v1.5.2'],
        SQLite: ['gorm.io/gorm@v1.25.5', 'gorm.io/driver/sqlite@v1.5.4'],
      },
      dotnet: {
        MongoDB: ['MongoDB.Driver'],
        PostgreSQL: ['Microsoft.EntityFrameworkCore.Design', 'Npgsql.EntityFrameworkCore.PostgreSQL'],
        MySQL: ['Microsoft.EntityFrameworkCore.Design', 'Pomelo.EntityFrameworkCore.MySql'],
        SQLite: ['Microsoft.EntityFrameworkCore.Design', 'Microsoft.EntityFrameworkCore.Sqlite'],
      },
    };

    // Setup project files based on framework type
    if (isPythonFramework) {
      // Create Python project structure
      const requirementsList = [...pythonDependencies[framework]];
      
      // Add database dependencies if needed
      if (addDatabase && dbConfig.databaseType) {
        requirementsList.push(...databaseDependencies.python[dbConfig.databaseType]);
      }
      
      // Create requirements.txt
      fs.writeFileSync(
        path.join(projectPath, 'requirements.txt'),
        requirementsList.join('\n') + '\n'
      );
      
      // Create pyproject.toml for modern Python packaging
      const pyprojectToml = `[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "${projectName}"
version = "0.1.0"
description = "A ${framework} backend project"
readme = "README.md"
requires-python = ">=3.8"
classifiers = [
    "Programming Language :: Python :: 3",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
]
dynamic = ["dependencies"]

[tool.setuptools.dynamic]
dependencies = {file = ["requirements.txt"]}
`;
      fs.writeFileSync(path.join(projectPath, 'pyproject.toml'), pyprojectToml);
      
      // Create virtual environment setup script
      const setupScript = `#!/bin/bash
# Setup script for ${projectName}

echo "Setting up Python virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Setup complete! To activate the virtual environment, run:"
echo "source venv/bin/activate"
`;
      fs.writeFileSync(path.join(projectPath, 'setup.sh'), setupScript);
      fs.chmodSync(path.join(projectPath, 'setup.sh'), 0o755);
      
    } else {
      // Initialize npm project with boilerplate package.json
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = {
        name: projectName,
        version: '0.0.0',
        main: 'index.js',
        scripts: {
          dev: 'node index.js',
          start: 'node index.js',
          format: 'prettier --write *.js',
          lint: 'eslint *.js --fix'
        },
        dependencies: {},
        devDependencies: {
          "prettier": "latest",
          "eslint": "latest"
        },
        type: 'module',
        keywords: [],
        author: "",
        license: "ISC",
        description: '',
      };

      // Add framework dependencies
      nodeDependencies[framework].forEach(dep => {
        packageJson.dependencies[dep] = "latest";
      });
      
      // Add database dependencies if needed
      if (addDatabase && dbConfig.databaseType) {
        databaseDependencies.node[dbConfig.databaseType].forEach(dep => {
          packageJson.dependencies[dep] = "latest";
        });
      }

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // Generate boilerplate code
    const nodeBoilerplate = {
      Express: `
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`,
      NestJS: `
// NestJS boilerplate is available. Please refer to the official documentation to set up the project.
console.log('NestJS boilerplate generated. Follow official docs for additional setup.');
`,
      Koa: `
import Koa from 'koa';

const app = new Koa();
app.use(async (ctx) => {
  ctx.body = 'Hello, World!';
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
`,
    };

    const pythonBoilerplate = {
      Flask: `
from flask import Flask
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/health')
def health_check():
    return {'status': 'healthy', 'message': 'Flask server is running'}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
`,
      Django: `
# Django project structure
# This is a placeholder file. Run the following commands to set up Django:
# python manage.py startapp main
# python manage.py migrate
# python manage.py runserver

import os
from django.conf import settings
from django.core.wsgi import get_wsgi_application
from django.http import JsonResponse
from django.urls import path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Django settings
settings.configure(
    DEBUG=os.environ.get('DEBUG', 'True').lower() == 'true',
    SECRET_KEY=os.environ.get('SECRET_KEY', 'your-secret-key-here'),
    ROOT_URLCONF='__main__',
    ALLOWED_HOSTS=['*'],
    INSTALLED_APPS=[
        'django.contrib.contenttypes',
        'django.contrib.auth',
    ],
    MIDDLEWARE=[
        'django.middleware.security.SecurityMiddleware',
        'django.middleware.common.CommonMiddleware',
    ],
)

def hello_world(request):
    return JsonResponse({'message': 'Hello, World!'})

def health_check(request):
    return JsonResponse({'status': 'healthy', 'message': 'Django server is running'})

urlpatterns = [
    path('', hello_world),
    path('health/', health_check),
]

if __name__ == '__main__':
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'runserver'])
`,
      FastAPI: `
from fastapi import FastAPI
from dotenv import load_dotenv
import os
import uvicorn

# Load environment variables
load_dotenv()

app = FastAPI(title="${projectName}", version="0.1.0")

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "FastAPI server is running"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    debug = os.environ.get("DEBUG", "False").lower() == "true"
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=debug)
`,
    };

    // Create main application file
    if (isPythonFramework) {
      fs.writeFileSync(path.join(projectPath, 'main.py'), pythonBoilerplate[framework]);
    } else if (isJavaFramework) {
      // Create Java source files
      const frameInfo = javaFrameworkInfo[framework];
      
      // Create Maven directory structure
      fs.mkdirSync(path.join(projectPath, 'src', 'main', 'java', 'com', 'example'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src', 'main', 'resources'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src', 'test', 'java', 'com', 'example'), { recursive: true });
      
      // Generate pom.xml
      let pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>${frameInfo.groupId}</groupId>
    <artifactId>${frameInfo.artifactId}</artifactId>
    <version>${frameInfo.version}</version>
    <packaging>jar</packaging>

    <name>${projectName}</name>
    <description>A ${framework} project created with Backend Starter CLI</description>

    <properties>
        <maven.compiler.source>${frameInfo.javaVersion}</maven.compiler.source>
        <maven.compiler.target>${frameInfo.javaVersion}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
`;

      // Add framework-specific properties and dependencies
      if (framework === 'Spring Boot') {
        pomXml += `        <spring-boot.version>${frameInfo.springBootVersion}</spring-boot.version>
    </properties>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>${frameInfo.springBootVersion}</version>
        <relativePath/>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>`;
      } else if (framework === 'Quarkus') {
        pomXml += `        <quarkus.version>${frameInfo.quarkusVersion}</quarkus.version>
        <compiler-plugin.version>3.11.0</compiler-plugin.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>io.quarkus.platform</groupId>
                <artifactId>quarkus-bom</artifactId>
                <version>\${quarkus.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-resteasy-reactive-jackson</artifactId>
        </dependency>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-smallrye-health</artifactId>
        </dependency>`;
      } else if (framework === 'Micronaut') {
        pomXml += `        <micronaut.version>${frameInfo.micronautVersion}</micronaut.version>
        <micronaut.runtime>netty</micronaut.runtime>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>io.micronaut.platform</groupId>
                <artifactId>micronaut-platform</artifactId>
                <version>\${micronaut.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>io.micronaut</groupId>
            <artifactId>micronaut-http-server-netty</artifactId>
        </dependency>
        <dependency>
            <groupId>io.micronaut</groupId>
            <artifactId>micronaut-jackson-databind</artifactId>
        </dependency>
        <dependency>
            <groupId>io.micronaut</groupId>
            <artifactId>micronaut-management</artifactId>
        </dependency>`;
      }

      // Add database dependencies if selected
      if (addDatabase && dbConfig.databaseType) {
        const dbDeps = databaseDependencies.java[dbConfig.databaseType];
        if (dbDeps) {
          dbDeps.forEach(dep => {
            const [groupId, artifactId] = dep.split(':');
            pomXml += `
        <dependency>
            <groupId>${groupId}</groupId>
            <artifactId>${artifactId}</artifactId>
        </dependency>`;
          });
        }
      }

      // Close dependencies and add build section
      pomXml += `
    </dependencies>

    <build>
        <plugins>`;

      if (framework === 'Spring Boot') {
        pomXml += `
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>`;
      } else if (framework === 'Quarkus') {
        pomXml += `
            <plugin>
                <groupId>\${quarkus.platform.group-id}</groupId>
                <artifactId>quarkus-maven-plugin</artifactId>
                <version>\${quarkus.version}</version>
                <extensions>true</extensions>
                <executions>
                    <execution>
                        <goals>
                            <goal>build</goal>
                            <goal>generate-code</goal>
                            <goal>generate-code-tests</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>`;
      } else if (framework === 'Micronaut') {
        pomXml += `
            <plugin>
                <groupId>io.micronaut.maven</groupId>
                <artifactId>micronaut-maven-plugin</artifactId>
                <version>4.2.1</version>
            </plugin>`;
      }

      pomXml += `
        </plugins>
    </build>
</project>`;

      fs.writeFileSync(path.join(projectPath, 'pom.xml'), pomXml);
      
      // Create Maven wrapper files
      const mvnwScript = `#!/bin/sh
# Maven Wrapper Script
if [ -x "$JAVA_HOME/bin/java" ] ; then
    JAVA_EXE="$JAVA_HOME/bin/java"
else
    JAVA_EXE=java
fi

exec "$JAVA_EXE" -jar .mvn/wrapper/maven-wrapper.jar "$@"
`;
      fs.writeFileSync(path.join(projectPath, 'mvnw'), mvnwScript);
      fs.chmodSync(path.join(projectPath, 'mvnw'), 0o755);
      
      fs.mkdirSync(path.join(projectPath, '.mvn', 'wrapper'), { recursive: true });
      
      const packagePath = path.join(projectPath, 'src', 'main', 'java', 'com', 'example');
      
      // Generate main application class
      let mainClass = '';
      if (framework === 'Spring Boot') {
        mainClass = `package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@SpringBootApplication
@RestController
public class ${frameInfo.mainClass} {

    public static void main(String[] args) {
        SpringApplication.run(${frameInfo.mainClass}.class, args);
    }

    @GetMapping("/")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello, World!");
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("message", "Spring Boot server is running");
        return response;
    }
}
`;
      } else if (framework === 'Quarkus') {
        mainClass = `package com.example;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.Map;
import java.util.HashMap;

@Path("/")
public class ${frameInfo.mainClass} {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello, World!");
        return response;
    }

    @GET
    @Path("/health")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("message", "Quarkus server is running");
        return response;
    }
}
`;
      } else if (framework === 'Micronaut') {
        mainClass = `package com.example;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.runtime.Micronaut;
import java.util.Map;
import java.util.HashMap;

@Controller
public class ${frameInfo.mainClass} {

    public static void main(String[] args) {
        Micronaut.run(${frameInfo.mainClass}.class, args);
    }

    @Get("/")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello, World!");
        return response;
    }

    @Get("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("message", "Micronaut server is running");
        return response;
    }
}
`;
      }
      
      fs.writeFileSync(path.join(packagePath, `${frameInfo.mainClass}.java`), mainClass);
      
      // Create application.properties or application.yml
      let appConfig = '';
      if (addDatabase && dbConfig.databaseType) {
        const defaultPorts = {
          MongoDB: 27017,
          PostgreSQL: 5432,
          MySQL: 3306,
          SQLite: 'N/A'
        };
        
        if (framework === 'Spring Boot') {
          appConfig = `# Application Configuration
server.port=8080
spring.application.name=${projectName}

# Database Configuration
spring.datasource.url=jdbc:${dbConfig.databaseType.toLowerCase()}://localhost:${defaultPorts[dbConfig.databaseType]}/${projectName}
spring.datasource.username=username
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
`;
        } else if (framework === 'Quarkus') {
          appConfig = `# Application Configuration
quarkus.http.port=8080
quarkus.application.name=${projectName}

# Database Configuration  
quarkus.datasource.db-kind=${dbConfig.databaseType.toLowerCase()}
quarkus.datasource.username=username
quarkus.datasource.password=password
quarkus.datasource.jdbc.url=jdbc:${dbConfig.databaseType.toLowerCase()}://localhost:${defaultPorts[dbConfig.databaseType]}/${projectName}
quarkus.hibernate-orm.database.generation=update
`;
        } else if (framework === 'Micronaut') {
          appConfig = `# Application Configuration
micronaut:
  application:
    name: ${projectName}
  server:
    port: 8080

# Database Configuration
datasources:
  default:
    url: jdbc:${dbConfig.databaseType.toLowerCase()}://localhost:${defaultPorts[dbConfig.databaseType]}/${projectName}
    username: username
    password: password
    driverClassName: ${dbConfig.databaseType === 'PostgreSQL' ? 'org.postgresql.Driver' : dbConfig.databaseType === 'MySQL' ? 'com.mysql.cj.jdbc.Driver' : 'org.sqlite.JDBC'}
jpa:
  default:
    entity-scan:
      packages: 'com.example'
    properties:
      hibernate:
        hbm2ddl:
          auto: update
        show_sql: true
`;
        }
      } else {
        if (framework === 'Spring Boot') {
          appConfig = `# Application Configuration
server.port=8080
spring.application.name=${projectName}
`;
        } else if (framework === 'Quarkus') {
          appConfig = `# Application Configuration
quarkus.http.port=8080
quarkus.application.name=${projectName}
`;
        } else if (framework === 'Micronaut') {
          appConfig = `# Application Configuration
micronaut:
  application:
    name: ${projectName}
  server:
    port: 8080
`;
        }
      }
      
      const configFileName = framework === 'Micronaut' ? 'application.yml' : 'application.properties';
      fs.writeFileSync(path.join(projectPath, 'src', 'main', 'resources', configFileName), appConfig);
      
    } else if (isGoFramework) {
      // Create Go source files
      let mainGoContent = '';
      
      if (framework === 'Gin') {
        mainGoContent = `package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	godotenv.Load()

	// Create Gin router
	r := gin.Default()

	// Routes
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, World!",
		})
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"message": "Gin server is running",
		})
	})

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
`;
      } else if (framework === 'Echo') {
        mainGoContent = `package main

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	godotenv.Load()

	// Create Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"message": "Hello, World!",
		})
	})

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status":  "healthy",
			"message": "Echo server is running",
		})
	})

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	e.Logger.Fatal(e.Start(":" + port))
}
`;
      } else if (framework === 'Fiber') {
        mainGoContent = `package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	godotenv.Load()

	// Create Fiber app
	app := fiber.New()

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())

	// Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Hello, World!",
		})
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"message": "Fiber server is running",
		})
	})

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	app.Listen(":" + port)
}
`;
      }
      
      fs.writeFileSync(path.join(projectPath, 'main.go'), mainGoContent);
      
    } else {
      fs.writeFileSync(path.join(projectPath, 'index.js'), nodeBoilerplate[framework]);
    }

    if (addDatabase) {
      let envContent;
      if (isPythonFramework) {
        const defaultPorts = {
          MongoDB: 27017,
          PostgreSQL: 5432,
          MySQL: 3306,
          SQLite: 'N/A (file-based)'
        };
        
        envContent = `# Database Configuration
DB_TYPE=${dbConfig.databaseType || 'your_db_type'}
DB_HOST=localhost
DB_PORT=${defaultPorts[dbConfig.databaseType] || 5432}
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name

# Application Configuration
DEBUG=True
PORT=${framework === 'Flask' ? 5000 : framework === 'FastAPI' ? 8000 : 8000}
SECRET_KEY=your-secret-key-here
`;
      } else if (isJavaFramework) {
        const defaultPorts = {
          MongoDB: 27017,
          PostgreSQL: 5432,
          MySQL: 3306,
          SQLite: 'N/A (file-based)'
        };
        
        envContent = `# Database Configuration
DB_TYPE=${dbConfig.databaseType || 'your_db_type'}
DB_HOST=localhost
DB_PORT=${defaultPorts[dbConfig.databaseType] || 5432}
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name

# Application Configuration
SERVER_PORT=8080
PROFILE=development
JAVA_OPTS=-Xmx512m
`;
      } else if (isGoFramework) {
        const defaultPorts = {
          MongoDB: 27017,
          PostgreSQL: 5432,
          MySQL: 3306,
          SQLite: 'N/A (file-based)'
        };
        
        envContent = `# Database Configuration
DB_TYPE=${dbConfig.databaseType || 'your_db_type'}
DB_HOST=localhost
DB_PORT=${defaultPorts[dbConfig.databaseType] || 5432}
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name

# Application Configuration
PORT=8080
GO_ENV=development
GIN_MODE=debug
`;
      } else if (isDotNetFramework) {
        const defaultPorts = {
          MongoDB: 27017,
          PostgreSQL: 5432,
          MySQL: 3306,
          SQLite: 'N/A (file-based)'
        };
        
        envContent = `# Database Configuration
DB_TYPE=${dbConfig.databaseType || 'your_db_type'}
DB_HOST=localhost
DB_PORT=${defaultPorts[dbConfig.databaseType] || 5432}
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name

# Application Configuration
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://localhost:5000
LOGGING__LOGLEVEL__DEFAULT=Information
`;
      } else {
        envContent = `# Database Configuration
DB_TYPE=${dbConfig.databaseType || 'your_db_type'}
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name

# Application Configuration
PORT=3000
NODE_ENV=development
`;
      }
      fs.writeFileSync(path.join(projectPath, '.env'), envContent);
    }

    // Git initialization
    if (versionControl) {
      execSync(`git init ${projectName} > /dev/null 2>&1`);
      
      let gitignoreContent;
      if (isPythonFramework) {
        gitignoreContent = `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
env/
ENV/
.env
.venv

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite3

# Logs
*.log
`;
      } else if (isJavaFramework) {
        gitignoreContent = `# Java
*.class
*.jar
*.war
*.ear
*.nar
hs_err_pid*
replay_pid*

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# Gradle
.gradle
**/build/
!src/**/build/
gradle-app.setting
!gradle-wrapper.jar
.gradletasknamecache

# IDE
.vscode/
.idea/
*.iws
*.iml
*.ipr
*.swp
*.swo
*~
nbproject/
.nb-gradle/

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite3

# Logs
*.log
logs/

# Spring Boot
spring-boot-*.log
spring.log
`;
      } else if (isGoFramework) {
        gitignoreContent = `# Go
# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, built with 'go test -c'
*.test

# Output of the go coverage tool
*.out

# Go workspace file
go.work

# Dependency directories
vendor/

# Go module download cache
go/pkg/mod/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite3

# Logs
*.log
logs/

# Build output
/dist
/build
/bin
`;
      } else if (isDotNetFramework) {
        gitignoreContent = `# .NET
bin/
obj/
*.user
*.suo
*.userprefs
*.sln.docstates

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/

# Visual Studio
.vs/
*.rsuser
*.suo
*.user
*.userosscache
*.sln.docstates

# Visual Studio Code
.vscode/

# JetBrains Rider
.idea/
*.sln.iml

# User-specific files (MonoDevelop/Xamarin Studio)
*.userprefs

# Mono auto generated files
mono_crash.*

# Build Results of an ATL Project
[Dd]ebugPS/
[Rr]eleasePS/
dlldata.c

# .NET Core
project.lock.json
project.fragment.lock.json
artifacts/

# NuGet
*.nupkg
*.snupkg
.nuget/
packages/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite3

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db

# IDE
*.swp
*.swo
*~
`;
      } else {
        gitignoreContent = `# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
`;
      }
      fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignoreContent);
    }

    // Write configuration files based on framework type
    if (!isPythonFramework && !isJavaFramework && !isGoFramework && !isDotNetFramework) {
      // Write Prettier configuration for Node.js projects
      const prettierConfig = {
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 80,
        tabWidth: 2,
      };

      // Write ESLint configuration for Node.js projects
      const eslintConfig = {
        env: {
          node: true,
          es6: true,
        },
        extends: 'eslint:recommended',
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: 'module',
        },
        rules: {
          indent: ['error', 2],
          'linebreak-style': ['error', 'unix'],
          quotes: ['error', 'single'],
          semi: ['error', 'always'],
        },
      };
      
      fs.writeFileSync(
        path.join(projectPath, '.prettierrc.json'),
        JSON.stringify(prettierConfig, null, 2)
      );

      fs.writeFileSync(
        path.join(projectPath, '.eslintrc.cjs'),
        JSON.stringify(eslintConfig, null, 2)
      );
    } else if (isPythonFramework) {
      // Write Python-specific configuration files
      
      // Create a simple Python formatter configuration (using black)
      const pyprojectConfig = `
# Black code formatter configuration
[tool.black]
line-length = 88
target-version = ['py38']
include = '\.pyi?$'
extend-exclude = '''
# A regex preceded by 'r' to avoid implicit string concatenation
r"""
/(
  (
      \.eggs
    | \.git
    | \.hg
    | \.mypy_cache
    | \.tox
    | \.venv
    | _build
    | buck-out
    | build
    | dist
    | venv
  )/
)
"""

# Flake8 linting configuration
[tool.flake8]
max-line-length = 88
ignore = ['E203', 'W503']
`;
      fs.appendFileSync(path.join(projectPath, 'pyproject.toml'), pyprojectConfig);
      
      // Add development dependencies to requirements.txt
      const devRequirements = `
# Development dependencies
black==23.12.1
flake8==7.0.0
pytest==7.4.4
`;
      fs.appendFileSync(path.join(projectPath, 'requirements.txt'), devRequirements);
    } else if (isGoFramework) {
      // Create Go project structure
      
      // Initialize Go module
      const moduleName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const goModContent = `module ${moduleName}

go 1.21
`;
      fs.writeFileSync(path.join(projectPath, 'go.mod'), goModContent);
      
      // Create dependencies list
      const goDeps = [...goDependencies[framework]];
      
      // Add database dependencies if needed
      if (addDatabase && dbConfig.databaseType) {
        goDeps.push(...databaseDependencies.go[dbConfig.databaseType]);
      }
      
      // Add environment variable support
      goDeps.push('github.com/joho/godotenv@v1.4.0');
      
      // Update go.mod with dependencies
      let goModWithDeps = goModContent + '\nrequire (\n';
      goDeps.forEach(dep => {
        const [pkg, version] = dep.split('@');
        goModWithDeps += `\t${pkg} ${version}\n`;
      });
      goModWithDeps += ')\n';
      
      fs.writeFileSync(path.join(projectPath, 'go.mod'), goModWithDeps);
      
      // Create basic Go project structure
      fs.mkdirSync(path.join(projectPath, 'internal'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'cmd'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'pkg'), { recursive: true });
    } else if (isDotNetFramework) {
      // Create .NET project structure
      const frameInfo = dotnetFrameworkInfo[framework];
      
      // Create .NET project using dotnet CLI
      const projectNameClean = projectName.replace(/[^a-zA-Z0-9]/g, '');
      
      try {
        // Create the project using dotnet new
        execSync(`dotnet new ${frameInfo.template} -n ${projectNameClean} -f ${frameInfo.framework} --force`, {
          cwd: projectPath,
          stdio: 'pipe'
        });
        
        // Move files from subdirectory to main directory
        const subDir = path.join(projectPath, projectNameClean);
        if (fs.existsSync(subDir)) {
          const files = fs.readdirSync(subDir);
          files.forEach(file => {
            fs.renameSync(path.join(subDir, file), path.join(projectPath, file));
          });
          fs.rmdirSync(subDir);
        }
        
      } catch (error) {
        // Fallback: create project structure manually
        console.log(chalk.yellow('⚠️  Could not use dotnet CLI, creating basic structure manually'));
        
        // Create basic .csproj file
        const csprojContent = `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>${frameInfo.framework}</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
  </ItemGroup>

</Project>`;
        
        fs.writeFileSync(path.join(projectPath, `${projectNameClean}.csproj`), csprojContent);
        
        // Create basic Program.cs
        let programContent = '';
        if (framework === 'ASP.NET Core') {
          programContent = `using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
`;
        } else if (framework === 'Minimal APIs') {
          programContent = `var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Define endpoints
app.MapGet("/", () => new { message = "Hello, World!" });
app.MapGet("/health", () => new { status = "healthy", message = ".NET server is running" });

app.Run();
`;
        } else if (framework === 'Carter') {
          programContent = `using Carter;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCarter();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapCarter();

app.Run();
`;
        }
        
        fs.writeFileSync(path.join(projectPath, 'Program.cs'), programContent);
        
        // Create Controllers directory for ASP.NET Core
        if (framework === 'ASP.NET Core') {
          fs.mkdirSync(path.join(projectPath, 'Controllers'), { recursive: true });
          
          const controllerContent = `using Microsoft.AspNetCore.Mvc;

namespace ${projectNameClean}.Controllers;

[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    [HttpGet("/")]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello, World!" });
    }
    
    [HttpGet("/health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", message = "ASP.NET Core server is running" });
    }
}
`;
          fs.writeFileSync(path.join(projectPath, 'Controllers', 'HomeController.cs'), controllerContent);
        }
        
        // Create Carter module for Carter framework
        if (framework === 'Carter') {
          fs.mkdirSync(path.join(projectPath, 'Modules'), { recursive: true });
          
          const moduleContent = `using Carter;

namespace ${projectNameClean}.Modules;

public class HomeModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/", () => new { message = "Hello, World!" });
        app.MapGet("/health", () => new { status = "healthy", message = "Carter server is running" });
    }
}
`;
          fs.writeFileSync(path.join(projectPath, 'Modules', 'HomeModule.cs'), moduleContent);
        }
      }
      
      // Add database packages if selected
      if (addDatabase && dbConfig.databaseType) {
        const dbPackages = databaseDependencies.dotnet[dbConfig.databaseType];
        if (dbPackages) {
          dbPackages.forEach(pkg => {
            try {
              execSync(`dotnet add package ${pkg}`, {
                cwd: projectPath,
                stdio: 'pipe'
              });
            } catch (error) {
              console.log(chalk.yellow(`⚠️  Could not add package ${pkg} automatically`));
            }
          });
        }
      }
      
      // Add framework-specific packages
      if (frameInfo.packages && frameInfo.packages.length > 0) {
        frameInfo.packages.forEach(pkg => {
          try {
            execSync(`dotnet add package ${pkg}`, {
              cwd: projectPath,
              stdio: 'pipe'
            });
          } catch (error) {
            console.log(chalk.yellow(`⚠️  Could not add package ${pkg} automatically`));
          }
        });
      }
    }

    // Create README.md based on framework type
    if (isPythonFramework) {
      // Create README.md for Python projects
      const pythonReadme = `# ${projectName}

A ${framework} backend project created with Backend Starter CLI.

## Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Clone or navigate to the project directory:
   \`\`\`bash
   cd ${projectName}
   \`\`\`

2. Run the setup script to create virtual environment and install dependencies:
   \`\`\`bash
   chmod +x setup.sh && ./setup.sh
   \`\`\`

3. Activate the virtual environment:
   \`\`\`bash
   source venv/bin/activate
   \`\`\`

## Running the Application

\`\`\`bash
python main.py
\`\`\`

${framework === 'FastAPI' ? '\nAlternatively, you can use uvicorn directly:\n\`\`\`bash\nuvicorn main:app --reload\n\`\`\`' : ''}

## API Endpoints

- \`GET /\` - Hello World endpoint
- \`GET /health\` - Health check endpoint

## Development

### Code Formatting
\`\`\`bash
black .
\`\`\`

### Linting
\`\`\`bash
flake8 .
\`\`\`

### Testing
\`\`\`bash
pytest
\`\`\`

## Environment Variables

Copy \`.env\` and update the configuration as needed:

- \`DEBUG\`: Set to \`True\` for development
- \`PORT\`: Port number for the application
- \`SECRET_KEY\`: Secret key for the application
${addDatabase ? '\n### Database Configuration\n\n- `DB_TYPE`: Database type\n- `DB_HOST`: Database host\n- `DB_PORT`: Database port\n- `DB_USER`: Database username\n- `DB_PASSWORD`: Database password\n- `DB_NAME`: Database name' : ''}

## Project Structure

\`\`\`
${projectName}/
├── main.py              # Main application file
├── requirements.txt     # Python dependencies
├── pyproject.toml      # Project configuration
├── setup.sh            # Setup script
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── README.md           # This file
└── venv/               # Virtual environment (created after setup)
\`\`\`

## License

This project is licensed under the MIT License.
`;
      fs.writeFileSync(path.join(projectPath, 'README.md'), pythonReadme);
    } else if (isJavaFramework) {
      // Create README.md for Java projects
      const javaReadme = `# ${projectName}

A ${framework} backend project created with Backend Starter CLI.

## Setup

### Prerequisites
- Java 11 or higher
- Maven 3.6+ (or use the included Maven wrapper)

### Installation

1. Navigate to the project directory:
   \`\`\`bash
   cd ${projectName}
   \`\`\`

2. Build the project:
   \`\`\`bash
   ./mvnw clean install
   \`\`\`

## Running the Application

### Using Maven:
\`\`\`bash
./mvnw spring-boot:run
\`\`\`

### Using Java directly:
\`\`\`bash
java -jar target/${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${javaFrameworkInfo[framework].version}.jar
\`\`\`

## API Endpoints

- \`GET /\` - Hello World endpoint
- \`GET /health\` - Health check endpoint
${framework === 'Spring Boot' ? '- `GET /actuator/health` - Spring Boot Actuator health endpoint' : ''}

## Development

### Build
\`\`\`bash
./mvnw clean compile
\`\`\`

### Test
\`\`\`bash
./mvnw test
\`\`\`

### Package
\`\`\`bash
./mvnw clean package
\`\`\`

## Configuration

Configuration is managed through \`src/main/resources/application.properties\` (or \`application.yml\` for Micronaut).

### Application Settings
- \`server.port\`: Port number for the application (default: 8080)
${addDatabase ? '\n### Database Configuration\n\n- Database connection details are configured in the application properties file\n- Default database: ' + dbConfig.databaseType + '\n- Update the connection details in the properties file' : ''}

## Project Structure

\`\`\`
${projectName}/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── Application.java    # Main application class
│   │   └── resources/
│   │       └── application.properties      # Configuration file
│   └── test/
│       └── java/
│           └── com/
│               └── example/               # Test classes
├── target/                                # Build output (generated)
├── .mvn/                                  # Maven wrapper
├── mvnw                                   # Maven wrapper script (Unix)
├── mvnw.cmd                              # Maven wrapper script (Windows)
├── pom.xml                               # Maven project file
├── .gitignore                            # Git ignore file
├── README.md                             # This file
└── .env                                  # Environment variables
\`\`\`

## Technologies Used

- **Framework**: ${framework}
- **Build Tool**: Maven
- **Java Version**: ${javaFrameworkInfo[framework].javaVersion}
${addDatabase ? '- **Database**: ' + dbConfig.databaseType : ''}

## License

This project is licensed under the MIT License.
`;
      fs.writeFileSync(path.join(projectPath, 'README.md'), javaReadme);
    } else if (isGoFramework) {
      // Create README.md for Go projects
      const goReadme = `# ${projectName}

A ${framework} backend project created with Backend Starter CLI.

## Setup

### Prerequisites
- Go 1.19 or higher

### Installation

1. Navigate to the project directory:
   \`\`\`bash
   cd ${projectName}
   \`\`\`

2. Download dependencies:
   \`\`\`bash
   go mod tidy
   \`\`\`

## Running the Application

### Development mode:
\`\`\`bash
go run main.go
\`\`\`

### Build and run:
\`\`\`bash
go build -o app
./app
\`\`\`

## API Endpoints

- \`GET /\` - Hello World endpoint
- \`GET /health\` - Health check endpoint

## Development

### Build
\`\`\`bash
go build
\`\`\`

### Test
\`\`\`bash
go test ./...
\`\`\`

### Format code
\`\`\`bash
go fmt ./...
\`\`\`

### Lint
\`\`\`bash
golangci-lint run
\`\`\`

## Configuration

Configuration is managed through environment variables in the \`.env\` file.

### Application Settings
- \`PORT\`: Port number for the application (default: 8080)
- \`GO_ENV\`: Environment mode (development/production)
${framework === 'Gin' ? '- `GIN_MODE`: Gin mode (debug/release)' : ''}
${addDatabase ? '\n### Database Configuration\n\n- Database connection details are configured via environment variables\n- Default database: ' + dbConfig.databaseType + '\n- Update the connection details in the .env file' : ''}

## Project Structure

\`\`\`
${projectName}/
├── main.go              # Main application file
├── go.mod               # Go module file
├── go.sum               # Go dependencies checksum (auto-generated)
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── README.md            # This file
├── cmd/                 # Command line applications
├── internal/            # Private application code
└── pkg/                 # Public library code
\`\`\`

## Technologies Used

- **Language**: Go ${framework === 'Gin' ? '\n- **Framework**: Gin (HTTP web framework)' : framework === 'Echo' ? '\n- **Framework**: Echo (high performance, extensible, minimalist web framework)' : '\n- **Framework**: Fiber (Express inspired web framework)'}
- **Go Version**: 1.21+
${addDatabase ? '- **Database**: ' + dbConfig.databaseType : ''}
${addDatabase && ['PostgreSQL', 'MySQL', 'SQLite'].includes(dbConfig.databaseType) ? '\n- **ORM**: GORM' : ''}

## Useful Commands

\`\`\`bash
# Run with live reload (install air first: go install github.com/cosmtrek/air@latest)
air

# Build for production
go build -ldflags="-s -w" -o app

# Cross-compile for different platforms
GOOS=linux GOARCH=amd64 go build -o app-linux
GOOS=windows GOARCH=amd64 go build -o app.exe
\`\`\`

## License

This project is licensed under the MIT License.
`;
      fs.writeFileSync(path.join(projectPath, 'README.md'), goReadme);
    } else if (isDotNetFramework) {
      // Create README.md for .NET projects
      const dotnetReadme = `# ${projectName}

A ${framework} backend project created with Backend Starter CLI.

## Setup

### Prerequisites
- .NET 8.0 SDK or higher

### Installation

1. Navigate to the project directory:
   \`\`\`bash
   cd ${projectName}
   \`\`\`

2. Restore dependencies:
   \`\`\`bash
   dotnet restore
   \`\`\`

## Running the Application

### Development mode:
\`\`\`bash
dotnet run
\`\`\`

### Build and run:
\`\`\`bash
dotnet build
dotnet run --no-build
\`\`\`

## API Endpoints

- \`GET /\` - Hello World endpoint
- \`GET /health\` - Health check endpoint
${framework === 'ASP.NET Core' ? '- `GET /swagger` - Swagger UI (in development mode)' : framework === 'Minimal APIs' ? '- `GET /swagger` - Swagger UI (in development mode)' : ''}

## Development

### Build
\`\`\`bash
dotnet build
\`\`\`

### Test
\`\`\`bash
dotnet test
\`\`\`

### Watch (live reload)
\`\`\`bash
dotnet watch run
\`\`\`

### Format code
\`\`\`bash
dotnet format
\`\`\`

## Configuration

Configuration is managed through \`appsettings.json\` and environment variables.

### Application Settings
- \`ASPNETCORE_ENVIRONMENT\`: Environment mode (Development/Production)
- \`ASPNETCORE_URLS\`: URLs to bind to (default: http://localhost:5000)
- \`LOGGING__LOGLEVEL__DEFAULT\`: Default log level
${addDatabase ? '\n### Database Configuration\n\n- Database connection details are configured in appsettings.json\n- Default database: ' + dbConfig.databaseType + '\n- Update the connection string in the configuration file' : ''}

## Project Structure

\`\`\`
${projectName}/
${framework === 'ASP.NET Core' ? '├── Controllers/          # API controllers\n' : ''}${framework === 'Carter' ? '├── Modules/             # Carter modules\n' : ''}├── Program.cs            # Application entry point
├── ${projectName.replace(/[^a-zA-Z0-9]/g, '')}.csproj      # Project file
├── appsettings.json      # Application settings
├── appsettings.Development.json # Development settings
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── README.md             # This file
└── bin/                  # Build output (generated)
\`\`\`

## Technologies Used

- **Framework**: ${framework}
- **.NET Version**: 8.0
- **Language**: C#
${addDatabase ? '- **Database**: ' + dbConfig.databaseType : ''}
${addDatabase && ['PostgreSQL', 'MySQL', 'SQLite'].includes(dbConfig.databaseType) ? '\n- **ORM**: Entity Framework Core' : ''}

## Useful Commands

\`\`\`bash
# Create a new controller (ASP.NET Core)
dotnet aspnet-codegenerator controller -name MyController -api

# Add a new NuGet package
dotnet add package PackageName

# Remove a NuGet package
dotnet remove package PackageName

# Publish for production
dotnet publish -c Release

# Run with specific environment
dotnet run --environment Production

# Generate EF Core migrations (if using Entity Framework)
dotnet ef migrations add InitialCreate
dotnet ef database update
\`\`\`

${framework === 'ASP.NET Core' || framework === 'Minimal APIs' ? '## Swagger/OpenAPI\n\nThis project includes Swagger/OpenAPI documentation. In development mode, navigate to:\n- Swagger UI: `http://localhost:5000/swagger`\n- OpenAPI spec: `http://localhost:5000/swagger/v1/swagger.json`\n' : ''}
## License

This project is licensed under the MIT License.
`;
      fs.writeFileSync(path.join(projectPath, 'README.md'), dotnetReadme);
    } else {
      // Create README.md for Node.js projects
      const nodeReadme = `# ${projectName}

A ${framework} backend project created with Backend Starter CLI.

## Setup

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. Navigate to the project directory:
   \`\`\`bash
   cd ${projectName}
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

## Running the Application

\`\`\`bash
npm run dev
\`\`\`

Or:

\`\`\`bash
npm start
\`\`\`

## Development

### Code Formatting
\`\`\`bash
npm run format
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

## Environment Variables

Copy \`.env\` and update the configuration as needed:

- \`PORT\`: Port number for the application
- \`NODE_ENV\`: Environment (development/production)
${addDatabase ? '\n### Database Configuration\n\n- `DB_TYPE`: Database type\n- `DB_HOST`: Database host\n- `DB_PORT`: Database port\n- `DB_USER`: Database username\n- `DB_PASSWORD`: Database password\n- `DB_NAME`: Database name' : ''}

## Project Structure

\`\`\`
${projectName}/
├── index.js            # Main application file
├── package.json        # Project dependencies and scripts
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── .prettierrc.json    # Prettier configuration
├── .eslintrc.cjs       # ESLint configuration
├── README.md           # This file
└── node_modules/       # Dependencies (created after npm install)
\`\`\`

## License

This project is licensed under the ISC License.
`;
      fs.writeFileSync(path.join(projectPath, 'README.md'), nodeReadme);
    }

    console.log(chalk.white(`\nScaffolding project in ${projectPath}`));

    // Provide framework-specific instructions
    if (isPythonFramework) {
      console.log(`\n${chalk.green('✅ Python project created successfully!')}\n`);
      console.log('Next steps:');
      console.log(`  ${chalk.green(`cd ${projectName}`)}`);
      console.log(`  ${chalk.green('chmod +x setup.sh && ./setup.sh')}`);
      console.log(`  ${chalk.green('source venv/bin/activate')}`);
      
      if (framework === 'Flask') {
        console.log(`  ${chalk.green('python main.py')}`);
      } else if (framework === 'FastAPI') {
        console.log(`  ${chalk.green('python main.py')}`);
        console.log(`  ${chalk.gray('# or use: uvicorn main:app --reload')}`);
      } else if (framework === 'Django') {
        console.log(`  ${chalk.green('python main.py')}`);
        console.log(`  ${chalk.gray('# Note: For full Django setup, run: django-admin startproject')}`);
      }
      
      console.log(`\n${chalk.blue('💡 Tips:')}`);
      console.log(`  • Your virtual environment will be created in the 'venv' directory`);
      console.log(`  • Environment variables are in the '.env' file`);
      console.log(`  • Run 'deactivate' to exit the virtual environment`);
      
    } else if (isJavaFramework) {
      console.log(`\n${chalk.green('✅ Java project created successfully!')}\n`);
      console.log('Next steps:');
      console.log(`  ${chalk.green(`cd ${projectName}`)}`);
      
      if (!mavenAvailable) {
        console.log(`  ${chalk.yellow('⚠️  Maven not found - using Maven wrapper')}`);
      }
      
      console.log(`  ${chalk.green('./mvnw clean install')}`);
      
      if (framework === 'Spring Boot') {
        console.log(`  ${chalk.green('./mvnw spring-boot:run')}`);
      } else if (framework === 'Quarkus') {
        console.log(`  ${chalk.green('./mvnw quarkus:dev')}`);
        console.log(`  ${chalk.gray('# or: ./mvnw compile quarkus:dev')}`);
      } else if (framework === 'Micronaut') {
        console.log(`  ${chalk.green('./mvnw mn:run')}`);
        console.log(`  ${chalk.gray('# or: ./mvnw compile exec:java')}`);
      }
      
      console.log(`\n${chalk.blue('💡 Tips:')}`);
      console.log(`  • Application will run on port 8080 by default`);
      console.log(`  • Configuration is in src/main/resources/application.properties`);
      console.log(`  • Use './mvnw clean package' to build a JAR file`);
      if (framework === 'Spring Boot') {
        console.log(`  • Visit http://localhost:8080/actuator/health for health checks`);
      }
      
    } else if (isGoFramework) {
      console.log(`\n${chalk.green('✅ Go project created successfully!')}\n`);
      console.log('Next steps:');
      console.log(`  ${chalk.green(`cd ${projectName}`)}`);
      console.log(`  ${chalk.green('go mod tidy')}`);
      console.log(`  ${chalk.green('go run main.go')}`);
      
      console.log(`\n${chalk.blue('💡 Tips:')}`);
      console.log(`  • Application will run on port 8080 by default`);
      console.log(`  • Environment variables are in the '.env' file`);
      console.log(`  • Use 'go build' to create a binary`);
      console.log(`  • Install 'air' for live reload: go install github.com/cosmtrek/air@latest`);
      console.log(`  • Format code with: go fmt ./...`);
      
    } else if (isDotNetFramework) {
      console.log(`\n${chalk.green('✅ C# (.NET) project created successfully!')}\n`);
      console.log('Next steps:');
      console.log(`  ${chalk.green(`cd ${projectName}`)}`);
      console.log(`  ${chalk.green('dotnet restore')}`);
      console.log(`  ${chalk.green('dotnet run')}`);
      
      console.log(`\n${chalk.blue('💡 Tips:')}`);
      console.log(`  • Application will run on port 5000 by default`);
      console.log(`  • Environment variables are in the '.env' file`);
      console.log(`  • Use 'dotnet watch run' for live reload`);
      console.log(`  • Visit /swagger for API documentation (in development)`);
      console.log(`  • Use 'dotnet format' to format code`);
      console.log(`  • Use 'dotnet publish -c Release' for production build`);
      
    } else {
      console.log(`\n${chalk.green('✅ Node.js project created successfully!')}\n`);
      console.log('Next steps:');
      console.log(`  ${chalk.green(`cd ${projectName}`)}`);
      console.log(`  ${chalk.green('npm install')}`);
      console.log(`  ${chalk.green('npm run dev')}`);
    }

    console.log(chalk.green('\nHappy building! 🚀'));
  } catch (err) {
    if (err.name === 'ExitPromptError') {
      console.log(chalk.red('Prompt interrupted by user. Exiting...'));
    } else {
      console.error(chalk.red('Unexpected error occurred:'), err.message);
      console.error(err.stack);
    }
  }
}

setupProject();
