"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", tasks: 12, completed: 8 },
  { name: "Feb", tasks: 19, completed: 15 },
  { name: "Mar", tasks: 15, completed: 12 },
  { name: "Apr", tasks: 22, completed: 18 },
  { name: "May", tasks: 28, completed: 24 },
  { name: "Jun", tasks: 32, completed: 28 },
];

export function DashboardCharts() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="var(--primary)"
            fillOpacity={1}
            fill="url(#colorTasks)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
