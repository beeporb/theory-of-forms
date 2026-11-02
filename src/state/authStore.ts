import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  buildDiscordAuthorizeUrl,
  fetchDiscordUser,
  parseDiscordAuthFragment,
  type DiscordUser,
} from '../auth/discord';
import { createIdbStorage } from '../persistence/storage';

interface AuthStore {
  discordUser: DiscordUser | null;
  accessToken: string | null;
  /** Player chose "Continue without logging in" on the login gate. */
  guest: boolean;
  status: 'idle' | 'authenticating' | 'error';
  loginWithDiscord: () => void;
  completeDiscordLogin: (locationHash: string) => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      discordUser: null,
      accessToken: null,
      guest: false,
      status: 'idle',

      loginWithDiscord: () => {
        const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
        if (!clientId) {
          console.error('VITE_DISCORD_CLIENT_ID is not configured; cannot log in with Discord.');
          return;
        }
        const redirectUri = `${window.location.origin}${window.location.pathname}`;
        window.location.assign(buildDiscordAuthorizeUrl(clientId, redirectUri));
      },

      completeDiscordLogin: async (locationHash) => {
        const fragment = parseDiscordAuthFragment(locationHash);
        if (!fragment) return false;

        set({ status: 'authenticating' });
        try {
          const discordUser = await fetchDiscordUser(fragment.accessToken);
          set({ discordUser, accessToken: fragment.accessToken, guest: false, status: 'idle' });
          return true;
        } catch (error) {
          console.error('Failed to complete Discord login:', error);
          set({ status: 'error' });
          return false;
        }
      },

      continueAsGuest: () => {
        set({ guest: true, status: 'idle' });
      },

      logout: () => {
        set({ discordUser: null, accessToken: null, guest: false, status: 'idle' });
      },
    }),
    {
      name: 'tof-auth-v1',
      storage: createJSONStorage(createIdbStorage),
      partialize: (state) => ({
        discordUser: state.discordUser,
        accessToken: state.accessToken,
        guest: state.guest,
      }),
    },
  ),
);
