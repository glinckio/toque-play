import { Signal, Wifi, BatteryFull } from 'lucide-react';

export function StatusBar({ color = '#150A1F' }: { color?: string }) {
  return (
    <div className="flex items-center justify-between h-12 px-6 pt-3" style={{ color }}>
      <span style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', fontWeight: 600, fontSize: 14 }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} />
        <Wifi size={14} />
        <BatteryFull size={18} />
      </div>
    </div>
  );
}
