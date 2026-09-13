import { useState } from 'react';
import type { GearItem } from '../../game/types/gear';
import type { Condition } from '../../game/types/condition';
import { describeGearEffect } from '../../game/logic/gearStats';
import { ItemCard } from './ItemCard';
import { ItemDetailModal } from './ItemDetailModal';

interface LoadoutPanelProps {
  loadout: GearItem[];
  gearCondition?: Record<string, Condition>;
}

const SLOT_LABEL: Record<GearItem['slot'], string> = { weapon: 'Weapon', armor: 'Armor', tool: 'Tool', key: 'Key' };

export function LoadoutPanel({ loadout, gearCondition }: LoadoutPanelProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openGear = loadout.find((item) => item.id === openId) ?? null;

  return (
    <section className="panel">
      <h3 className="panel__title">Loadout</h3>
      <div className="item-card-grid">
        {loadout.map((item) => (
          <ItemCard
            key={item.id}
            icon={item.icon}
            name={item.name}
            flavorText={item.flavorText}
            weirdness={item.rarity}
            condition={gearCondition?.[item.id]}
            statLines={describeGearEffect(item.effect)}
            onClick={() => setOpenId(item.id)}
          />
        ))}
      </div>
      {openGear && (
        <ItemDetailModal
          icon={openGear.icon}
          name={openGear.name}
          flavorText={openGear.flavorText}
          weirdness={openGear.rarity}
          condition={gearCondition?.[openGear.id]}
          metaLabel={SLOT_LABEL[openGear.slot]}
          statLines={describeGearEffect(openGear.effect)}
          onDismiss={() => setOpenId(null)}
        />
      )}
    </section>
  );
}
