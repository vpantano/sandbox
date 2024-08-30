import { logger } from './logger';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  logger('Login attempt with username:', username);

  try {
    const authResponse = await fetch('https://external-auth-service.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!authResponse.ok) {
      logger('Authentication failed:', authResponse);
      return res.status(authResponse.status).json({ message: 'Authentication failed' });
    }

    const authData = await authResponse.json();

    return res.status(200).json({ message: 'Login successful', data: authData });
  } catch (error) {
    logger('Internal Server Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  logger('Login process ended');
}