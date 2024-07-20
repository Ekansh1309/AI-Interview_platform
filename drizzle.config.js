/** @type { import("drizzle-kit").Config } */
require('dotenv').config({ path: '.env.local' });
const DBurl = process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL;

export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: DBurl  
    }
  };
  