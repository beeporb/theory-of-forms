import { useEffect } from 'react';
import { useRunStore } from './state/runStore';
import { useAuthStore } from './state/authStore';
import { HubShell } from './components/hub/HubShell';
import { RunScreen } from './components/run/RunScreen';
import { DeathScreen } from './components/run/DeathScreen';

export default function App() {
  const run = useRunStore((s) => s.run);
  const abandonDeadRun = useRunStore((s) => s.abandonDeadRun);
  const completeDiscordLogin = useAuthStore((s) => s.completeDiscordLogin);

  useEffect(() => {
    if (!window.location.hash) return;
    completeDiscordLogin(window.location.hash).then((handled) => {
      if (handled) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
  }, [completeDiscordLogin]);

  if (!run) return <HubShell />;
  if (run.status === 'died') return <DeathScreen run={run} onReturnToHub={abandonDeadRun} />;
  return <RunScreen run={run} />;
}
