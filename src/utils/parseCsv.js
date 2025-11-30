export function parseCSV(text) {
  if (!text) return [];

  // Normalize line endings and split lines
  const lines = text.replace(/\r\n/g, '\n').split('\n').filter(l => l.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    // naive split by comma (works for most simple CSVs)
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}
