import { useMemo } from 'react';

// SVG को आकार (भित्री नाप। स्क्रिन अनुसार आफैं सानो/ठूलो हुन्छ)
const W = 700;
const H = 260;
const PAD = { l: 44, r: 16, t: 16, b: 32 };

export default function VisitorsChart({ data }) {
  // useMemo = data नबदलिएसम्म गणित फेरि नगर्ने
  const chart = useMemo(() => {
    const n = data.length;
    const maxValue = Math.max(...data.map((d) => d.visitors), 1);
    const maxY = Math.ceil(maxValue / 25) * 25; // माथिल्लो सीमा, २५ को गुणनमा

    const x = (i) => PAD.l + (i * (W - PAD.l - PAD.r)) / (n - 1);
    const y = (v) => PAD.t + (H - PAD.t - PAD.b) * (1 - v / maxY);

    const toPath = (key) =>
      data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ');

    const visitorsPath = toPath('visitors');
    const reservationsPath = toPath('reservations');
    const areaPath = `${visitorsPath} L${x(n - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;

    // ४ वटा आडा ग्रिड रेखा
    const grid = [0, 1, 2, 3, 4].map((k) => {
      const value = (maxY / 4) * k;
      return { value: Math.round(value), y: y(value) };
    });

    // x-अक्षमा करिब ५ वटा मात्र मिति देखाउने
    const step = Math.max(1, Math.floor((n - 1) / 4));
    const xLabels = data
      .map((d, i) => ({ label: d.label, x: x(i), i }))
      .filter((p) => p.i % step === 0);

    return { visitorsPath, reservationsPath, areaPath, grid, xLabels };
  }, [data]);

  return (
    <div>
      <div className="mb-2 flex gap-5 text-xs text-brown/80">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-maroon" /> Visitors
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Reservations
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Visitors and reservations chart"
      >
        {/* ग्रिड रेखा र बायाँका नम्बर */}
        {chart.grid.map((g) => (
          <g key={g.value}>
            <line x1={PAD.l} x2={W - PAD.r} y1={g.y} y2={g.y} stroke="#4A1719" strokeOpacity="0.12" />
            <text x={PAD.l - 8} y={g.y + 4} textAnchor="end" fontSize="11" fill="#29231E" fillOpacity="0.7">
              {g.value}
            </text>
          </g>
        ))}

        {/* Visitors को तलको छायाँ */}
        <path d={chart.areaPath} fill="#8E3028" fillOpacity="0.12" />

        {/* दुई रेखा */}
        <path d={chart.visitorsPath} fill="none" stroke="#4A1719" strokeWidth="2.5" strokeLinejoin="round" />
        <path d={chart.reservationsPath} fill="none" stroke="#DDA44C" strokeWidth="2.5" strokeLinejoin="round" />

        {/* तलका मिति */}
        {chart.xLabels.map((p) => (
          <text key={p.i} x={p.x} y={H - 8} textAnchor="middle" fontSize="11" fill="#29231E" fillOpacity="0.7">
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}