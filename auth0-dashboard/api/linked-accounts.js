// Vercel Serverless Function to fetch linked accounts from Auth0 Management API
// This function must be deployed on Vercel to work correctly.

// IMPORTANT: This function requires the same Machine-to-Machine (M2M) application
// and environment variables as the user-history function. Ensure that your
// M2M application has permissions to read users.
// Required Vercel environment variables:
// - AUTH0_DOMAIN
// - AUTH0_M2M_CLIENT_ID
// - AUTH0_M2M_CLIENT_SECRET

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

    // Fetch user data from the Auth0 Management API, specifically the identities field
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}?fields=identities&include_fields=true`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      return response.status(userResponse.status).json({ error: 'Failed to fetch user data', details: errorData });
    }

    const userData = await userResponse.json();

    // The linked accounts are in the 'identities' array
    response.status(200).json(userData.identities || []);
  } catch (error) {
    response.status(500).json({ error: 'An unexpected error occurred', details: error.message });
  }
}