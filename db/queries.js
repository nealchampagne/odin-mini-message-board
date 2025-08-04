const pool = require('./pool');

// This module contains database queries for the Mini Message Board application

const getAllUsers = async () => {
  const result = await pool.query('SELECT id, username FROM users ORDER BY username');
  return result.rows;
}

const getUserById = async (userId) => {
  const { rows } = await pool.query(`
    SELECT id, username 
    FROM users 
    WHERE id = $1;
    `, [userId]);
  return rows[0];
}

const findUserByName = async (username) => {
  const { rows } = await pool.query(`
    SELECT id, username 
    FROM users 
    WHERE LOWER(username) = $1;
    `, [username]);
  return rows[0];
};

const createUser = async (username) => {
  const { rows } = await pool.query(`
    INSERT INTO users (username)
    VALUES ($1)
    RETURNING id, username;
  `, [username]);
  return rows[0];
};

const getAllMessages = async () => {
  const { rows } = await pool.query(`
    SELECT messages.id, messages.content, messages.timestamp, users.username
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY messages.timestamp DESC;
  `);
  return rows;
};

const addMessage = async (userId, content) => {
  const { rows } = await pool.query(`
    INSERT INTO messages (user_id, content)
    VALUES ($1, $2)
    RETURNING id, content, timestamp;
  `, [userId, content]);
  return rows[0];
};

const updateMessage = async (messageId, content) => {
  const { rows } = await pool.query(`
    UPDATE messages
    SET content = $1, timestamp = NOW()
    WHERE id = $2
    RETURNING id, content, timestamp;
  `, [content, messageId]);
  return rows[0];
}

const getMessageById = async (messageId) => {
  const { rows } = await pool.query(`
    SELECT messages.id, messages.content, messages.timestamp, users.username
    FROM messages
    JOIN users ON messages.user_id = users.id
    WHERE messages.id = $1;
  `, [messageId]);
  return rows[0];
};

const deleteMessage = async (messageId) => {
  await pool.query(`
    DELETE FROM messages
    WHERE id = $1;
  `, [messageId]);
};

module.exports = {
  getAllUsers,
  getUserById,
  findUserByName,
  createUser,
  getAllMessages,
  addMessage,  
  updateMessage,
  getMessageById,
  deleteMessage,
};