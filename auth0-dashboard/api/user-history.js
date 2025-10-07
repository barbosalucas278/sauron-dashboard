// Vercel Serverless Function to fetch user history from Auth0 Management API
// This function must be deployed on Vercel to work correctly.

// IMPORTANT: This function requires you to create a Machine-to-Machine (M2M)
// application in your Auth0 dashboard and grant it permissions to read user logs.
// You will then need to set the following environment variables in your Vercel project:
// - AUTH0_DOMAIN: Your Auth0 domain (e.g., your-tenant.us.auth0.com)
// - AUTH0_M2M_CLIENT_ID: The Client ID of your M2M application.
// - AUTH0_M2M_CLIENT_SECRET: The Client Secret of your M2M application.

// Helper function to get an access token for the Management API
async function getManagementApiToken() {
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export default async function handler(request, response) {
  try {
    // The user's ID is expected to be passed as a query parameter
    const { userId } = request.query;

    if (!userId) {
      return response.status(400).json({ error: 'User ID is required' });
    }

    const token = await getManagementApiToken();

    if (!token) {
      return response.status(500).json({ error: 'Failed to retrieve management token' });
    }

    // Fetch user logs from the Auth0 Management API
    const userLogsResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/logs`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!userLogsResponse.ok) {
      const errorData = await userLogsResponse.json();
      return response.status(userLogsResponse.status).json({ error: 'Failed to fetch user logs', details: errorData });
    }

    const userLogs = await userLogsResponse.json();

    // Respond with the user logs
    response.status(200).json(userLogs);
  } catch (error) {
    response.status(500).json({ error: 'An unexpected error occurred', details: error.message });
  }
}