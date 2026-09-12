import { useState } from 'react';
import { DiscordLoginButton } from '../account/DiscordLoginButton';
import { ChangelogModal } from './ChangelogModal';

interface HomeViewProps {
  onStartRun: () => void;
}

export function HomeView({ onStartRun }: HomeViewProps) {
  const [showChangelog, setShowChangelog] = useState(false);

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

      <p className="home-view__version">
        v{__APP_VERSION__} ·{' '}
        <button type="button" className="home-view__changelog-link" onClick={() => setShowChangelog(true)}>
          What's New
        </button>
      </p>

      {showChangelog && <ChangelogModal onDismiss={() => setShowChangelog(false)} />}
    </div>
  );
}
