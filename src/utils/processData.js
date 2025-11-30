export function processCSVData(data) {
  const lang = {};
  const artist = {};

  data.forEach(row => {
    const streams = parseInt(row.total) || 0;
    const income = parseFloat(row.income) || 0;

    const language = row.language || "Unknown";
    const artistName = row.artist_name || "Unknown";

    if (!lang[language]) lang[language] = { name: language, streams: 0 };
    lang[language].streams += streams;

    if (!artist[artistName]) artist[artistName] = { name: artistName, income: 0 };
    artist[artistName].income += income;
  });

  return {
    languageData: Object.values(lang),
    artistIncomeData: Object.values(artist),
  };
}

export function buildPieData(data, labelKey, valueKey) {
  const map = {};

  data.forEach(row => {
    const label = row[labelKey] || "Unknown";
    const rawVal = row[valueKey] || 0;

    // convert number safely: removes commas, ₹, spaces etc.
    const value = parseFloat(String(rawVal).replace(/[,₹\s]/g, "")) || 0;

    if (!map[label]) map[label] = 0;
    map[label] += value;
  });

  const arr = Object.entries(map).map(([name, value]) => ({ name, value }));

  // calculate percent for tooltip/labels
  const total = arr.reduce((s, a) => s + a.value, 0) || 1;

  return arr.map(item => ({
    ...item,
    percent: (item.value / total) * 100
  }));
}
