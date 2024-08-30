/**
Suggestions for some improvements we should screen for:
- Remove Caching for Authentication: Caching the authentication response is not appropriate because login is a transactional process that requires real-time validation.
- Implement Proper Error Handling: Ensure that errors are handled appropriately with clear and secure logging.
- Avoid Storing Sensitive Information in Insecure Caches: Instead of caching sensitive data like authentication tokens, focus on improving the performance of the external API call through other means, such as connection pooling or optimizing the external service.
 */

import cache from 'memory-cache';  // Using in-memory cache, not suitable for production

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    // Caching logic before actual login
    let cachedResponse = cache.get(username);
    if (cachedResponse) {
      return res.status(200).json({ message: 'Login successful (cached)', data: cachedResponse });
    }

    const authResponse = await fetch('https://external-auth-service.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const authData = await authResponse.json();

    // Redundant caching logic
    cache.put(username, authData);

    return res.status(200).json({ message: 'Login successful', data: authData });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
