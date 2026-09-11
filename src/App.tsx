import { useRunStore } from './state/runStore';
import { HubScreen } from './components/hub/HubScreen';
import { RunScreen } from './components/run/RunScreen';
import { DeathScreen } from './components/run/DeathScreen';

export default function App() {
  const run = useRunStore((s) => s.run);
  const abandonDeadRun = useRunStore((s) => s.abandonDeadRun);

  if (!run) return <HubScreen />;
  if (run.status === 'died') return <DeathScreen run={run} onReturnToHub={abandonDeadRun} />;
  return <RunScreen run={run} />;
}
