import { useAuthStore } from '../../state/authStore';
import { DiscordLoginButton } from './DiscordLoginButton';

export function LoginGate() {
  const status = useAuthStore((s) => s.status);

  return (
    <div className="screen login-gate">
      <h1>Theory of Forms</h1>
      <p className="login-gate__message">
        {status === 'error'
          ? 'Something went wrong signing in with Discord. Please try again.'
          : 'Log in with Discord to access Theory of Forms.'}
      </p>
      <DiscordLoginButton />
    </div>
  );
}
