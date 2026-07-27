# Project Architecture

## Technical Stack Overview

```mermaid
graph TD
    Client[Flutter App / Web Portfolio] -->|REST API / CORS| Server[Express.js Node Server]
    Server -->|Prisma ORM| DB[(PostgreSQL Database)]
    Server -->|Multer SDK| Cloudinary[(Cloudinary Media CDN)]
    Server -->|Firebase Admin| Firebase[(Firebase Services)]
```

## Backend Infrastructure
- **Core Web Framework:** Node.js with Express.js
- **Database & ORM:** PostgreSQL managed via Prisma ORM (`prisma/schema.prisma`)
- **Photo & Media Storage:** Cloudinary integration (`/api/media/upload`) with Multer
- **Firebase Services:** Firebase Admin SDK (`src/config/firebase.js`)
- **Security & Middleware:** Helmet, CORS origin validation, Morgan logger, centralized error handling
