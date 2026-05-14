# Assignment 2 - Jenkins CI/CD Pipeline

**Name:** Sonam Zangmo  
**Student ID:** 02240365  
**Course:** DSO101 - Continuous Integration and Continuous Deployment

---

## Overview

Configured a Jenkins pipeline to automate build, test, and deployment of the To-Do List app from Assignment 1.

---

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| Checkout | Pulls code from GitHub |
| Install Backend | Runs `npm install` in backend |
| Install Frontend | Runs `npm install` in frontend |
| Build Frontend | Compiles React app |
| Build Backend | Confirms backend is ready |
| Test Backend | Runs 8 Jest unit tests |
| Test Frontend | Runs 9 Jest unit tests |
| Deploy | Builds & pushes Docker images |

---

## How the Pipeline Was Configured

1. Installed Jenkins via Homebrew on Mac (`brew install jenkins-lts`)
2. Installed plugins: NodeJS, Pipeline, GitHub Integration, Docker Pipeline
3. Configured NodeJS tool in Manage Jenkins → Tools (name: `NodeJS`)
4. Added GitHub credentials (ID: `github-creds`) using Personal Access Token
5. Added Docker Hub credentials (ID: `docker-hub-creds`)
6. Created Pipeline job pointing to `Jenkinsfile` in GitHub repo
7. Tests use Jest with mocked PostgreSQL — no real DB needed in CI

📸 **Jenkins dashboard**

![SS](./a2images/dashboard.png)

📸 **Pipeline stages view showing all stages green**

![SS](./a2images/pipeline.png)

📸 **Console output showing 8 backend tests passed + 9 frontend tests passed**

![SS](./a2images/console.png)

📸 **Jenkins Test Results page**

![SS](./a2images/test.png)

📸 **Docker Hub showing be-todo and fe-todo images**

![SS](./a2images/hub.png)

---

## Test Results

**Backend (Jest + Supertest):** 8 tests passed
- GET /health, GET /api/tasks, POST /api/tasks, PUT /api/tasks/:id, DELETE /api/tasks/:id

**Frontend (Jest):** 9 tests passed
- Task structure, filter logic, toggle, delete, API URL validation

---

## Challenges Faced

- **Curly quotes:** TextEdit auto-corrected quotes in Jenkinsfile causing syntax errors. Fixed by using nano instead.
- **Docker not found:** Jenkins couldn't find Docker binary. Fixed by adding `/usr/local/bin` to Jenkins PATH and using full Docker path in shell commands.
- **Database in tests:** Backend connects to PostgreSQL on startup. Fixed by mocking `pg` in Jest tests so no real DB is needed.

---

## GitHub Repo

https://github.com/02240365/SonamZangmo_02240365_DSO101_A1.git