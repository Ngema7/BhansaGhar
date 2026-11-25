const STYLES = {
  Confirmed: 'bg-green-100 text-green-800',
  Pending: 'bg-gold/30 text-brown',
  Cancelled: 'bg-brick/15 text-brick',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
        STYLES[status] || 'bg-brown/10 text-brown'
      }`}
    >
      {status}
    </span>
  );
}