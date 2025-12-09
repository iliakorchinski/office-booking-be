## Project setup

```bash
# Clone Repository
$ git clone <repo-url>

# Open Project Folder in IDE
cd <project-folder>

# Install dependencies
$ npm install
```

## Compile and run the project

```bash

# Create .env file in the root of the project. .env example:
DATABASE_URL="postgresql://postgres:pass123@localhost:5432/office_booking?schema=public"
NODE_ENV=development
JWT_SECRET=mysecret

# Development

# Brings up the database and API with migrations and seed data
$ docker compose up --build

#After ypu run command above you'll have two test users setup
# So you can just go to login page and login with one of the creds:
# 1. {Email: test@test.com, password: 123456} - USER ROLE
# 2. {Email: test2@test.com, password: 123456} - ADMIN ROLE

# If you change the Prisma schema:
# Add Migration
$ npx prisma migrate dev --name <my_new_migration>

# Rebuild and restart the Docker container to apply it
docker compose up --build

# Update Prisma client
$ npx prisma generate


```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
