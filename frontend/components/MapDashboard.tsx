"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Activity, AlertTriangle, CheckCircle, Wifi, WifiOff } from "lucide-react";

// Import data Gardu Induk Banten dari JSON
import garduList from "../garduData.json";

// Fix icon default Leaflet di Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapDashboard() {
  const [selectedGardu, setSelectedGardu] = useState<typeof garduList[0] | null>(null);

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      {/* Sidebar Info */}
      <aside className="w-80 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-blue-500 w-7 h-7" />
            <div>
              <h1 className="text-lg font-bold tracking-wide">Monitoring GI Banten</h1>
              <p className="text-xs text-slate-400">PLN UP2D Banten</p>
            </div>
          </div>

          {/* Stat Box */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">Total GI</span>
              <p className="text-2xl font-bold mt-1">{garduList.length}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">Status Active</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {garduList.filter((g) => g.status === "online").length}
              </p>
            </div>
          </div>

          <h2 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Daftar Gardu Induk ({garduList.length})
          </h2>

          <div className="space-y-2 overflow-y-auto max-h-[55vh] pr-1">
            {garduList.map((gardu) => (
              <div
                key={gardu.id}
                onClick={() => setSelectedGardu(gardu)}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                  selectedGardu?.id === gardu.id
                    ? "bg-blue-600/20 border-blue-500"
                    : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{gardu.name}</p>
                  <span className="text-xs text-slate-400">{gardu.up3}</span>
                </div>
                {gardu.status === "online" ? (
                  <CheckCircle className="text-emerald-400 w-4 h-4" />
                ) : (
                  <AlertTriangle className="text-rose-500 w-4 h-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center">Project Magang UP2D Banten © 2026</p>
      </aside>

      {/* Main Content Area (Peta) */}
      <main className="flex-1 relative flex flex-col">
        <div className="w-full h-full">
          <MapContainer center={[-6.2, 106.1]} zoom={9} className="w-full h-full z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {garduList.map((gardu) => (
              <Marker
                key={gardu.id}
                position={[gardu.lat, gardu.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => setSelectedGardu(gardu),
                }}
              >
                <Popup>
                  <div className="text-slate-900 font-sans">
                    <strong className="block text-sm">{gardu.name}</strong>
                    <span className="text-xs text-slate-600">{gardu.up3}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Panel Detail Status Koneksi CCTV */}
        {selectedGardu && (
          <div className="absolute bottom-6 right-6 w-96 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-white">{selectedGardu.name}</h3>
                <p className="text-xs text-slate-400">{selectedGardu.up3}</p>
              </div>
              <button
                onClick={() => setSelectedGardu(null)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-700 rounded-md"
              >
                Tutup
              </button>
            </div>

            {/* Indikator Status Active/Down */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 mb-4">
              <span className="text-xs text-slate-300">Status Jaringan Kamera</span>
              {selectedGardu.status === "online" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Wifi className="w-3.5 h-3.5" />
                  ONLINE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <WifiOff className="w-3.5 h-3.5" />
                  OFFLINE
                </span>
              )}
            </div>

            {/* Parameter Teknis */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-700/40">
                <span className="text-slate-400">IP Host / NVR:</span>
                <span className="font-mono text-blue-400">{selectedGardu.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/40">
                <span className="text-slate-400">Jumlah Kamera:</span>
                <span className="font-mono">{selectedGardu.cctvCount} Unit</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Pengecekan Terakhir:</span>
                <span className="font-mono text-slate-400">Baru Saja</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}