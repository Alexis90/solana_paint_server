# Project Setup Guide

## Installation

### Requirements

- [Docker](https://www.docker.com/) - Required to run the application in a containerized environment.
- Linux Operating System - Recommended for compatibility.
- [nvm](https://github.com/nvm-sh/nvm) - Node Version Manager to select and manage Node.js version 18.

---

## Quick Start

1. Navigate to the project folder:

```bash
cd /path/to/project
```

2. Start the Docker containers:

```bash
docker-compose up
```

3. Verify the running containers:

```bash
docker ps
```

4. Access the running container (replace `c059b6e034ff` with your container ID):

```bash
docker exec -it c059b6e034ff sh
```

5. Run database migrations inside the container:

```bash
npm run migrate
```

---

## Notes

- Ensure Docker and nvm are installed and properly configured before starting the setup.
- Replace the container ID in step 4 with the actual ID of the running container obtained in step 3.
- The migration command prepares the database schema necessary for the application.
- Server exposes at port 8000.
