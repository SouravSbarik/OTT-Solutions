const JIO_PATH = "/jiosaavn-report (1).csv";
const AIRTEL_PATH = "/wynk-report.csv";

const NUM_KEYS = ["value","count","total","streams","amount","qty","quantity","plays","income"];
const NAME_KEYS = ["language","lang","language_name","artist_name","artist","name"];

// safe parse numeric
function toNum(v){
  if (v == null) return 0;
  const s = String(v).replace(/[,\s₹]/g,"");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}


function findKey(headers, candidates){
  const lower = headers.map(h => String(h).toLowerCase());
  for (const c of candidates){
    const idx = lower.indexOf(c.toLowerCase());
    if (idx !== -1) return headers[idx];
  }
  return null;
}


export function buildCallerTuneAggregation(rowsJio, rowsAirtel, options = {}) {
  const aggr = {};
  const headersJio = rowsJio && rowsJio.length ? Object.keys(rowsJio[0]) : [];
  const headersAirtel = rowsAirtel && rowsAirtel.length ? Object.keys(rowsAirtel[0]) : [];

  const groupKey = options.groupBy || findKey(headersJio.concat(headersAirtel), NAME_KEYS) || "language";

  const jioNumKey = options.jioKey || findKey(headersJio, NUM_KEYS) || findKey(headersAirtel, NUM_KEYS) || "value";
  const airtelNumKey = options.airtelKey || findKey(headersAirtel, NUM_KEYS) || findKey(headersJio, NUM_KEYS) || "value";
  const viNumKey = options.viKey || "vi";

  function addTo(name, source, value){
    if (!aggr[name]) aggr[name] = { name, jio:0, airtel:0, vi:0 };
    aggr[name][source] += value;
  }

  // process jio rows
  if (rowsJio && rowsJio.length){
    for (const r of rowsJio){
      const name = r[groupKey] ?? r.language ?? r.artist_name ?? r.artist ?? "Unknown";
      const val = toNum(r[jioNumKey] ?? r.value ?? r.total ?? r.streams ?? 0);
      addTo(String(name), "jio", val);
      // if Jio CSV also contains vi/airtel columns, try to read them too
      if (r[viNumKey] !== undefined) addTo(String(name), "vi", toNum(r[viNumKey]));
      if (r["airtel"] !== undefined) addTo(String(name), "airtel", toNum(r["airtel"]));
    }
  }

  // process airtel rows
  if (rowsAirtel && rowsAirtel.length){
    for (const r of rowsAirtel){
      const name = r[groupKey] ?? r.language ?? r.artist_name ?? r.artist ?? "Unknown";
      const val = toNum(r[airtelNumKey] ?? r.value ?? r.total ?? r.streams ?? 0);
      addTo(String(name), "airtel", val);
      if (r[viNumKey] !== undefined) addTo(String(name), "vi", toNum(r[viNumKey]));
      if (r["jio"] !== undefined) addTo(String(name), "jio", toNum(r["jio"]));
    }
  }

  // Convert to array and compute percentages
  const arr = Object.values(aggr).map(item => {
    const total = (item.jio || 0) + (item.airtel || 0) + (item.vi || 0) || 1;
    return {
      name: item.name,
      jio: item.jio || 0,
      airtel: item.airtel || 0,
      vi: item.vi || 0,
      jioPct: (item.jio / total) * 100,
      airtelPct: (item.airtel / total) * 100,
      viPct: (item.vi / total) * 100,
      total
    };
  });

  // sort by total desc for nicer chart
  arr.sort((a,b) => b.total - a.total);

  return { data: arr, meta: { groupKey, jioNumKey, airtelNumKey, viNumKey } };
}


export function fetchAndParseCSV(path) {
  return fetch(path)
    .then(res => {
      if (!res.ok) throw new Error("Failed to load " + path);
      return res.text();
    })
    .then(text => new Promise((resolve, reject) => {
      // dynamic import of Papa if needed in browser env; the component already imports Papa
      // but here we assume Papa available globally or imported in calling module.
      try {
        // parse CSV text quickly (header:true)
        const results = Papa.parse(text, { header: true, skipEmptyLines: true });
        resolve(results.data);
      } catch (err) {
        reject(err);
      }
    }));
}
