import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';

const Table = ({ data, columns, title }) => {
    const [filteredData, setFilteredData] = useState([]);

    // Controls State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(13);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Initialize filteredData when data prop changes
    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    // 1. Search Logic
    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const results = data.filter(item =>
            columns.some(col =>
                String(item[col.key] || '').toLowerCase().includes(lowerTerm)
            )
        );
        setFilteredData(results);
        setCurrentPage(1); // Reset to page 1 on search
    }, [searchTerm, data, columns]);

    // 2. Sorting Logic
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sorted = [...filteredData].sort((a, b) => {
            // Basic number detection
            const valA = isNaN(parseFloat(a[key])) ? a[key] : parseFloat(a[key]);
            const valB = isNaN(parseFloat(b[key])) ? b[key] : parseFloat(b[key]);

            if (valA < valB) return direction === 'ascending' ? -1 : 1;
            if (valA > valB) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setFilteredData(sorted);
    };

    // 3. Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    // Helper for Sort Icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown size={14} className="text-gray-400 opacity-50" />;
        return sortConfig.direction === 'ascending'
            ? <ArrowUp size={14} className="text-gray-800" />
            : <ArrowDown size={14} className="text-gray-800" />;
    };

    return (
        <div className="bg-white shadow-sm border border-gray-200 w-full mx-auto rounded-sm overflow-hidden font-sans">

            {/* --- HEADER --- */}
            <div className="relative bg-[#FFF8E7] py-10 px-6 border-b border-gray-200 overflow-hidden">
                <div className="flex flex-col items-center justify-center relative z-10">
                    <h1 className="text-4xl text-black tracking-wide mb-2">{title}</h1>
                    <div className="w-12 h-0.5 bg-black"></div>
                </div>

                {/* Abstract Graphic (CSS-only) */}
                <div className="absolute top-0 right-0 h-full w-24 md:w-48 bg-[#FF5A5F] hidden md:flex items-center justify-center">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-12 border-[#FFF8E7] bg-[#1A2B33]"></div>
                        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#FFF8E7]"></div>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">

                {/* --- CONTROLS --- */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">

                    {/* Entries */}
                    <div className="flex items-center text-sm text-gray-600">
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded leading-tight focus:outline-none focus:border-blue-500 mr-2"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={13}>13</option>
                            <option value={20}>20</option>
                        </select>
                        <span>entries per page</span>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
                        />
                    </div>
                </div>

                {/* --- DATA TABLE --- */}
                <div className="overflow-x-auto border border-gray-200 rounded-sm">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-[#D6EAF8] text-gray-900 font-bold">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => handleSort(col.key)}
                                        className="px-6 py-3 cursor-pointer hover:bg-blue-200 transition-colors select-none whitespace-nowrap group"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            {col.label}
                                            <span className="group-hover:opacity-100 transition-opacity">
                                                {getSortIcon(col.key)}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {currentRows.length > 0 ? (
                                currentRows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                        {columns.map((col) => (
                                            <td key={`${rowIndex}-${col.key}`} className="px-6 py-4 text-gray-700 font-medium">
                                                {(() => {
                                                    const raw = String(row[col.key] || "")
                                                        .replace(/^"|"$/g, "")
                                                        .replace(/^\[|\]$/g, "")
                                                        .trim();

                                                    
                                                    if (!/^-?\d+(\.\d+)?$/.test(raw.replace(/,/g, ''))) return raw;

                                                    // Truncate: split at dot and slice fractional part to 3 digits
                                                    const parts = raw.split('.');
                                                    if (parts.length === 1) return parts[0];
                                                    const intPart = parts[0];
                                                    const frac = (parts[1] || '').slice(0, 3).padEnd(3, '0');
                                                    return `${intPart}.${frac}`;
                                                })()}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 italic">
                                        No matching records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- FOOTER --- */}
                <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                    <div>
                        Showing {filteredData.length > 0 ? indexOfFirstRow + 1 : 0} to {Math.min(indexOfLastRow, filteredData.length)} of {filteredData.length} entries
                    </div>

                    {/* Simple Page Indicators (Optional) */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => (indexOfLastRow < filteredData.length ? p + 1 : p))}
                            disabled={indexOfLastRow >= filteredData.length}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Table
