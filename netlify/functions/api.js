const { createClient } = require('@libsql/client');
const jwt = require('jsonwebtoken');

// Initialize SQLite client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

// GET all UE data
async function getUEData() {
  const result = await client.execute('SELECT * FROM ue_data ORDER BY ue_code');
  return result.rows.reduce((acc, row) => {
    acc[row.ue_code] = {
      code: row.ue_code,
      title: row.title,
      credits: row.credits,
      desc: row.description,
      proof: row.proof,
      skills: row.skills,
      bilan: row.bilan
    };
    return acc;
  }, {});
}

// GET single UE data
async function getSingleUE(ueCode) {
  const result = await client.execute({
    sql: 'SELECT * FROM ue_data WHERE ue_code = ?',
    args: [ueCode]
  });
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    code: row.ue_code,
    title: row.title,
    credits: row.credits,
    desc: row.description,
    proof: row.proof,
    skills: row.skills,
    bilan: row.bilan
  };
}

// UPDATE or INSERT UE data
async function saveUEData(ueCode, data) {
  const existing = await getSingleUE(ueCode);
  
  if (existing) {
    await client.execute({
      sql: `UPDATE ue_data SET title = ?, credits = ?, description = ?, proof = ?, skills = ?, bilan = ?, updated_at = CURRENT_TIMESTAMP WHERE ue_code = ?`,
      args: [data.title, data.credits, data.desc, data.proof, data.skills, data.bilan, ueCode]
    });
  } else {
    await client.execute({
      sql: `INSERT INTO ue_data (ue_code, title, credits, description, proof, skills, bilan) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [ueCode, data.title, data.credits, data.desc, data.proof, data.skills, data.bilan]
    });
  }
}

// GET contact data
async function getContactData() {
  const result = await client.execute('SELECT * FROM contact_data ORDER BY updated_at DESC LIMIT 1');
  
  if (result.rows.length === 0) {
    return { email: '', phone: '', linkedin: '', github: '' };
  }
  
  return {
    email: result.rows[0].email,
    phone: result.rows[0].phone,
    linkedin: result.rows[0].linkedin,
    github: result.rows[0].github
  };
}

// UPDATE contact data
async function saveContactData(data) {
  const existing = await client.execute('SELECT * FROM contact_data LIMIT 1');
  
  if (existing.rows.length > 0) {
    await client.execute({
      sql: `UPDATE contact_data SET email = ?, phone = ?, linkedin = ?, github = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [data.email, data.phone, data.linkedin, data.github, existing.rows[0].id]
    });
  } else {
    await client.execute({
      sql: `INSERT INTO contact_data (email, phone, linkedin, github) VALUES (?, ?, ?, ?)`,
      args: [data.email, data.phone, data.linkedin, data.github]
    });
  }
}

// Main handler
exports.handler = async (event) => {
  const decoded = verifyToken(event);
  
  // GET endpoints (no auth required for public data)
  if (event.httpMethod === 'GET') {
    const path = event.path;
    
    if (path === '/.netlify/functions/api/ue') {
      const ueData = await getUEData();
      return {
        statusCode: 200,
        body: JSON.stringify(ueData)
      };
    }
    
    if (path.startsWith('/.netlify/functions/api/ue/')) {
      const ueCode = path.split('/').pop();
      const ueData = await getSingleUE(ueCode);
      
      if (!ueData) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'UE not found' })
        };
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(ueData)
      };
    }
    
    if (path === '/.netlify/functions/api/contact') {
      const contactData = await getContactData();
      return {
        statusCode: 200,
        body: JSON.stringify(contactData)
      };
    }
  }
  
  // POST/PUT endpoints (require auth)
  if (!decoded) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
    const path = event.path;
    const body = JSON.parse(event.body);
    
    if (path === '/.netlify/functions/api/ue') {
      await saveUEData(body.code, body);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }
    
    if (path === '/.netlify/functions/api/contact') {
      await saveContactData(body);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};
