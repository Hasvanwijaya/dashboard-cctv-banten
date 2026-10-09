"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import garduList from "../garduData.json";

// Dynamic import untuk Leaflet agar tidak error Server-Side Rendering (SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet/hooks";

// Konfigurasi Icon Marker Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Helper Komponen untuk animasi pergerakan peta (Fly To)
function MapFlyTo({ selectedGardu }: { selectedGardu: any }) {
  const map = useMap();
  useEffect(() => {
    if (
      selectedGardu &&
      typeof selectedGardu.lat === "number" &&
      typeof selectedGardu.lng === "number"
    ) {
      map.flyTo([selectedGardu.lat, selectedGardu.lng], 14, {
        duration: 1.5,
      });
    }
  }, [selectedGardu, map]);

  return null;
}

export default function MapDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGardu, setSelectedGardu] = useState<any>(null);

  // Perhitungan statistik ringkasan status gardu
  const totalGardu = garduList.length;
  const totalOnline = garduList.filter((g: any) => g.status !== "OFFLINE").length;
  const totalOffline = garduList.filter((g: any) => g.status === "OFFLINE").length;

  // Filter pencarian
  const filteredGardu = garduList.filter((gardu) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = gardu.name?.toLowerCase().includes(term);
    const locationMatch = gardu.location?.toLowerCase().includes(term);
    const ipMatch = gardu.ipAddress?.toLowerCase().includes(term);
    return nameMatch || locationMatch || ipMatch;
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-white font-sans">
      {/* SIDEBAR KIRI */}
      <div className="w-80 h-full bg-slate-900 flex flex-col border-r border-slate-800 shadow-xl z-10">
        {/* Header Sidebar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900">
          <h1 className="font-bold text-lg text-blue-400 tracking-wide">
            PLN UP2D BANTEN
          </h1>
          <p className="text-xs text-slate-400">
            Monitoring CCTV Gardu Induk
          </p>
        </div>

        {/* STAT CARDS (RINGKASAN STATUS) */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/80">
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Total Gardu */}
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-medium">Total</div>
              <div className="text-base font-bold text-blue-400">{totalGardu}</div>
              <div className="text-[9px] text-slate-500">GI</div>
            </div>

            {/* Online */}
            <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/50">
              <div className="text-[10px] text-emerald-300 font-medium">Online</div>
              <div className="text-base font-bold text-emerald-400">{totalOnline}</div>
              <div className="text-[9px] text-emerald-500/80">GI</div>
            </div>

            {/* Offline */}
            <div className="bg-rose-950/40 p-2 rounded-lg border border-rose-800/50">
              <div className="text-[10px] text-rose-300 font-medium">Offline</div>
              <div className="text-base font-bold text-rose-400">{totalOffline}</div>
              <div className="text-[9px] text-rose-500/80">GI</div>
            </div>
          </div>
        </div>

        {/* KOLOM PENCARIAN */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/50">
          <input
            type="text"
            placeholder="🔍 Cari Gardu / Wilayah / IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 text-sm bg-slate-950 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 placeholder-slate-500"
          />
          <p className="text-[10px] text-slate-400 mt-1.5">
            Menampilkan {filteredGardu.length} dari {garduList.length} Gardu
          </p>
        </div>

        {/* DAFTAR GARDU (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredGardu.length > 0 ? (
            filteredGardu.map((gardu) => (
              <div
                key={gardu.id}
                onClick={() => setSelectedGardu(gardu)}
                className={`p-3 rounded-lg transition cursor-pointer border ${
                  selectedGardu?.id === gardu.id
                    ? "bg-blue-600/20 border-blue-500/80"
                    : "bg-slate-800/40 hover:bg-slate-800 border-slate-700/50"
                }`}
              >
                <div className="font-semibold text-sm text-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="text-rose-500">📍</span> {gardu.name}
                  </span>
                  {gardu.status === "OFFLINE" ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">OFFLINE</span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">ONLINE</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{gardu.location}</div>
                <div className="text-[11px] text-blue-400 font-mono mt-1">
                  IP: {gardu.ipAddress}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-xs text-slate-500 py-6">
              Gardu Induk tidak ditemukan
            </div>
          )}
        </div>
      </div>

      {/* PETA LEAFLET */}
      <div className="flex-1 h-full relative z-0">
        <MapContainer
          center={[-6.12, 106.15]}
          zoom={10}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyTo selectedGardu={selectedGardu} />

          {filteredGardu.map((gardu) => {
            if (typeof gardu.lat !== "number" || typeof gardu.lng !== "number") {
              return null;
            }

            const isOffline = gardu.status === "OFFLINE";

            return (
              <Marker
                key={gardu.id}
                position={[gardu.lat, gardu.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => setSelectedGardu(gardu),
                }}
                ref={(ref) => {
                  if (ref && selectedGardu?.id === gardu.id) {
                    ref.openPopup();
                  }
                }}
              >
                <Popup>
                  <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl min-w-[280px] border border-slate-700">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-white leading-tight">
                        {gardu.name}
                      </h3>
                      <p className="text-xs text-slate-400">{gardu.location}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700/80 flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-slate-300">
                        Status Jaringan Kamera
                      </span>
                      {isOffline ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-800/50">
                          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                          OFFLINE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          ONLINE
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-slate-800">
                        <span className="text-slate-400">IP Host / NVR:</span>
                        <span className="font-mono text-blue-400 font-semibold">
                          {gardu.ipAddress}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-800">
                        <span className="text-slate-400">Jumlah Kamera:</span>
                        <span className="text-slate-200 font-semibold">
                          {gardu.cameraCount || "4"} Unit
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-400">Pengecekan Terakhir:</span>
                        <span className="text-slate-200">
                          {gardu.lastCheck || "Baru Saja"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}