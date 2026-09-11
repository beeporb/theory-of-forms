import { useRunStore } from '../../state/runStore';

export function HomeView() {
  const startRun = useRunStore((s) => s.startRun);

  return (
    <div className="home-view">
      <header className="home-view__header">
        <h1>Theory of Forms</h1>
        <p className="home-view__tagline">
          The world ended. Here, people are doing alright. Out there, the old world is still
          waiting to be found.
        </p>
      </header>

      <button type="button" className="primary-button" onClick={() => startRun('warehouse')}>
        Start Run: The Old Warehouse
      </button>
    </div>
  );
}
