### MAML Editor

This repository contains the source code for the MAML Editor.

The MAML Editor consists of two microservices: backend and frontend.  
- The **backend** is built with Node.js and Express, using MongoDB for data storage.  
- The **frontend** is built with Next.js

Both services use TypeScript as the primary programming language.

## Pre-requisites
- Install [MongoDB Community Server](https://www.mongodb.com/docs/manual/installation/)
- Install [Node.js](https://nodejs.org/en/download)
- Install [Python (3.8.10 recommended)](https://www.python.org/downloads/)
- Install [Google Chrome](https://www.google.com/chrome/)
- Configure [Google OAuth consent screen](https://developers.google.com/workspace/guides/configure-oauth-consent) and get an OAuth 2.0 Client ID.
- Update ```GAUTH_CLIENT_ID``` at ```./backend/.env.dev```, and ```NEXT_PUBLIC_GOOGLE_CLIENT_ID``` at ```./frontend/.env.development```

### Backend
Run the following commands inside ```./backend```
```bash
npm install
npm run setup-system
npm run dev
```

### Frontend
Run the following commands inside ```./frontend```
```bash
npm install
npm run dev
```

If both are running successfully, visit ```http://localhost:8989``` to launch the MAML Editor.