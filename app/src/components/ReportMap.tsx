/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Report {
  _id: string;
  title: string;
  reportType: string;
  details: string;
  reportedBy: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

// Props: reports = [{ id, latitude, longitude, description, name }]
export default function ReportsMap({ reports }: { reports: Report[] }) {
  return (
    <div className="w-full h-[600px] rounded-2xl shadow-lg overflow-hidden">
      <MapContainer
        center={[20.5937, 78.9629]} // default center (India)
        zoom={5}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Background Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Reports Markers */}
        {reports.map((report) => (
          <Marker
            key={report._id}
            position={[
              report.location.coordinates[1],
              report.location.coordinates[0],
            ]}
          >
            {/* Tooltip on Hover */}
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <span>
                <b>{report.title}</b> <br />
                Reported by {report.reportedBy}
              </span>
            </Tooltip>

            {/* Popup on Click */}
            <Popup>
              <div>
                <h3 className="font-semibold">{report.title}</h3>
                <p>{report.details}</p>
                <p className="text-sm text-gray-500">
                  Type:{" "}
                  <span className="text-gray-800">
                    {report.reportType === "illness"
                      ? "Illness"
                      : report.reportType === "outbreak"
                      ? "Outbreak"
                      : "Mental Health Crisis"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Reported by:{" "}
                  <span className="text-gray-800">{report.reportedBy}</span>
                </p>
                <small>
                  Lat: {report.location.coordinates[1]}, Lng:{" "}
                  {report.location.coordinates[0]}
                </small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
