import { Check } from 'lucide-react';

interface Props {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: Props) {
  return (
    <div className="flex items-center w-full">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center gap-1">
              <div
                className="size-7 rounded-full flex items-center justify-center"
                style={{
                  background: done ? '#1FB87A' : active ? '#6D2EC0' : '#ECECF0',
                  color: done || active ? '#FFF' : '#A89BBA',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 13,
                }}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 10, color: active ? '#6D2EC0' : '#6B5B7E' }} className="whitespace-nowrap">{label}</span>
            </div>
            {!last && <div className="h-[2px] flex-1 mx-1 mb-5" style={{ background: done ? '#1FB87A' : '#ECECF0' }} />}
          </div>
        );
      })}
    </div>
  );
}
