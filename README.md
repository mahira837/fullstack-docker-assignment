# Full-Stack Docker Assignment

A Node.js/Express frontend sends form submissions to a Python/Flask backend. Docker Compose builds and runs both services on the same private network.

## Project structure

```text
fullstack-docker-assignment/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── style.css
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── backend/
│   ├── Dockerfile
│   ├── app.py
│   └── requirements.txt
├── docker-compose.yaml
├── .gitignore
└── README.md
```

## Run locally with Docker Compose

1. Install and start Docker Desktop.
2. Open a terminal in this project folder.
3. In `docker-compose.yaml`, replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username.
4. Build and start both containers:

   ```bash
   docker compose up --build -d
   ```

5. Open <http://localhost:3000>.
6. Fill in the form and click **Submit**. Express receives the form, forwards JSON to Flask at `http://backend:5000`, and displays Flask's response.
7. Check containers and logs:

   ```bash
   docker compose ps
   docker compose logs -f
   ```

8. Stop the application:

   ```bash
   docker compose down
   ```

## Push images to Docker Hub

Create a Docker Hub account first. Replace `YOUR_DOCKERHUB_USERNAME` in the commands:

```bash
docker login
docker compose build
docker push YOUR_DOCKERHUB_USERNAME/fullstack-flask-backend:1.0
docker push YOUR_DOCKERHUB_USERNAME/fullstack-express-frontend:1.0
```

If the images were built with a different local tag, tag and push them explicitly:

```bash
docker tag fullstack-docker-assignment-backend:latest YOUR_DOCKERHUB_USERNAME/fullstack-flask-backend:1.0
docker tag fullstack-docker-assignment-frontend:latest YOUR_DOCKERHUB_USERNAME/fullstack-express-frontend:1.0
docker push YOUR_DOCKERHUB_USERNAME/fullstack-flask-backend:1.0
docker push YOUR_DOCKERHUB_USERNAME/fullstack-express-frontend:1.0
```

## Push code to GitHub

Create an empty repository on GitHub (do not add a README if you already have this one), then run from the project folder:

```bash
git init
git add .
git commit -m "Build Express and Flask app with Docker Compose"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

## Important networking note

Inside the Compose network, the frontend reaches Flask using the service name `backend`, not `localhost`. The browser only talks to Express on `localhost:3000`; Express acts as a server-side proxy to Flask. This avoids browser DNS/CORS problems and keeps the backend port private to the Compose network.

## Expected result

After submitting the form, the page should show:

> Your form was successfully processed by Flask.

This demo validates and returns the submitted data; it does not save submissions permanently to a database.
