# Render Deployment Guide

Deploying the **Sifat Khan Portfolio Server (TypeScript + Prisma + Cloudinary + Firebase)** to Render.

---

## Deployment Steps on Render (https://render.com)

### Step 1: Push Code to GitHub
Ensure all your project code is pushed to your GitHub repository (`github.com/Sifat221/Server`).

```bash
git add .
git commit -m "Complete TypeScript backend with Render deployment config"
git push origin main
```

---

### Step 2: Create a PostgreSQL Database on Render (Optional if using remote DB)
1. In Render Dashboard, click **New +** $\rightarrow$ **PostgreSQL**.
2. Name: `sifat-portfolio-db`
3. Region: **Singapore** (or closest to Bangladesh).
4. Plan: **Free**.
5. Once created, copy the **Internal Database URL** (or External Database URL).

---

### Step 3: Create a Web Service on Render
1. Click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository: `Sifat221/Server`.
3. Configure Service Details:
   - **Name:** `sifat-portfolio-backend`
   - **Region:** Singapore
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma db push && npm start`

---

### Step 4: Configure Environment Variables on Render
Under **Environment Variables**, add the following key-value pairs:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *Your Render PostgreSQL Connection String* |
| `CLOUDINARY_CLOUD_NAME` | `dru3wnly` |
| `CLOUDINARY_API_KEY` | `834864448471825` |
| `CLOUDINARY_API_SECRET` | `qLYVI5OXK0BktWSKLughpIyen4A` |
| `FIREBASE_PROJECT_ID` | `sifat-khan-joy` |
| `FIREBASE_API_KEY` | `AIzaSyClEYFnpPHhNLK_V3P-dZzZwSWMIpWMmZk` |
| `CORS_ORIGIN` | `*` |

---

### Step 5: (Optional) Seed the Database on Render
To populate your Render database with your CV data after initial build, run in Render Shell:

```bash
npm run prisma:seed
```

---

### Live API Verification Endpoint
Once deployed, test your live health endpoint:
```text
https://sifat-portfolio-backend.onrender.com/api/health
```
