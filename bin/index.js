#!/usr/bin / env node

'use strict';

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function setupProject() {
  try {
    console.log(chalk.blue('\nWelcome to the Backend Starter CLI! 🚀\n'));

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
        choices: ['Express', 'NestJS', 'Koa'],
        default: 'Express',
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
          choices: ['MongoDB', 'PostgreSQL', 'MySQL'],
          default: 'MongoDB',
        },
        {
          type: 'confirm',
          name: 'createEnvFile',
          message:
            'Do you want to create an .env file for your database configuration?',
          default: true,
        },
      ]);
    }

    const { projectName, framework, versionControl, addDatabase } = answers;
    const projectPath = path.resolve(process.cwd(), projectName);

    // Create project directory
    if (fs.existsSync(projectPath)) {
      console.log(
        chalk.red(`Directory "${projectName}" already exists! Exiting.`)
      );
      process.exit(1);
    }
    fs.mkdirSync(projectPath);

    // Framework dependencies
    const dependencies = {
      Express: ['express'],
      NestJS: ['@nestjs/core', '@nestjs/common', 'reflect-metadata'],
      Koa: ['koa'],
    };

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
        lint: 'eslint *.js --fix',
      },
      dependencies: {},
      devDependencies: {
        prettier: 'latest',
        eslint: 'latest',
      },
      type: 'module',
      keywords: [],
      author: '',
      license: 'ISC',
      description: '',
    };

    dependencies[framework].forEach((dep) => {
      packageJson.dependencies[dep] = 'latest'; // Add framework dependencies
    });

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Generate boilerplate code
    const boilerplate = {
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
    fs.writeFileSync(
      path.join(projectPath, 'index.js'),
      boilerplate[framework]
    );

    if (addDatabase) {
      const envContent = `
DB_TYPE=${dbConfig.databaseType || 'your_db_type'}
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name
    `;
      fs.writeFileSync(path.join(projectPath, '.env'), envContent);
    }

    // Git initialization
    if (versionControl) {
      execSync(`git init ${projectName} > /dev/null 2>&1`);
      fs.writeFileSync(
        path.join(projectPath, '.gitignore'),
        'node_modules\n.env\n'
      );
    }

    // Write Prettier configuration
    const prettierConfig = {
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 80,
      tabWidth: 2,
    };

    // Write ESLint configuration
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

    console.log(chalk.white(`\nScaffolding project in ${projectPath}`));

    console.log(`
Done. Now run:

  ${chalk.green(`cd ${projectName}`)}
  ${chalk.green('npm install')}
  ${chalk.green('npm run dev')}
`);

    console.log(chalk.green('\nHappy building! 🚀'));
  } catch (err) {
    if (err.name === 'ExitPromptError') {
      console.log(chalk.red('Prompt interrupted by user. Exiting...'));
    } else {
      console.error(chalk.red('Unexpected error occurred. Exiting...'));
    }
  }
}

setupProject();
