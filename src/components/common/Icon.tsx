import {
  Mountain,
  Gem,
  FlaskConical,
  Pickaxe,
  Lamp,
  Cog,
  Bomb,
  Sparkles,
  DoorOpen,
  Home,
  Users,
  Backpack,
  Sword,
  Shield,
  Wrench,
  ScrollText,
  BookMarked,
  Search,
  CircleHelp,
  User,
  Star,
  Skull,
  Coins,
  Layers,
  Diamond,
  Gauge,
  Flame,
  Stamp,
  Folder,
  Paperclip,
  Fan,
  Watch,
  Wallet,
  Glasses,
  Key,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '../../game/types/icon';

const ICONS: Record<IconName, LucideIcon> = {
  mountain: Mountain,
  gem: Gem,
  flask: FlaskConical,
  pickaxe: Pickaxe,
  lamp: Lamp,
  cog: Cog,
  bomb: Bomb,
  sparkles: Sparkles,
  door: DoorOpen,
  home: Home,
  collectors: Users,
  backpack: Backpack,
  sword: Sword,
  shield: Shield,
  wrench: Wrench,
  scroll: ScrollText,
  book: BookMarked,
  search: Search,
  help: CircleHelp,
  user: User,
  star: Star,
  skull: Skull,
  coins: Coins,
  layers: Layers,
  diamond: Diamond,
  gauge: Gauge,
  flame: Flame,
  stamp: Stamp,
  folder: Folder,
  paperclip: Paperclip,
  fan: Fan,
  watch: Watch,
  wallet: Wallet,
  glasses: Glasses,
  key: Key,
};

interface IconProps {
  name: IconName;
  tone?: 'bad' | 'good';
  filter?: string;
}

export function Icon({ name, tone, filter }: IconProps) {
  const Component = ICONS[name];
  return (
    <Component
      size="1em"
      className={tone ? `icon icon--${tone}` : 'icon'}
      style={filter ? { filter } : undefined}
      aria-hidden="true"
    />
  );
}
