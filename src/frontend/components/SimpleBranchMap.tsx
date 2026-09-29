import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { SiGooglemaps, SiWaze } from 'react-icons/si';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import rtvLogo from '../../resources/logos/RTV LOGO CIRCULAR.png';
import rtpLogo from '../../resources/logos/RTP LOGO CIRCULAR.png';
import { Branch } from '../../backend/data/branches';

// Pin para sedes RTV
const RtvPinIcon = L.divIcon({
    className: 'custom-logo-pin-icon',
    html: `
      <div class="map-pin-wrapper">
        <div class="map-pin-body map-pin-body-branch">
          <div class="map-pin-logo">
            <img src="${rtvLogo}" alt="RTV Logo" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>
      </div>
    `,
    iconSize: [60, 80],
    iconAnchor: [30, 80]
});

// Pin para sedes RTP
const RtpPinIcon = L.divIcon({
    className: 'custom-logo-pin-icon',
    html: `
      <div class="map-pin-wrapper">
        <div class="map-pin-body map-pin-body-branch">
          <div class="map-pin-logo">
            <img src="${rtpLogo}" alt="RTP Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
          </div>
        </div>
      </div>
    `,
    iconSize: [60, 80],
    iconAnchor: [30, 80]
});

interface SimpleBranchMapProps {
    branch: Branch;
}

export default function SimpleBranchMap({ branch }: SimpleBranchMapProps) {
    const handleGoogleMaps = () => {
        if (branch.googleMapsUrl) {
            window.open(branch.googleMapsUrl, '_blank', 'noopener,noreferrer');
        } else {
            const [lat, lng] = branch.position;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleWaze = () => {
        if (branch.wazeUrl) {
            window.open(branch.wazeUrl, '_blank', 'noopener,noreferrer');
        } else {
            const [lat, lng] = branch.position;
            const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="relative h-full w-full">
            <div className="h-full w-full overflow-hidden">
                <MapContainer
                    center={branch.position}
                    zoom={15}
                    scrollWheelZoom
                    zoomControl={false}
                    attributionControl={false}
                    className="w-full h-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={branch.position}
                        icon={branch.type === 'RTP' ? RtpPinIcon : RtvPinIcon}
                    >
                        <Popup offset={[-6, -50]} className="custom-popup">
                            <div className="space-y-0.5 text-[10px] leading-tight min-w-[120px]">
                                <p className="text-[8px] uppercase tracking-wide text-gray-500 mb-0.5 font-bold">
                                    {branch.type}
                                </p>
                                <p className="font-bold text-gray-900 text-[11px] leading-tight">
                                    {branch.name}
                                </p>
                                <p className="text-gray-600 leading-tight text-[9px]">
                                    {branch.address}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Botones de navegación */}
            <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                    onClick={handleGoogleMaps}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-2.5 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 border border-orange-200"
                >
                    <SiGooglemaps className="text-sm" />
                    Google Maps
                </button>

                <button
                    onClick={handleWaze}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 border border-gray-300"
                >
                    <SiWaze className="text-sm text-gray-600" />
                    Waze
                </button>
            </div>
        </div>
    );
}
