# Vercel Postgres Setup Guide

## Prerequisites
- Vercel account with the project already deployed
- Vercel CLI installed (`npm install -g vercel`)

## Steps to Set Up Vercel Postgres

### 1. Login to Vercel CLI
```bash
vercel login
```

### 2. Link Your Project
```bash
vercel link
```
Select your existing ScholarFlow project when prompted.

### 3. Create Postgres Database via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your ScholarFlow project
3. Go to the "Storage" tab
4. Click "Create Database" → Select "Postgres"
5. Choose a database name (e.g., "scholarflow-db")
6. Select your preferred region
7. Click "Create"

### 4. Pull Environment Variables
Once the database is created, pull the connection string:
```bash
vercel env pull .env.production.local
```

### 5. Update Prisma Schema for Production
The schema is already configured, but ensure your `.env` file has:
```
DATABASE_URL="your-vercel-postgres-connection-string"
```

### 6. Generate Prisma Client
```bash
npx prisma generate
```

### 7. Push Schema to Production Database
```bash
npx prisma db push
```

Or if you prefer migrations:
```bash
npx prisma migrate deploy
```

### 8. Verify Connection
```bash
npx prisma studio
```

### 9. Update Environment Variables in Vercel
Make sure these are set in your Vercel project settings:
- `DATABASE_URL` (automatically set by Vercel Postgres)
- `NEXTAUTH_URL` (https://scholarflow-g2t4.vercel.app)
- `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- `ORCID_CLIENT_ID` and `ORCID_CLIENT_SECRET`

### 10. Redeploy
```bash
vercel --prod
```

## Troubleshooting

### Connection Issues
- Ensure your IP is whitelisted (Vercel handles this automatically)
- Check that the DATABASE_URL includes `?pgbouncer=true&connection_limit=1` for serverless

### Migration Issues
- Use `npx prisma db push` for initial setup instead of migrations
- For production, always use `prisma migrate deploy` not `prisma migrate dev`

### Environment Variable Issues
- Make sure to restart your dev server after changing .env files
- Use `vercel env pull` to sync with latest production variables