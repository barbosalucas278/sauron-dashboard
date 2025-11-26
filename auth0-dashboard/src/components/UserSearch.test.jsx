import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserSearch from './UserSearch';

describe('UserSearch Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    it('renders search input and button', () => {
        render(<UserSearch />);
        expect(screen.getByLabelText(/Email o Nombre/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument();
    });

    it('performs search and displays results', async () => {
        const mockUsers = [
            { user_id: '1', name: 'John Doe', email: 'john@example.com', picture: 'http://example.com/pic.jpg' },
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUsers,
        });

        render(<UserSearch />);

        const input = screen.getByLabelText(/Email o Nombre/i);
        const button = screen.getByRole('button', { name: /Buscar/i });

        fireEvent.change(input, { target: { value: 'john' } });
        fireEvent.click(button);

        expect(global.fetch).toHaveBeenCalledWith('/api/users-search?q=john');

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
        });
    });

    it('displays error message on failure', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        render(<UserSearch />);

        const input = screen.getByLabelText(/Email o Nombre/i);
        const button = screen.getByRole('button', { name: /Buscar/i });

        fireEvent.change(input, { target: { value: 'error' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument();
        });
    });

    it('displays no results message', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(<UserSearch />);

        const input = screen.getByLabelText(/Email o Nombre/i);
        const button = screen.getByRole('button', { name: /Buscar/i });

        fireEvent.change(input, { target: { value: 'empty' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/No se encontraron resultados/i)).toBeInTheDocument();
        });
    });
});
