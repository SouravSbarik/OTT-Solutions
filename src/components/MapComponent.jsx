import React, { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";
import { MapPin, DollarSign, BarChart3, TrendingUp, Music } from "lucide-react";
import LeafletChoropleth from "./LeafletChoropleth";

const MapComponent = () => {
  const [csvData, setCsvData] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Papa.parse("/wynk-report.csv", {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (result) => {
        setLoading(false);
        if (result && Array.isArray(result.data) && result.data.length > 0) {
          setCsvData(result.data);
        } else {
          setCsvData([]);
        }
      },
      error: (err) => {
        setLoading(false);
        setError("Couldn't load Data.");
      },
    });
  }, []);

  const locationStats = useMemo(() => {
    if (!csvData || csvData.length === 0) return [];

    const stats = {};

    csvData.forEach((row) => {
      const location = (row.file_name || row.fileName || row.FileName || row.location || "Unknown").trim();
      const income = parseFloat(row.income || row.Income || row.income_usd || row.revenue || 0) || 0;
      const royalty = parseFloat(row.royality || row.royalty || row.Royality || 0) || 0;
      const streams = parseInt(row.total || row.Total || row.streams || row.play_count || 0, 10) || 0;
      const songName = row.song_name || row.songName || row.SongName || row.title || "";

      if (!stats[location]) {
        stats[location] = {
          location,
          totalIncome: 0,
          totalRoyalty: 0,
          totalStreams: 0,
          songCount: 0,
          topSong: songName,
          maxStreams: streams,
          songs: [],
        };
      }

      stats[location].totalIncome += income;
      stats[location].totalRoyalty += royalty;
      stats[location].totalStreams += streams;
      stats[location].songCount += 1;

      if (streams > stats[location].maxStreams) {
        stats[location].maxStreams = streams;
        stats[location].topSong = songName;
      }

      stats[location].songs.push({
        ...row,
        song_name: songName,
        income,
        royalty,
        total: streams,
      });
    });

    return Object.values(stats);
  }, [csvData]);

  const totalRevenue = locationStats.reduce((acc, curr) => acc + curr.totalIncome, 0);
  const totalStreams = locationStats.reduce((acc, curr) => acc + curr.totalStreams, 0);

  return (
    <div className="min-h-screen mt-10 rounded-2xl bg-gray-50 p-6 font-sans text-slate-800">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">City Trend</h1>
      </header>

      {/* CSV status */}
      <div className="mb-6 flex items-center gap-4">
        {loading && <span className="text-sm text-slate-500">Loading CSV...</span>}
        {!loading && error && <span className="text-sm text-rose-500">{error}</span>}
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-800">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-purple-50 rounded-full text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Streams</p>
            <p className="text-2xl font-bold text-slate-800">{totalStreams.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-green-50 rounded-full text-green-600">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Locations</p>
            <p className="text-2xl font-bold text-slate-800">{locationStats.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: list + map */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Location Breakdown</h2>

          {locationStats.length === 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-100 text-slate-500">
              No location data available. Upload a CSV or place <code>wynk-report.csv</code> in public/.
            </div>
          )}

          {locationStats.map((stat, index) => (
            <div
              key={stat.location}
              onClick={() => setActiveLocation(stat.location === activeLocation ? null : stat.location)}
              className={`
                group bg-white rounded-xl p-5 border cursor-pointer transition-all duration-200
                ${activeLocation === stat.location
                  ? "border-blue-500 shadow-md ring-1 ring-blue-100"
                  : "border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200"}
              `}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                      ${index % 2 === 0 ? "bg-indigo-100 text-indigo-600" : "bg-rose-100 text-rose-600"}
                    `}
                  >
                    {stat.location.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{stat.location}</h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Music size={12} /> {stat.songCount} Tracks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-12">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Streams</p>
                    <p className="font-bold text-slate-700">{stat.totalStreams.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Income</p>
                    <p className="font-bold text-emerald-600">${stat.totalIncome.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {activeLocation === stat.location && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <span className="text-slate-500 block text-xs mb-1">Top Performing Track</span>
                      <span className="font-medium text-slate-800 truncate block" title={stat.topSong}>
                        {stat.topSong}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                      <span className="text-slate-500 text-xs">Royalty Share</span>
                      <span className="font-medium text-slate-800">${stat.totalRoyalty.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Track List</p>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                      {stat.songs.map((song, idx) => (
                        <div key={idx} className="flex justify-between text-xs p-2 hover:bg-slate-50 rounded">
                          <span className="truncate w-2/3 text-slate-600" title={song.song_name}>
                            {song.song_name}
                          </span>
                          <span className="font-medium text-slate-900">${parseFloat(song.income || 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Choropleth map */}
          <div className="mt-4">
            <LeafletChoropleth stats={locationStats} valueKey="totalIncome" />
          </div>
        </div>

        {/* Right: summary (unchanged) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Analytics Overview
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-600">Revenue Distribution</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  {totalRevenue > 0 ? (
                    locationStats.map((stat, idx) => {
                      const width = (stat.totalIncome / totalRevenue) * 100;
                      const colors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-rose-500", "bg-amber-500"];
                      return (
                        <div
                          key={stat.location}
                          style={{ width: `${width}%` }}
                          className={`${colors[idx % colors.length]} hover:opacity-90 transition-opacity cursor-help`}
                          title={`${stat.location}: ${width.toFixed(1)}%`}
                        />
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-400 p-2">No revenue data</div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {locationStats.map((stat, idx) => {
                    const colors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-rose-500", "bg-amber-500"];
                    return (
                      <div key={stat.location} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`}></div>
                        <span className="text-xs text-slate-500">{stat.location}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Top Location</p>
                {locationStats.length > 0 ? (
                  <>
                    <h4 className="text-2xl font-bold mb-1">
                      {locationStats.reduce((a, b) => (a.totalIncome > b.totalIncome ? a : b)).location}
                    </h4>
                    <p className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                      +${locationStats.reduce((a, b) => (a.totalIncome > b.totalIncome ? a : b)).totalIncome.toFixed(2)}
                      <span className="text-slate-400 text-xs font-normal">in revenue</span>
                    </p>
                  </>
                ) : (
                  <p className="text-slate-300 text-sm">No data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
