import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }) {
  return (
    <div>
      <h1 className="font-serif text-3xl text-maroon">{title}</h1>
      <div className="my-4 h-px w-20 bg-gold" />
      <div className="flex flex-col items-center rounded-sm border border-gold/40 bg-white/50 px-6 py-16 text-center shadow-card">
        <Construction size={36} className="text-gold" />
        <p className="mt-3 font-serif text-xl text-maroon">Coming soon</p>
        <p className="mt-1 text-sm text-brown/70">
          This page will be built in a later step.
        </p>
      </div>
    </div>
  );
}