/**
Concerns we'd like to see flagged:
- Poor Cookie Management: Cookies are set without proper security flags (e.g., Secure, SameSite), which could expose sensitive information.
- Database Interaction: The database insert is done without error handling, which could lead to unhandled errors and potential data integrity issues.
- Direct database insertions without error handling or using parameterized queries opens potential for SQL injection.
 */

import db from './db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const authResponse = await fetch('https://external-auth-service.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const authData = await authResponse.json();

    // Poorly managed cookie setting (e.g., without considering security)
    res.setHeader('Set-Cookie', [
      `token=${authData.token}; HttpOnly; Path=/`,
      `user=${username}; Path=/`,
      `loginTime=${new Date().toISOString()}; Path=/`,
    ]);

    // Poorly managed database insert (no error handling)
    db.query('INSERT INTO logins (username, login_time) VALUES (?, ?)', [username, new Date().toISOString()]);

    return res.status(200).json({ message: 'Login successful', data: authData });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
