import { authApi } from '@/features/auth/infrastructure/api/authApi';
import { OAuthLoginButtons } from '@/features/auth/presentation/components/oauth/OAuthLoginButtons';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

// Mock store for testing
const createMockStore = () => {
    return configureStore({
        reducer: {
            [authApi.reducerPath]: authApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(authApi.middleware),
    });
};

// Mock window.location
const mockLocation = {
    href: '',
    origin: 'http://localhost:3000',
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

describe('OAuth Integration', () => {
    let store: ReturnType<typeof createMockStore>;

    beforeEach(() => {
        store = createMockStore();
        mockLocation.href = '';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders OAuth login buttons', () => {
        render(
            <Provider store={store}>
                <OAuthLoginButtons providers={['google', 'github']} />
            </Provider>
        );

        expect(screen.getByText('Continue with Google')).toBeInTheDocument();
        expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
    });

    it('initiates OAuth flow when button is clicked', async () => {
        const mockOnSuccess = jest.fn();
        const mockOnError = jest.fn();

        render(
            <Provider store={store}>
                <OAuthLoginButtons
                    providers={['google']}
                    onSuccess={mockOnSuccess}
                    onError={mockOnError}
                />
            </Provider>
        );

        const googleButton = screen.getByText('Continue with Google');
        fireEvent.click(googleButton);

        // Should redirect to backend OAuth endpoint
        await waitFor(() => {
            expect(mockLocation.href).toContain('/oauth/google/authorize');
        });
    });

    it('displays error when OAuth fails', async () => {
        const mockOnError = jest.fn();

        render(
            <Provider store={store}>
                <OAuthLoginButtons
                    providers={['google']}
                    onError={mockOnError}
                />
            </Provider>
        );

        // Simulate error during OAuth initiation
        const googleButton = screen.getByText('Continue with Google');

        // Mock the OAuth service to throw an error
        jest.spyOn(console, 'error').mockImplementation(() => { });

        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(mockOnError).toHaveBeenCalled();
        });
    });

    it('shows loading state during OAuth process', () => {
        render(
            <Provider store={store}>
                <OAuthLoginButtons providers={['google']} isLoading={true} />
            </Provider>
        );

        const googleButton = screen.getByText('Continue with Google');
        expect(googleButton).toBeDisabled();
    });
});
