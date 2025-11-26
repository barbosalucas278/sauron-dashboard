// Vercel Serverless Function to search users from Auth0 Management API
// This function must be deployed on Vercel to work correctly.

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
        const { q } = request.query;

        if (!q) {
            return response.status(400).json({ error: 'Search query (q) is required' });
        }

        const token = await getManagementApiToken();

        if (!token) {
            return response.status(500).json({ error: 'Failed to retrieve management token' });
        }

        // Construct a Lucene query for better results (partial match on name, email, nickname)
        const searchQuery = `name:"*${q}*" OR email:"*${q}*" OR nickname:"*${q}*"`;

        // Search users in Auth0 Management API
        // search_engine: v3 is recommended
        const searchResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users?q=${encodeURIComponent(searchQuery)}&search_engine=v3`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        if (!searchResponse.ok) {
            const errorData = await searchResponse.json();
            return response.status(searchResponse.status).json({ error: 'Failed to search users', details: errorData });
        }

        const users = await searchResponse.json();

        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
}
