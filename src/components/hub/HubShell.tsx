import { useState } from 'react';
import { HubNav, type HubView } from '../nav/HubNav';
import { HomeView } from './HomeView';
import { CharacterView } from './CharacterView';
import { CollectorsView } from './CollectorsView';
import { InventoryView } from './InventoryView';
import { RunsView } from './RunsView';

export function HubShell() {
  const [view, setView] = useState<HubView>('home');

  return (
    <div className="hub-shell">
      <HubNav active={view} onNavigate={setView} />
      <div className="hub-shell__content">
        {view === 'home' && <HomeView onStartRun={() => setView('runs')} />}
        {view === 'character' && <CharacterView />}
        {view === 'collectors' && <CollectorsView />}
        {view === 'inventory' && <InventoryView />}
        {view === 'runs' && <RunsView />}
      </div>
    </div>
  );
}
