import GitHubProvider from '@auth/core/providers/github';
import CredentialsProvider from '@auth/core/providers/credentials';
import type { Provider } from '@auth/core/providers';

const allowCredentials = import.meta.env.VITE_ALLOW_CREDENTIALS === 'true';

const GitHub = GitHubProvider({
	clientId: import.meta.env.VITE_CLIENT_ID,
	clientSecret: import.meta.env.VITE_CLIENT_SECRET
}) as Provider;

const credentials = CredentialsProvider({
	credentials: {
		username: { label: 'Username', type: 'text' }
	},
	authorize(credentials) {
		if (credentials.username === 'api') {
			return new Promise((resolve) => resolve({ id: '1', name: 'api', email: '', image: '' }));
		}
		return new Promise((resolve) => resolve(null));
	}
});

const devAuthProviders = {
	GitHub,
	credentials
};

const prodAuthProviders = { GitHub };

export const authProviders = allowCredentials ? devAuthProviders : prodAuthProviders;
