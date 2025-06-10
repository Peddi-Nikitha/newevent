const fs = require('fs');
const path = require('path');

const envContent = `DATABASE_URL="postgresql://neondb_owner:npg_tPq4Rkf1Lsgd@ep-polished-forest-abs4zlmc-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-for-next-auth"
`;

const envPath = path.join(__dirname, '..', '.env');

fs.writeFileSync(envPath, envContent);
console.log('.env file created successfully!'); 