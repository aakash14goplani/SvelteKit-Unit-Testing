import { authProviders } from '../../authProviders';

export const load = async () => ({
	providers: Object.keys(authProviders)
});
