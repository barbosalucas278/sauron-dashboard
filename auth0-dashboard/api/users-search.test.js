import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from './users-search';

// Mock process.env
process.env.AUTH0_DOMAIN = 'test.auth0.com';
process.env.AUTH0_M2M_CLIENT_ID = 'test-client-id';
process.env.AUTH0_M2M_CLIENT_SECRET = 'test-client-secret';

// Mock fetch
global.fetch = vi.fn();

describe('API: users-search', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { query: {} };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
    });

    it('returns 400 if query (q) is missing', async () => {
        await handler(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Search query (q) is required' });
    });

    it('returns 500 if management token cannot be retrieved', async () => {
        req.query.q = 'test';
        // Mock token response failure or empty
        global.fetch.mockResolvedValueOnce({
            json: async () => ({}), // No access_token
        });

        await handler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve management token' });
    });

    it('searches users with correct Lucene query', async () => {
        req.query.q = 'lucas';
        const mockToken = 'mock-token';
        const mockUsers = [{ email: 'lucas@example.com' }];

        // Mock token response
        global.fetch.mockResolvedValueOnce({
            json: async () => ({ access_token: mockToken }),
        });

        // Mock search response
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUsers,
        });

        await handler(req, res);

        // Verify token call
        expect(global.fetch).toHaveBeenNthCalledWith(1, `https://${process.env.AUTH0_DOMAIN}/oauth/token`, expect.any(Object));

        // Verify search call with constructed query
        const expectedQuery = encodeURIComponent('name:"*lucas*" OR email:"*lucas*" OR nickname:"*lucas*"');
        expect(global.fetch).toHaveBeenNthCalledWith(2,
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users?q=${expectedQuery}&search_engine=v3`,
            { headers: { authorization: `Bearer ${mockToken}` } }
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
});
