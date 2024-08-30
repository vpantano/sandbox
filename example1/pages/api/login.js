/**
Things we'd like to see pointed out or mentioned:
- Redundant Logging: Logging before and after the authentication process is unnecessary and could clutter logs.
- Logging Sensitive Data: Although the logger is assumed to be secure, logging sensitive data like usernames should still be avoided.
- Any error should ensure that no sensitive information is exposed in the logs or the responses. Proper error messages are sent to the client, and detailed errors are logged securely (e.g., using a dedicated logging service in production).
 */

import { logError } from './logger';  // Potential for an unsecure logger

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  // Redundant logging before actual login attempt
  logError('Login attempt with username:', username);

  try {
    const authResponse = await fetch('https://external-auth-service.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!authResponse.ok) {
      logError('Authentication failed:', authResponse);  // Bad practice logging
      return res.status(authResponse.status).json({ message: 'Authentication failed' });
    }

    const authData = await authResponse.json();

    return res.status(200).json({ message: 'Login successful', data: authData });
  } catch (error) {
    logError('Internal Server Error:', error);  // Bad practice logging
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  // Redundant final logging, shouldn't be here
  logError('Login process ended');
}