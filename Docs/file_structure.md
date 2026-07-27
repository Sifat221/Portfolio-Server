# File Structure

Complete project directory tree:

```text
e:\CV\Server\
│
├── .env                            # Environment variables (secrets, DB URL)
├── .env.example                    # Template for .env
├── .gitignore                      # Git ignored files
├── package.json                    # Node.js dependencies & scripts
│
├── prisma/
│   ├── schema.prisma               # Prisma ORM PostgreSQL data models
│   └── seed.js                     # Database seeder (populates CV data)
│
├── src/
│   ├── server.js                   # Express app entry point
│   │
│   ├── config/
│   │   ├── prisma.js               # Prisma Client singleton
│   │   ├── cloudinary.js           # Cloudinary + Multer storage config
│   │   └── firebase.js             # Firebase Admin SDK initialization
│   │
│   ├── middleware/
│   │   ├── corsMiddleware.js       # CORS origin whitelist
│   │   ├── uploadMiddleware.js     # Cloudinary photo upload middleware
│   │   └── errorHandler.js        # Centralized error handler
│   │
│   ├── controllers/
│   │   ├── projectsController.js   # CRUD: Projects
│   │   ├── skillsController.js     # CRUD: Skills
│   │   ├── experienceController.js # CRUD: Experience
│   │   ├── contactController.js    # Contact form submit & list
│   │   └── mediaController.js      # Cloudinary upload & delete
│   │
│   └── routes/
│       ├── projectsRoutes.js       # /api/projects
│       ├── skillsRoutes.js         # /api/skills
│       ├── experienceRoutes.js     # /api/experience
│       ├── contactRoutes.js        # /api/contact
│       └── mediaRoutes.js          # /api/media
│
├── data/                           # JSON seed datasets (source of truth for seeding)
│   ├── personal.json
│   ├── skills.json
│   ├── experience.json
│   ├── education.json
│   ├── certifications.json
│   ├── achievements.json
│   ├── projects.json
│   ├── social_links.json
│   ├── testimonials.json
│   ├── navigation.json
│   └── seo.json
│
├── assets/                         # Static media assets (served at /assets)
│   ├── profile/
│   ├── hero/
│   ├── projects/
│   │   ├── medbridge/
│   │   ├── virtual-care/
│   │   ├── ecommerce/
│   │   ├── task-manager/
│   │   ├── petpassion/
│   │   ├── house-rental/
│   │   └── shop-management/
│   ├── certificates/
│   ├── achievements/
│   ├── logos/
│   ├── icons/
│   ├── illustrations/
│   ├── screenshots/
│   ├── resume/
│   └── documents/
│
└── Docs/                           # Project documentation (32 files)
    ├── README.md
    ├── project_brief.md
    ├── ...
    └── changelog.md
```
