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

// Projects CRUD
async function getProjects() {
  const result = await client.execute('SELECT * FROM projects ORDER BY order_index, created_at');
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    image_url: row.image_url,
    tags: row.tags ? JSON.parse(row.tags) : [],
    link_url: row.link_url,
    category: row.category,
    order_index: row.order_index
  }));
}

async function getProject(id) {
  const result = await client.execute({
    sql: 'SELECT * FROM projects WHERE id = ?',
    args: [id]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image_url: row.image_url,
    tags: row.tags ? JSON.parse(row.tags) : [],
    link_url: row.link_url,
    category: row.category,
    order_index: row.order_index
  };
}

async function createProject(data) {
  const result = await client.execute({
    sql: `INSERT INTO projects (title, description, image_url, tags, link_url, category, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [data.title, data.description, data.image_url, JSON.stringify(data.tags || []), data.link_url, data.category, data.order_index || 0]
  });
  return result.lastInsertRowid;
}

async function updateProject(id, data) {
  await client.execute({
    sql: `UPDATE projects SET title = ?, description = ?, image_url = ?, tags = ?, link_url = ?, category = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [data.title, data.description, data.image_url, JSON.stringify(data.tags || []), data.link_url, data.category, data.order_index || 0, id]
  });
}

async function deleteProject(id) {
  await client.execute({
    sql: 'DELETE FROM projects WHERE id = ?',
    args: [id]
  });
}

// Skills CRUD
async function getSkills() {
  const result = await client.execute('SELECT * FROM skills ORDER BY order_index, created_at');
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    category: row.category,
    level: row.level,
    order_index: row.order_index
  }));
}

async function getSkill(id) {
  const result = await client.execute({
    sql: 'SELECT * FROM skills WHERE id = ?',
    args: [id]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    level: row.level,
    order_index: row.order_index
  };
}

async function createSkill(data) {
  const result = await client.execute({
    sql: `INSERT INTO skills (name, category, level, order_index) VALUES (?, ?, ?, ?)`,
    args: [data.name, data.category, data.level || 50, data.order_index || 0]
  });
  return result.lastInsertRowid;
}

async function updateSkill(id, data) {
  await client.execute({
    sql: `UPDATE skills SET name = ?, category = ?, level = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [data.name, data.category, data.level || 50, data.order_index || 0, id]
  });
}

async function deleteSkill(id) {
  await client.execute({
    sql: 'DELETE FROM skills WHERE id = ?',
    args: [id]
  });
}

// Parcours CRUD
async function getParcours() {
  const result = await client.execute('SELECT * FROM parcours ORDER BY order_index, year DESC');
  return result.rows.map(row => ({
    id: row.id,
    year: row.year,
    title: row.title,
    description: row.description,
    institution: row.institution,
    type: row.type,
    order_index: row.order_index
  }));
}

async function getParcoursItem(id) {
  const result = await client.execute({
    sql: 'SELECT * FROM parcours WHERE id = ?',
    args: [id]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    year: row.year,
    title: row.title,
    description: row.description,
    institution: row.institution,
    type: row.type,
    order_index: row.order_index
  };
}

async function createParcoursItem(data) {
  const result = await client.execute({
    sql: `INSERT INTO parcours (year, title, description, institution, type, order_index) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [data.year, data.title, data.description, data.institution, data.type, data.order_index || 0]
  });
  return result.lastInsertRowid;
}

async function updateParcoursItem(id, data) {
  await client.execute({
    sql: `UPDATE parcours SET year = ?, title = ?, description = ?, institution = ?, type = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [data.year, data.title, data.description, data.institution, data.type, data.order_index || 0, id]
  });
}

async function deleteParcoursItem(id) {
  await client.execute({
    sql: 'DELETE FROM parcours WHERE id = ?',
    args: [id]
  });
}

// Main handler
exports.handler = async (event) => {
  const decoded = verifyToken(event);
  
  // Extract action from path
  const path = event.path;
  const pathParts = path.split('/').filter(p => p);
  const action = pathParts[pathParts.length - 1];
  const resource = pathParts[pathParts.length - 2] || '';
  
  // GET endpoints (no auth required for public data)
  if (event.httpMethod === 'GET') {
    if (resource === 'api' && action === 'ue') {
      const ueData = await getUEData();
      return {
        statusCode: 200,
        body: JSON.stringify(ueData)
      };
    }
    
    if (resource === 'ue') {
      const ueData = await getSingleUE(action);
      
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
    
    if (resource === 'api' && action === 'contact') {
      const contactData = await getContactData();
      return {
        statusCode: 200,
        body: JSON.stringify(contactData)
      };
    }
    
    if (resource === 'api' && action === 'projects') {
      const projects = await getProjects();
      return {
        statusCode: 200,
        body: JSON.stringify(projects)
      };
    }
    
    if (resource === 'projects') {
      const id = parseInt(action);
      const project = await getProject(id);
      
      if (!project) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Project not found' })
        };
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(project)
      };
    }
    
    if (resource === 'api' && action === 'skills') {
      const skills = await getSkills();
      return {
        statusCode: 200,
        body: JSON.stringify(skills)
      };
    }
    
    if (resource === 'skills') {
      const id = parseInt(action);
      const skill = await getSkill(id);
      
      if (!skill) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Skill not found' })
        };
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(skill)
      };
    }
    
    if (resource === 'api' && action === 'parcours') {
      const parcours = await getParcours();
      return {
        statusCode: 200,
        body: JSON.stringify(parcours)
      };
    }
    
    if (resource === 'parcours') {
      const id = parseInt(action);
      const item = await getParcoursItem(id);
      
      if (!item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Parcours item not found' })
        };
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(item)
      };
    }
  }
  
  // POST/PUT/DELETE endpoints (require auth)
  if (!decoded) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  if (event.httpMethod === 'POST' || event.httpMethod === 'PUT' || event.httpMethod === 'DELETE') {
    const body = event.body ? JSON.parse(event.body) : {};
    
    if (resource === 'api' && action === 'ue') {
      await saveUEData(body.code, body);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }
    
    if (resource === 'ue' && event.httpMethod === 'DELETE') {
      await client.execute({
        sql: 'DELETE FROM ue_data WHERE ue_code = ?',
        args: [action]
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }
    
    if (resource === 'api' && action === 'contact') {
      await saveContactData(body);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }
    
    // Projects endpoints
    if (resource === 'api' && action === 'projects') {
      const id = await createProject(body);
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, id })
      };
    }
    
    if (resource === 'projects') {
      const id = parseInt(action);
      
      if (event.httpMethod === 'PUT') {
        await updateProject(id, body);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };
      }
      
      if (event.httpMethod === 'DELETE') {
        await deleteProject(id);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };
      }
    }
    
    // Skills endpoints
    if (resource === 'api' && action === 'skills') {
      const id = await createSkill(body);
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, id })
      };
    }
    
    if (resource === 'skills') {
      const id = parseInt(action);
      
      if (event.httpMethod === 'PUT') {
        await updateSkill(id, body);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };
      }
      
      if (event.httpMethod === 'DELETE') {
        await deleteSkill(id);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };
      }
    }
    
    // Parcours endpoints
    if (resource === 'api' && action === 'parcours') {
      const id = await createParcoursItem(body);
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, id })
      };
    }
    
    if (resource === 'parcours') {
      const id = parseInt(action);
      
      if (event.httpMethod === 'PUT') {
        await updateParcoursItem(id, body);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };
      }
      
      if (event.httpMethod === 'DELETE') {
        await deleteParcoursItem(id);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };
      }
    }
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found', path: path, resource: resource, action: action })
  };
};
