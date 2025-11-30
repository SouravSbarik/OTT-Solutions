import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import Papa from "papaparse";
import { buildCallerTuneAggregation } from "../utils/processCallerTune";


const COLORS = {
  jio: "#3B82F6",
  airtel: "#EF4444",
  vi: "#F59E0B"
};

export default function CallerTuneStacked({ title = "Caller Tune Overview", groupBy = "language" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const CSV_JIO = "/jiosaavn-report (1).csv";
  const CSV_AIRTEL = "/wynk-report.csv";

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(CSV_JIO).then(r => r.text()).then(txt => Papa.parse(txt, { header: true, skipEmptyLines: true }).data),
      fetch(CSV_AIRTEL).then(r => r.text()).then(txt => Papa.parse(txt, { header: true, skipEmptyLines: true }).data)
    ])
    .then(([rowsJio, rowsAirtel]) => {
      if (cancelled) return;
      const { data: aggr } = buildCallerTuneAggregation(rowsJio, rowsAirtel, { groupBy });
      const chartData = aggr.map(d => ({
        name: d.name,
        jio: Number(d.jioPct.toFixed(2)),
        airtel: Number(d.airtelPct.toFixed(2)),
        vi: Number(d.viPct.toFixed(2))
      }));
      setData(chartData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      if (!cancelled) {
        setData([]);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [groupBy]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data || data.length === 0) return <div className="p-6">No data to display</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow border-black border">
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      <div style={{ width: "100%", height: 270 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            barCategoryGap="10%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip formatter={(value, name) => `${value}%`} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="vi" stackId="a" fill={COLORS.vi} />
            <Bar dataKey="airtel" stackId="a" fill={COLORS.airtel} />
            <Bar dataKey="jio" stackId="a" fill={COLORS.jio} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
