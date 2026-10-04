"use client";

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const axisTick = { fontSize: 11, fontWeight: 700, fill: "#94A3B8" };

function ChartTooltip({ active, payload, label, prefix = "" }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string; prefix?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-[12.5px] shadow-lg">
      {label && <p className="font-extrabold text-[#24324A]">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="font-bold text-[#64748B]">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: p.color ?? "#38BDF8" }} aria-hidden />
          {p.name}: <span className="font-extrabold text-[#24324A]">{prefix}{Number(p.value).toLocaleString("en-IN")}</span>
        </p>
      ))}
    </div>
  );
}

export function GrowthLine({ data }: { data: Array<{ m: string; students: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="m" tick={axisTick} axisLine={false} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="students" name="Students" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: "#38BDF8", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AttendanceArea({ data }: { data: Array<{ d: string; present: number; absent: number; late: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="d" tick={axisTick} axisLine={false} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
        <Area type="monotone" dataKey="present" name="Present" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.25} strokeWidth={2.5} />
        <Area type="monotone" dataKey="late" name="Late" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} strokeWidth={2.5} />
        <Area type="monotone" dataKey="absent" name="Absent" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.25} strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CollectionBar({ data }: { data: Array<{ m: string; amount: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="m" tick={axisTick} axisLine={false} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `৳${Math.round(v / 1000)}k`} />
        <Tooltip content={<ChartTooltip prefix="৳" />} />
        <Bar dataKey="amount" name="Collection" fill="#A78BFA" radius={[8, 8, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DistributionDonut({ data }: { data: Array<{ name: string; value: number; color: string }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} strokeWidth={0}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
