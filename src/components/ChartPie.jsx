import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import PieChartCard from "./PieChartCard";
import { buildPieData } from "../utils/processData";

const CHARTS = {
  "Language and Total Revenue": {
    labelKey: "language",
    valueKey: "total",
    topN: null
  },
};

export default function ChartPie({ title }) {
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CSV_PATH = "/jiosaavn-report (1).csv";

  useEffect(() => {
    let cancelled = false;

    fetch(CSV_PATH)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch CSV");
        return res.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (cancelled) return;

            const cfg = CHARTS[title] ?? CHARTS["Language and Total Revenue"];
            const built = buildPieData(result.data, cfg.labelKey, cfg.valueKey);

            built.sort((a,b) => b.value - a.value);
            const final = cfg.topN ? built.slice(0, cfg.topN) : built;

            setPieData(final);
            setLoading(false);
          },
          error: (err) => {
            if (cancelled) return;
            setError("CSV parse error: " + err.message);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [title]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!pieData || pieData.length === 0) return <div className="p-4">No data</div>;

  return <PieChartCard title={title} data={pieData} />;
}


