import { DiscordLoginButton } from '../account/DiscordLoginButton';

interface HomeViewProps {
  onStartRun: () => void;
}

export function HomeView({ onStartRun }: HomeViewProps) {
  return (
    <div className="home-view">
      <header className="home-view__header">
        <h1>Theory of Forms</h1>
        <p className="home-view__tagline">
          The world ended. Here, people are doing alright. Out there, the old world is still
          waiting to be found.
        </p>
        <DiscordLoginButton />
      </header>

      <button type="button" className="primary-button" onClick={onStartRun}>
        Start a Run
      </button>
    </div>
  );
}
