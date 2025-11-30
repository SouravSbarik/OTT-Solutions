import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * LeafletChoropleth
 * - stats: array of { location, totalIncome, totalStreams, topSong, ... }
 * - expects /world.geo.json in public/
 */

function normalizeName(s) {
  if (s === undefined || s === null) return "";
  return String(s)
    .toLowerCase()
    .replace(/[_\-\.\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getColorForValue(v, maxVal) {
  if (!v || maxVal <= 0) return "#f0f0f0";
  const p = v / maxVal;
  if (p > 0.9) return "#7f0000";
  if (p > 0.7) return "#b30000";
  if (p > 0.5) return "#d7301f";
  if (p > 0.3) return "#ef6548";
  if (p > 0.1) return "#fdae6b";
  return "#fde0dd";
}

const cityCoords = {
  Kolkata: [22.5726, 88.3639],
  Mumbai: [19.0760, 72.8777],
};

const LeafletChoropleth = ({ stats = [], valueKey = "totalIncome" }) => {
  const mapRef = useRef(null);
  const geoLayerRef = useRef(null);

  useEffect(() => {
    // Build a normalized map: name -> aggregated value
    const valueMap = new Map();
    stats.forEach((s) => {
      const key = normalizeName(s.location);
      const val = Number(s[valueKey] || 0);
      valueMap.set(key, (valueMap.get(key) || 0) + val);
    });
    const values = Array.from(valueMap.values());
    const maxVal = values.length ? Math.max(...values) : 1;

    // init map
    mapRef.current = L.map("leaflet-choropleth", {
      center: [15, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    // Info box
    const info = L.control({ position: "topright" });
    info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info leaflet-bar p-2 bg-white rounded shadow-sm");
      this.update();
      return this._div;
    };
    info.update = function (props) {
      if (!props) {
        this._div.innerHTML = `<strong>Hover a country</strong><br/>${valueKey}`;
      } else {
        const val = props.value === undefined ? "No data" : Number(props.value).toLocaleString();
        this._div.innerHTML = `<strong>${props.name}</strong><br/>${valueKey}: ${val}`;
      }
    };
    info.addTo(mapRef.current);

    // Legend
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend bg-white p-3 rounded shadow-sm text-xs");
      const grades = [0, 0.1, 0.3, 0.5, 0.7, 0.9];
      let html = `<div class="font-semibold mb-2">${valueKey} (relative)</div>`;
      grades.forEach((g, i) => {
        const val = Math.round(g * maxVal);
        const color = getColorForValue(g * maxVal, maxVal);
        const label = i === grades.length - 1 ? `>= ${Math.round(grades[i] * 100)}%` : `${val.toLocaleString()}`;
        html += `<div style="display:flex;align-items:center;gap:8px;"><i style="background:${color};width:18px;height:12px;display:inline-block;border:1px solid #ddd"></i> <span>${label}</span></div>`;
      });
      div.innerHTML = html;
      return div;
    };
    legend.addTo(mapRef.current);

    // load geojson and draw
    fetch("/world.geo.json")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load world.geo.json");
        return res.json();
      })
      .then((geojson) => {
        function style(feature) {
          const rawName = feature.properties?.name || feature.properties?.NAME || feature.properties?.admin || "";
          const val = valueMap.get(normalizeName(rawName)) ?? 0;
          return {
            fillColor: getColorForValue(val, maxVal),
            weight: 0.6,
            opacity: 1,
            color: "white",
            dashArray: "0",
            fillOpacity: val > 0 ? 0.9 : 0.45,
          };
        }

        function highlightFeature(e) {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            color: "#666",
            dashArray: "",
            fillOpacity: 0.95,
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
          }
          const name = layer.feature.properties?.name || layer.feature.properties?.NAME || layer.feature.properties?.admin || "Unknown";
          const val = valueMap.get(normalizeName(name)) ?? 0;
          info.update({ name, value: val });
        }

        function resetHighlight(e) {
          geoLayerRef.current.resetStyle(e.target);
          info.update();
        }

        function onEachFeature(feature, layer) {
          const name = feature.properties?.name || feature.properties?.NAME || feature.properties?.admin || "Unknown";
          const val = valueMap.get(normalizeName(name)) ?? 0;
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function () {
              const html = `<div style="min-width:160px"><strong>${name}</strong><br/>${valueKey}: ${Number(val).toLocaleString()}<br/></div>`;
              layer.bindPopup(html).openPopup();
            },
          });
        }

        geoLayerRef.current = L.geoJSON(geojson, { style, onEachFeature }).addTo(mapRef.current);

        try {
          mapRef.current.fitBounds(geoLayerRef.current.getBounds(), { padding: [20, 20] });
        } catch (e) {
          // ignore
        }

        // Add city markers (Kolkata & Mumbai). They always display, but their popup includes CSV stats if available.
        Object.entries(cityCoords).forEach(([cityName, [lat, lon]]) => {
          const normalized = normalizeName(cityName);
          const cityValue = valueMap.get(normalized) ?? 0;
          const popupHtml = `<div style="min-width:160px"><strong>${cityName}</strong><br/>${valueKey}: ${cityValue ? Number(cityValue).toLocaleString() : "No data"}</div>`;

          L.circleMarker([lat, lon], {
            radius: 6,
            fillColor: "#0b84ff",
            color: "#fff",
            weight: 1,
            fillOpacity: 0.95,
          })
            .addTo(mapRef.current)
            .bindPopup(popupHtml);
        });
      })
      .catch((err) => {
        console.error("Failed to load world.geo.json:", err);
      });

    // cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // re-run when stats or valueKey changes
  }, [stats, valueKey]);

  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
      <div id="leaflet-choropleth" className="w-full h-[520px]" style={{ minHeight: 360 }} />
    </div>
  );
};

export default LeafletChoropleth;
