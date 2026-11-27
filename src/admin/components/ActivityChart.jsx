import { useMemo } from 'react';

const W = 700;
const H = 260;
const PAD = { l: 52, r: 16, t: 16, b: 32 };

// data: [{ label, value }], color: रेखाको रङ, prefix: मानको अगाडि (जस्तै "Rs. ")
export default function ActivityChart({ data, color = '#4A1719', prefix = '' }) {
  const chart = useMemo(() => {
    const n = data.length;
    const max = Math.max(...data.map((d) => d.value), 0);
    const raw = Math.max(max, 4);
    const mag = 10 ** Math.floor(Math.log10(raw / 4));
    const step = Math.ceil(raw / 4 / mag) * mag;
    const maxY = step * 4;

    const x = (i) => PAD.l + (n === 1 ? 0 : (i * (W - PAD.l - PAD.r)) / (n - 1));
    const y = (v) => PAD.t + (H - PAD.t - PAD.b) * (1 - v / maxY);

    const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
    const area = `${line} L${x(n - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;
    const grid = [0, 1, 2, 3, 4].map((k) => ({ value: step * k, y: y(step * k) }));
    const every = Math.max(1, Math.floor((n - 1) / 4));
    const xLabels = data.map((d, i) => ({ label: d.label, x: x(i), i })).filter((p) => p.i % every === 0);
    const points = data.map((d, i) => ({ x: x(i), y: y(d.value), label: d.label, value: d.value }));

    return { line, area, grid, xLabels, points };
  }, [data]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Activity chart">
      {chart.grid.map((g) => (
        <g key={g.value}>
          <line x1={PAD.l} x2={W - PAD.r} y1={g.y} y2={g.y} stroke="#4A1719" strokeOpacity="0.12" />
          <text x={PAD.l - 8} y={g.y + 4} textAnchor="end" fontSize="11" fill="#29231E" fillOpacity="0.7">
            {g.value}
          </text>
        </g>
      ))}
      <path d={chart.area} fill={color} fillOpacity="0.12" />
      <path d={chart.line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {chart.points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={color}>
          <title>{`${p.label}: ${prefix}${p.value}`}</title>
        </circle>
      ))}
      {chart.xLabels.map((p) => (
        <text key={p.i} x={p.x} y={H - 8} textAnchor="middle" fontSize="11" fill="#29231E" fillOpacity="0.7">
          {p.label}
        </text>
      ))}
    </svg>
  );
}