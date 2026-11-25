// props: icon = आइकन, label = शीर्षक, value = नम्बर, tone = रङ ('maroon' वा 'gold')
export default function StatCard({ icon: Icon, label, value, tone = 'maroon' }) {
  const toneClass = tone === 'gold' ? 'bg-gold text-maroon' : 'bg-maroon text-gold';

  return (
    <div className="flex items-center gap-4 rounded-sm border border-gold/40 bg-white/50 p-5 shadow-card">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${toneClass}`}
      >
        <Icon size={26} />
      </div>
      <div>
        <p className="text-sm text-brown/70">{label}</p>
        <p className="font-serif text-3xl font-semibold text-maroon">{value}</p>
      </div>
    </div>
  );
}