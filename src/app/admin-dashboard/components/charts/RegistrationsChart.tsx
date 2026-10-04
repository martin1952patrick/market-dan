'use client';
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

interface Props {
  data: { week: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border px-3 py-2 shadow-modal text-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <p className="font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>{label}</p>
      <p style={{ color: 'var(--primary)' }}>{payload[0].value} new registrations</p>
    </div>
  );
};

export default function RegistrationsChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.count));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={22}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={24} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(194,105,42,0.06)' }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={`reg-cell-${i}`}
              fill={entry.count === max ? 'var(--primary)' : 'var(--muted)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}