import { useAuthStore } from '../../state/authStore';
import { DiscordLoginButton } from './DiscordLoginButton';

export function LoginGate() {
  const status = useAuthStore((s) => s.status);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  return (
    <div className="screen login-gate">
      <img
        className="login-gate__logo"
        src={`${import.meta.env.BASE_URL}favicon.svg`}
        alt=""
        width={72}
        height={69}
      />
      <h1>Theory of Forms</h1>
      <p className="login-gate__message">
        {status === 'error'
          ? 'Something went wrong signing in with Discord. Please try again.'
          : 'Log in with Discord, or play without an account.'}
      </p>
      <DiscordLoginButton />
      <button type="button" className="login-gate__guest" onClick={continueAsGuest}>
        Continue without logging in
      </button>
      <p className="login-gate__note">Your progress is saved in this browser either way.</p>
    </div>
  );
}
