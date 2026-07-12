const { createClient } = require('@libsql/client');
const jwt = require('jsonwebtoken');

// Initialize SQLite client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

// JWT Secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize database tables
async function initDB() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS ue_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ue_code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        credits TEXT NOT NULL,
        description TEXT,
        proof TEXT,
        skills TEXT,
        bilan TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS contact_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        phone TEXT,
        linkedin TEXT,
        github TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create default admin user if not exists (username: admin, password: admin123)
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    try {
      await client.execute({
        sql: 'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        args: ['admin', passwordHash]
      });
    } catch (err) {
      // User already exists
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Helper function to verify JWT token
function verifyToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Login endpoint
exports.handler = async (event) => {
  // Initialize database
  await initDB();
  
  if (event.httpMethod === 'POST' && event.path === '/.netlify/functions/auth/login') {
    const { username, password } = JSON.parse(event.body);
    
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM users WHERE username = ?',
        args: [username]
      });
      
      if (result.rows.length === 0) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }
      
      const bcrypt = require('bcrypt');
      const validPassword = await bcrypt.compare(password, result.rows[0].password_hash);
      
      if (!validPassword) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }
      
      const token = jwt.sign(
        { userId: result.rows[0].id, username: result.rows[0].username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return {
        statusCode: 200,
        body: JSON.stringify({ token, username: result.rows[0].username })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Login failed' })
      };
    }
  }
  
  // Verify token endpoint
  if (event.httpMethod === 'GET' && event.path === '/.netlify/functions/auth/verify') {
    const decoded = verifyToken(event);
    
    if (!decoded) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ valid: true, user: decoded })
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};
