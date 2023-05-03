import { SvelteKitAuth, SvelteKitAuthConfig } from '@auth/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { addNew, clear } from './lib/server/birthdayRepository';
import { authProviders } from './authProviders';

const configuration: SvelteKitAuthConfig = {
	providers: Object.values(authProviders),
	debug: true,
	secret: import.meta.env.VITE_CLIENT_SECRET,
	trustHost: true,
	session: {
		maxAge: 3600
	},
	callbacks: {
		jwt({ token, account, profile }) {
			return { ...token, ...account, ...profile } as any;
		},
		session({ session, token }) {
			if (token && session.user) {
				session.user = { ...session.user, ...token };
			}
			return session;
		}
	},
	events: {
		signIn(message: any) {
			if (message.user && import.meta.env.VITE_MODE === 'development') {
				addNew({ name: 'Hercules', dob: '1994-02-02' });
				addNew({ name: 'Athena', dob: '1989-01-01' });
			}
		},
		signOut() {
			clear();
		}
	},
	logger: {
		error: (error: any) => {
			try {
				const _error = JSON.stringify(error);
				console.log('ERROR via HOOKS: ', _error);
			} catch (e) {
				console.log('ERROR via HOOKS: ', error);
			}
		}
	}
};

export const handle = SvelteKitAuth(configuration) satisfies Handle;
