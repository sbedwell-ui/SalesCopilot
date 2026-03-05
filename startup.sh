#!/bin/bash
# Azure App Service startup script

# DATABASE_URL is set via App Service Configuration (app settings)

# Run Prisma migrations
npx prisma migrate deploy

# Check if DB needs seeding (categories table empty = fresh DB)
NEEDS_SEED=$(npx tsx -e "
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const count = await p.category.count();
console.log(count === 0 ? 'yes' : 'no');
await p.\$disconnect();
")

if [ "$NEEDS_SEED" = "yes" ]; then
  echo "Seeding database..."
  npx tsx prisma/seed.ts
fi

# Start the server
export NODE_ENV=production
npx tsx server/index.ts
