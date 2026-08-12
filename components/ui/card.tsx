import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-soft">{children}</div>;
}
