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
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        tags TEXT,
        link_url TEXT,
        category TEXT,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        level INTEGER DEFAULT 50,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS parcours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        institution TEXT,
        type TEXT,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create default admin user if not exists (username: felicio, password: felicio)
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('felicio', 10);
    
    try {
      await client.execute({
        sql: 'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        args: ['felicio', passwordHash]
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
  console.log('Auth function called:', event.path, event.httpMethod);
  
  // Initialize database
  await initDB();
  
  // Extract action from path or query string
  const path = event.path;
  const action = path.split('/').pop();
  
  console.log('Action:', action, 'Path:', path);
  
  if (event.httpMethod === 'POST' && action === 'login') {
    console.log('Login attempt');
    
    let body;
    try {
      body = JSON.parse(event.body);
      console.log('Login body:', { username: body.username, password: '***' });
    } catch (e) {
      console.error('JSON parse error:', e);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON' })
      };
    }
    
    const { username, password } = body;
    
    // Simple hardcoded authentication for reliability
    if (username === 'felicio' && password === 'felicio') {
      console.log('Hardcoded authentication successful');
      const token = jwt.sign(
        { userId: 1, username: 'felicio' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return {
        statusCode: 200,
        body: JSON.stringify({ token, username: 'felicio' })
      };
    }
    
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM users WHERE username = ?',
        args: [username]
      });
      
      console.log('User query result:', result.rows.length, 'rows');
      
      if (result.rows.length === 0) {
        console.log('User not found:', username);
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }
      
      const bcrypt = require('bcrypt');
      const validPassword = await bcrypt.compare(password, result.rows[0].password_hash);
      
      console.log('Password valid:', validPassword);
      
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
      
      console.log('Login successful for:', username);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ token, username: result.rows[0].username })
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Login failed', details: error.message })
      };
    }
  }
  
  // Verify token endpoint
  if (event.httpMethod === 'GET' && action === 'verify') {
    console.log('Verify token attempt');
    const decoded = verifyToken(event);
    
    if (!decoded) {
      console.log('Token invalid');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }
    
    console.log('Token valid');
    return {
      statusCode: 200,
      body: JSON.stringify({ valid: true, user: decoded })
    };
  }
  
  console.log('No matching endpoint');
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found', path: path, action: action })
  };
};
