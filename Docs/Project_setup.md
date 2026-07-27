# Project Setup & Environment Requirements

## Prerequisites
- **Node.js:** v18.x or higher
- **npm:** v9.x or higher
- **PostgreSQL:** v15.x or higher (running locally or remote)
- **Flutter SDK (for mobile projects):** v3.19.x or higher
- **VS Code Extensions:** Flutter, Dart, Prisma, ESLint, Prettier, REST Client

## Installation

```bash
# 1. Clone repository
git clone https://github.com/Sifat221/Server.git
cd Server

# 2. Install Node.js dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Create PostgreSQL database and run migrations
npx prisma migrate dev --name init

# 5. (Optional) Open Prisma Studio GUI to browse data
npx prisma studio
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your real credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Server listen port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `DATABASE_URL` | PostgreSQL connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |

## Build & Run Commands

```bash
# Development (auto-restart with Nodemon)
npm run dev

# Production
npm start
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/skills` | Get all skills |
| POST | `/api/skills` | Create a skill |
| GET | `/api/experience` | Get work experience |
| POST | `/api/experience` | Create experience record |
| POST | `/api/contact` | Submit contact message |
| GET | `/api/contact` | Get all contact messages |
| POST | `/api/media/upload` | Upload photo to Cloudinary |
| DELETE | `/api/media/:publicId` | Delete photo from Cloudinary |
