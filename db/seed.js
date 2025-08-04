const { Client } = require('pg');
require('dotenv').config();

// This script seeds the database with initial data
// It should be run after the database schema is set up
// Usage: node db/seed.js

if (process.env.NODE_ENV !== 'development') {
  console.warn("⚠️ Seeding only allowed in development environment.");
  process.exit(1);
}

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

const seedDatabase = async client => {
  console.log("Seeding...");
  // Clear existing data
  console.log("Dropping existing tables...");
  await client.query('DROP TABLE IF EXISTS messages CASCADE');
  await client.query('DROP TABLE IF EXISTS users CASCADE');

  // Create users and messages tables
  console.log("Creating tables...");
  await client.query(`  
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL
    );
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Populate users and messages
  console.log("Populating database...");  
  await client.query('BEGIN');
  try {

    console.log("Inserting users...");
    const users = ['john', 'jane', 'doe', 'alice', 'bob'];
    const userIds = [];

    for (const username of users) {
      const res = await client.query(
        'INSERT INTO users (username) VALUES ($1) RETURNING id',
        [username]
      );
      userIds.push(res.rows[0].id);
    }

    console.log("Inserting messages...");
    const messages = [
      { userId: userIds[0], content: 'Hello world!', timestamp: new Date(Date.now() - 1000 * 60 * 60) },  // 1 hour ago
      { userId: userIds[1], content: 'I have an opinion!', timestamp: new Date() },
      { userId: userIds[2], content: 'SQL is surprisingly elegant.', timestamp: new Date(Date.now() - 1000 * 60 * 15) }, // 15 mins ago
      { userId: userIds[3], content: 'I need attention :(', timestamp: new Date(Date.now() - 1000 * 60 * 20) }, // 20 mins ago
      { userId: userIds[4], content: 'Did you ever think about this? (inane thought)', timestamp: new Date(Date.now() - 1000 * 60 * 45) }, // 45 mins ago
    ];

    for (const msg of messages) {
      await client.query(
        'INSERT INTO messages (user_id, content, timestamp) VALUES ($1, $2, $3)',
        [msg.userId, msg.content, msg.timestamp]
      );
    }
    await client.query('COMMIT');
    console.log("Database seeded successfully"); 
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error populating database:", err);
  }
}

const main = async () => {  
  console.log('Connecting to database...');
  await client.connect();
  try {
    await seedDatabase(client);
  } finally {
    await client.end();
  }
  console.log("done");
};

main().catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
}); // Catch any errors in the main function