"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// ── Shared color constants ──────────────────────────────────────────────────
const COLOR_PRIMARY = "#8b5cf6";
const COLOR_GREEN = "#22c55e";
const COLOR_BLUE = "#3b82f6";
const COLOR_MUTED = "#94a3b8";
const COLOR_ORANGE = "#f59e0b";

const CHART_TOOLTIP_STYLE = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--card-foreground)",
  fontSize: 13,
} as const;

const AXIS_TICK = { fontSize: 12, fill: "var(--muted-foreground)" } as const;

const STATUS_COLORS: Record<string, string> = {
  TODO: COLOR_MUTED,
  IN_PROGRESS: COLOR_BLUE,
  IN_REVIEW: COLOR_ORANGE,
  DONE: COLOR_GREEN,
};

export function DashboardBarChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <div className="h-[280px]">
      {data.some((d) => d.count > 0) ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="status" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={STATUS_COLORS[entry.status.replace(" ", "_").toUpperCase()] ?? COLOR_PRIMARY} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
          No tasks yet
        </div>
      )}
    </div>
  );
}

export function DashboardPieChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <div className="h-[280px]">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
          No tasks yet
        </div>
      )}
    </div>
  );
}

export function WeeklyActivityChart({
  data,
}: {
  data: { day: string; tasks: number; completed: number }[];
}) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLOR_PRIMARY} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLOR_PRIMARY} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLOR_GREEN} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLOR_GREEN} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{value}</span>
            )}
          />
          <Area type="monotone" dataKey="tasks" name="Tasks Created" stroke={COLOR_PRIMARY} fill="url(#tasksGradient)" strokeWidth={2} dot={{ r: 3, fill: COLOR_PRIMARY }} />
          <Area type="monotone" dataKey="completed" name="Completed" stroke={COLOR_GREEN} fill="url(#completedGradient)" strokeWidth={2} dot={{ r: 3, fill: COLOR_GREEN }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminWeeklyChart({
  data,
}: {
  data: { day: string; users: number; active: number }[];
}) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLOR_PRIMARY} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLOR_PRIMARY} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLOR_BLUE} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLOR_BLUE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{value}</span>
            )}
          />
          <Area type="monotone" dataKey="users" name="New Users" stroke={COLOR_PRIMARY} fill="url(#usersGradient)" strokeWidth={2} dot={{ r: 3, fill: COLOR_PRIMARY }} />
          <Area type="monotone" dataKey="active" name="Activated" stroke={COLOR_BLUE} fill="url(#activeGradient)" strokeWidth={2} dot={{ r: 3, fill: COLOR_BLUE }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaskDistributionChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="h-[260px] flex flex-col items-center justify-center gap-4">
      {data.length > 0 && total > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(value, name) => [`${value ?? 0}`, `${name ?? ""}`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {data.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="text-muted-foreground text-sm">No tasks yet</div>
      )}
    </div>
  );
}

export function AdminBarChart({
  data,
}: {
  data: { day: string; users: number; active: number }[];
}) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={20} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{value}</span>
            )}
          />
          <Bar dataKey="users" name="New Users" fill={COLOR_PRIMARY} radius={[4, 4, 0, 0]} />
          <Bar dataKey="active" name="Activated" fill={COLOR_BLUE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
