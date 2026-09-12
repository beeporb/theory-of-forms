import { useAuthStore } from '../../state/authStore';
import { discordAvatarUrl } from '../../auth/discord';

function DiscordMark() {
  return (
    <svg viewBox="0 0 24 24" className="icon" fill="currentColor" aria-hidden="true">
      <path d="M20.3 5.35a17.8 17.8 0 0 0-4.4-1.36 12.9 12.9 0 0 0-.57 1.17 16.5 16.5 0 0 0-4.94 0 12.9 12.9 0 0 0-.58-1.17c-1.53.26-3 .72-4.4 1.36C2.9 9.35 2.1 13.24 2.46 17.08a17.9 17.9 0 0 0 5.46 2.77c.44-.6.83-1.24 1.17-1.92-.64-.24-1.26-.54-1.84-.9.15-.11.3-.23.45-.35a12.7 12.7 0 0 0 10.6 0c.15.12.3.24.45.35-.58.36-1.2.66-1.84.9.34.68.73 1.32 1.17 1.92a17.85 17.85 0 0 0 5.46-2.77c.43-4.46-.73-8.31-3.24-11.73ZM9.68 14.7c-.8 0-1.46-.75-1.46-1.68 0-.92.64-1.68 1.46-1.68.83 0 1.48.77 1.46 1.68 0 .93-.64 1.68-1.46 1.68Zm4.65 0c-.8 0-1.46-.75-1.46-1.68 0-.92.64-1.68 1.46-1.68.83 0 1.48.77 1.46 1.68 0 .93-.63 1.68-1.46 1.68Z" />
    </svg>
  );
}

export function DiscordLoginButton() {
  const discordUser = useAuthStore((s) => s.discordUser);
  const status = useAuthStore((s) => s.status);
  const loginWithDiscord = useAuthStore((s) => s.loginWithDiscord);
  const logout = useAuthStore((s) => s.logout);

  if (discordUser) {
    const avatarUrl = discordAvatarUrl(discordUser);
    return (
      <div className="discord-account">
        {avatarUrl ? (
          <img className="discord-account__avatar" src={avatarUrl} alt="" />
        ) : (
          <span className="discord-account__avatar discord-account__avatar--fallback">
            <DiscordMark />
          </span>
        )}
        <span className="discord-account__name">{discordUser.globalName ?? discordUser.username}</span>
        <button type="button" className="discord-account__logout" onClick={logout}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="discord-login-button"
      onClick={loginWithDiscord}
      disabled={status === 'authenticating'}
    >
      <DiscordMark />
      {status === 'authenticating' ? 'Signing in…' : 'Log in with Discord'}
    </button>
  );
}
