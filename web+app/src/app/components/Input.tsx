import { InputHTMLAttributes, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  helper?: string;
}

export function Input({ label, icon, helper, className = '', ...rest }: Props) {
  return (
    <label className="block w-full">
      {label && (
        <span
          className="block mb-2"
          style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, color: '#3D2C52' }}
        >
          {label}
        </span>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89BBA]" aria-hidden>
            {icon}
          </span>
        )}
        <input
          {...rest}
          className={`w-full h-12 ${icon ? 'pl-10' : 'pl-4'} pr-4 bg-[#F4EFFA] border-b-2 border-transparent focus:border-[#6D2EC0] focus:bg-white outline-none transition-colors ${className}`}
          style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, color: '#150A1F' }}
        />
      </div>
      {helper && (
        <span className="block mt-1.5" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>
          {helper}
        </span>
      )}
    </label>
  );
}
