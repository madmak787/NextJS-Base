import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '@/types';

const useAuth = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			isLoggedIn: false,

			setUser: ({ token, user, isLoggedIn }) =>
				set({
					token,
					user,
					isLoggedIn,
				}),

			logout: () =>
				set({}),
		}),
		{ name: 'giftcard-auth' }
	)
);

export default useAuth;
