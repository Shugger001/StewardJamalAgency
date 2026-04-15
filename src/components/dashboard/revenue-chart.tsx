"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 14200 },
  { month: "Mar", revenue: 13800 },
  { month: "Apr", revenue: 16100 },
  { month: "May", revenue: 17400 },
  { month: "Jun", revenue: 18900 },
];

export function RevenueChart() {
  return (
    <div className="min-h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 6"
            vertical={false}
            stroke="#e4e4e7"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickFormatter={(v) =>
              v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
            }
            width={48}
          />
          <Tooltip
            cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: "0.75rem",
              border: "1px solid #e4e4e7",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              fontSize: "0.75rem",
            }}
            formatter={(value) => {
              const v = typeof value === "number" ? value : Number(value);
              const formatted = Number.isFinite(v)
                ? v.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })
                : "—";
              return [formatted, "Revenue"];
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#0A66FF"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#0A66FF", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
