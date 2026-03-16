# Deployment Guide (Remote Host)

This guide outlines the steps to deploy the Hospital ERP application and synchronize the Supabase PostgreSQL database to the remote server.

## 1. Environment Details
- **Remote Host**: `61.19.112.242` (Port: `2233`)
- **Web App Path**: `/www/wwwroot/erp2`
- **Database Engine**: PostgreSQL 17.6 (Docker: `supabase_db_erp`)
- **Package Manager**: Bun
- **Process Manager**: PM2

---

## 2. Database Deployment (Synchronization)

When the database schema is updated locally, follow these steps to sync it to the remote server.

### Step 1: Create Local Backup
Ensure you are using the custom format (`-Fc`) to preserve triggers and complex objects.
```bash
docker exec -i supabase_db_erp pg_dump -U postgres -Fc postgres > erp_local.back
```

### Step 2: Transfer Backup to Remote
Use `pscp` to upload the backup file to the remote `/tmp` directory.
```bash
pscp.exe -P 2233 -l adminplk -pw [PASSWORD] erp_local.back 61.19.112.242:/tmp/erp_local.back
```

### Step 3: Restore Database on Remote
Reset the public schema and restore the data. Note that we only restore the `public` schema to avoid affecting internal Supabase system tables.
```bash
# Connect and execute:
docker exec -i supabase_db_erp psql -U postgres postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker exec -i supabase_db_erp pg_restore -U postgres -d postgres --no-owner --no-privileges --schema=public < /tmp/erp_local.back
```

### Step 4: Fix Permissions
After restoration, re-grant necessary permissions to Supabase roles.
```sql
GRANT ALL ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
```

---

## 3. Web Application Deployment

Once the database is synced, update the application codebase.

### Step 1: Push Local Changes
```bash
git add .
git commit -m "Your update message"
git push
```

### Step 2: Update and Build on Remote
Run these commands in the `/www/wwwroot/erp2` directory on the remote server:
```bash
# Pull latest code
git pull

# Install dependencies
bun install

# Build production bundle
bun run build

# Restart the application
pm2 restart erp2
```

---

## 4. Troubleshooting

- **Postgres Version Mismatch**: Ensure the local `pg_dump` and remote `pg_restore` versions match (Both should be v17).
- **PM2 Path Errors**: Use absolute paths for PM2 if the command is not found: `/home/adminplk/.nvm/versions/node/v22.12.0/bin/pm2`.
- **Trigger Errors**: If triggers are not working, check if they were restored into the `public` schema using:
  `SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema = 'public';`
