# Assignment 3 - GitHub Actions CI/CD

**Name:** Sonam Zangmo  
**Student ID:** 02240365  
**Course:** DSO101 - Continuous Integration and Continuous Deployment

---

## Overview

Configured a GitHub Actions workflow to automatically build Docker images, push to Docker Hub, and deploy to Render.com on every git push.

---

## Workflow File

`.github/workflows/deploy.yml`

**Triggers:** Every push to `main` branch

**Steps:**
1. Checkout code
2. Login to Docker Hub
3. Build & push backend image (`be-todo:02240365`)
4. Build & push frontend image (`fe-todo:02240365`)
5. Trigger backend redeployment on Render via webhook
6. Trigger frontend redeployment on Render via webhook

---

## GitHub Secrets Used

| Secret | Purpose |
|--------|---------|
| `DOCKERHUB_USERNAME` | Docker Hub login |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `RENDER_BACKEND_HOOK` | Render deploy webhook for backend |
| `RENDER_FRONTEND_HOOK` | Render deploy webhook for frontend |

📸 **GitHub → Settings → Secrets showing all 4 secrets**

![SS](./a3images/secrets.png)
---

## Steps Taken

1. Created `.github/workflows/deploy.yml` in the repository
2. Generated Docker Hub Access Token (Account Settings → Security)
3. Got Render Deploy Hook URLs (Render → Service → Settings → Deploy Hook)
4. Added all 4 secrets to GitHub repository settings
5. Pushed code → workflow triggered automatically

📸 **GitHub Actions tab showing workflow running**

![SS](./a3images/action.png)

📸 **Docker Hub showing be-todo and fe-todo with updated push date**

![SS](./a3images/hub.png)

📸 **Render showing new deployment triggered by GitHub Actions**

![SS](./a3images/render.png)

---

## Challenges Faced

- **Render does not auto-redeploy** when a new Docker image is pushed to Docker Hub. Solved by calling the Render Deploy Hook URL using `curl` inside the workflow.
- **Dockerfile path:** Since Dockerfiles are inside subfolders (`todo-app/backend`), the build context path had to be explicitly set in the workflow commands.

---

## Learning Outcomes

- How to write GitHub Actions YAML workflow files
- How to store secrets securely in GitHub (never hardcode credentials)
- Difference between Docker Hub push and Render deployment (they are separate steps)
- How to chain build → push → deploy automatically on every git push

---

## Live Deployment

- **Frontend:** https://fe-todo-02240365.onrender.com
- **Backend:** https://be-todo-02240365.onrender.com 
- **GitHub Repo:** https://github.com/02240365/SonamZangmo_02240365_DSO101_A1.git