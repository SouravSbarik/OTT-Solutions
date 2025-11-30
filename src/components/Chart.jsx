import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import BarChartCard from "./BarChartCard";
import { processCSVData } from "../utils/processData";

export default function Chart({ title }) {
  const [languageData, setLanguageData] = useState([]);
  const [artistIncomeData, setArtistIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const filePath = "/jiosaavn-report (1).csv";

  useEffect(() => {
    fetch(filePath)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const processed = processCSVData(results.data);

            setLanguageData(processed.languageData);
            setArtistIncomeData(processed.artistIncomeData);

            setLoading(false);
          }
        });
      });
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  // Simple map of title → chart config
  const charts = {
    "Streams by Language": {
      data: languageData,
      dataKey: "streams",
      categoryKey: "name"
    },

    "Income by Artist": {
      data: artistIncomeData,
      dataKey: "income",
      categoryKey: "name"
    }
  };

  const config = charts[title];

  if (!config) return <p>No chart found for "{title}"</p>;

  return (
    <BarChartCard
      title={title}
      data={config.data}
      dataKey={config.dataKey}
      categoryKey={config.categoryKey}
    />
  );
}
