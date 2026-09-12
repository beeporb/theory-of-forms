import { useAuthStore } from '../../state/authStore';
import { DiscordLoginButton } from './DiscordLoginButton';

export function LoginGate() {
  const status = useAuthStore((s) => s.status);

  return (
    <div className="screen login-gate">
      <img className="login-gate__logo" src="/favicon.svg" alt="" width={72} height={69} />
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
