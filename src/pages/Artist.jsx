import React, { useMemo } from 'react';
import { usePublicCsv } from '../hooks/usePublicCsv';
import Table from '../components/Table';

const CSV_FILENAME = '/jiosaavn-report (1).csv';

export default function Artist() {
  const { data, loading, error } = usePublicCsv(CSV_FILENAME);

  const columns = useMemo(() => [
    { key: 'artist_name', label: 'Artist' },
    { key: 'income', label: 'Revenue' },
    { key: 'total', label: 'Total' }
  ], []);

  if (loading) return <div className="p-8">Loading CSV...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <Table title="Artists" data={data} columns={columns} initialRowsPerPage={13} />
    </div>
  );
}
