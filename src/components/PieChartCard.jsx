import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#EF4444", "#F59E0B", "#3B82F6", "#A78BFA", "#34D399", "#F97316"];

export default function PieChartCard({ title, data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name, percent }) => `${name}`}
              labelLine
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                const percent = (props && props.payload && props.payload.percent)
                  ? props.payload.percent
                  : 0;
                return [`${value.toLocaleString()} (${(percent*100).toFixed(1)}%)`, name];
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
