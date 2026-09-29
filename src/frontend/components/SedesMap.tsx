import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl } from 'react-leaflet';
import { SiGooglemaps, SiWaze } from 'react-icons/si';
import { FaMapMarkerAlt, FaChevronRight, FaChevronLeft, FaWhatsapp, FaSearch, FaTimes, FaPhoneAlt, FaClock, FaDirections } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import rtvLogo from '../../resources/logos/RTV LOGO CIRCULAR.png';
import rtpLogo from '../../resources/logos/RTP LOGO CIRCULAR.png';
import { branches, Branch, whatsappUrl } from '../../backend/data/branches';
import { getConsent } from '../utils/consent';

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
    iconSize: [54, 72],
    iconAnchor: [27, 72]
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
    iconSize: [54, 72],
    iconAnchor: [27, 72]
});

// Pin destacado activo cuando se selecciona una sede
const createActivePinIcon = (type: 'RTP' | 'RTV') => L.divIcon({
    className: 'custom-logo-pin-icon active-pin-highlight',
    html: `
      <div class="map-pin-wrapper" style="transform: scale(1.18); z-index: 1000;">
        <div class="map-pin-body map-pin-body-branch" style="box-shadow: 0 0 25px rgba(249, 115, 22, 0.9), 0 0 0 4px #f97316; border-color: #f97316;">
          <div class="map-pin-logo">
            <img src="${type === 'RTP' ? rtpLogo : rtvLogo}" alt="${type} Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
          </div>
        </div>
      </div>
    `,
    iconSize: [64, 84],
    iconAnchor: [32, 84]
});

// Pin para la ubicación del usuario
const UserPinIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="user-marker-container">
        <div class="user-marker-pulse"></div>
        <div class="user-marker-icon" style="background: #ea580c; border: 2px solid white; box-shadow: 0 0 15px rgba(234, 88, 12, 0.9);">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;">
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="white"/>
            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="white"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
});

// Calcula la distancia en km
function getDistanceKm(a: [number, number], b: [number, number]): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);

    const c =
        sinDLat * sinDLat +
        Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

    const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
    return R * d;
}

// Controlador unificado de cámara para evitar conflictos de animación
function UnifiedMapController({
    center,
    zoom,
    bounds,
    isSidebarOpen
}: {
    center: [number, number],
    zoom: number,
    bounds: [number, number][] | null,
    isSidebarOpen?: boolean
}) {
    const map = useMap();
    const prevActionRef = useRef<string>('');

    useEffect(() => {
        if (bounds && bounds.length >= 2) {
            const boundsKey = JSON.stringify(bounds);
            if (prevActionRef.current !== boundsKey) {
                prevActionRef.current = boundsKey;
                const isMobile = window.innerWidth < 768;
                const padding: [number, number] = isMobile ? [40, 40] : [70, 70];
                map.fitBounds(bounds as any, {
                    padding,
                    maxZoom: 15,
                    animate: true,
                    duration: 1.2
                });
            }
        } else {
            const centerKey = `${center[0]},${center[1]},${zoom}`;
            if (prevActionRef.current !== centerKey) {
                prevActionRef.current = centerKey;
                map.flyTo(center, zoom, {
                    duration: 1.2,
                    easeLinearity: 0.25,
                    animate: true
                });
            }
        }
    }, [center, zoom, bounds, map]);

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize({ animate: false });
        }, 320);
        return () => clearTimeout(timer);
    }, [isSidebarOpen, map]);

    return null;
}

export default function SedesMap({ selectedBranchId }: { selectedBranchId?: number }) {
    const [filter, setFilter] = useState<'all' | 'lima' | 'provincia'>('lima');
    const [searchQuery, setSearchQuery] = useState('');
    const [mapState, setMapState] = useState<{ center: [number, number], zoom: number }>({
        center: [-12.046374, -77.042793],
        zoom: 12
    });

    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [activeBounds, setActiveBounds] = useState<[number, number][] | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [pickedBranchId, setPickedBranchId] = useState<number | null>(null);

    const markerRefs = useRef<Record<number, L.Marker | null>>({});

    const isBranchDetailView = !!selectedBranchId;
    const activeBranchId = selectedBranchId ?? pickedBranchId;
    const selectedBranch = useMemo(() => branches.find((b: Branch) => b.id === activeBranchId), [activeBranchId]);

    // Filtrar sedes para la lista interactiva
    const displayBranches = useMemo(() => {
        let list = branches;
        if (filter !== 'all') {
            list = list.filter(b => b.region === filter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(b => b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q));
        }
        return list;
    }, [filter, searchQuery]);

    // Calcular distancias si la ubicación está disponible
    const branchesWithDistances = useMemo(() => {
        return displayBranches.map(b => {
            const distance = userLocation ? getDistanceKm(userLocation, b.position) : null;
            return { ...b, distance };
        }).sort((a, b) => {
            if (a.distance !== null && b.distance !== null) {
                return a.distance - b.distance;
            }
            return 0;
        });
    }, [displayBranches, userLocation]);

    // Inicializar mapa si viene prop
    useEffect(() => {
        if (activeBranchId && !activeBounds) {
            const branch = branches.find((b: Branch) => b.id === activeBranchId);
            if (branch) {
                setMapState({ center: branch.position, zoom: 16 });
                setFilter(branch.region);
                setTimeout(() => {
                    markerRefs.current[branch.id]?.openPopup();
                }, 500);
            }
        }
    }, [activeBranchId]);

    // Al seleccionar una sede con animación fluida
    const handleSelectBranch = (branch: Branch) => {
        setActiveBounds(null);
        setPickedBranchId(branch.id);
        setMapState({ center: branch.position, zoom: 16 });
        setIsSidebarOpen(true);

        setTimeout(() => {
            markerRefs.current[branch.id]?.openPopup();
        }, 400);
    };

    const handleClearSelection = () => {
        setActiveBounds(null);
        setPickedBranchId(null);
        if (filter === 'lima') {
            setMapState({ center: [-12.046374, -77.042793], zoom: 12 });
        } else if (filter === 'provincia') {
            setMapState({ center: [-12.046374, -75.042793], zoom: 6 });
        } else {
            setMapState({ center: [-12.046374, -77.042793], zoom: 11 });
        }
    };

    const handleFilterChange = (newFilter: 'all' | 'lima' | 'provincia') => {
        if (isBranchDetailView) return;
        setActiveBounds(null);
        setPickedBranchId(null);
        setFilter(newFilter);
        if (newFilter === 'lima') {
            setMapState({ center: [-12.046374, -77.042793], zoom: 12 });
        } else if (newFilter === 'provincia') {
            setMapState({ center: [-12.046374, -75.042793], zoom: 6 });
        } else {
            setMapState({ center: [-12.046374, -77.042793], zoom: 11 });
        }
    };

    const handleUseMyLocation = (manual = false) => {
        if (!navigator.geolocation) {
            setGeoError('La geolocalización no es soportada en este dispositivo.');
            return;
        }

        // Si es automático, respetar consentimiento previo
        if (!manual) {
            const consent = getConsent();
            if (!consent.location) return;
        }

        setIsLocating(true);
        setGeoError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords: [number, number] = [
                    position.coords.latitude,
                    position.coords.longitude
                ];
                setUserLocation(coords);

                // Encontrar la sede más cercana entre todas las disponibles
                let closestBranch: Branch | null = null;
                let minDistance = Infinity;

                branches.forEach((branch) => {
                    const dist = getDistanceKm(coords, branch.position);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestBranch = branch;
                    }
                });

                if (closestBranch) {
                    const foundBranch: Branch = closestBranch;
                    setFilter(foundBranch.region);
                    setPickedBranchId(foundBranch.id);
                    // Encuadrar la ubicación del usuario y la sede más cercana
                    setActiveBounds([coords, foundBranch.position]);
                    setIsSidebarOpen(true);

                    setTimeout(() => {
                        markerRefs.current[foundBranch.id]?.openPopup();
                    }, 600);
                }

                setIsLocating(false);
            },
            (error) => {
                console.warn("Geolocation error:", error.message);
                if (manual) {
                    setGeoError('Por favor permite el acceso a tu ubicación en el navegador para ubicar la sede más cercana.');
                }
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
        );
    };

    useEffect(() => {
        if (getConsent().location) {
            handleUseMyLocation(false);
        }
    }, []);

    const mapMarkersBranches = useMemo(() => {
        if (isBranchDetailView) {
            return branches.filter((b: Branch) => b.id === selectedBranchId);
        }
        if (filter === 'all') return branches;
        // Si hay una sede activa seleccionada fuera del filtro actual, mantenerla visible en el mapa
        const filtered = branches.filter((b: Branch) => b.region === filter);
        if (activeBranchId && !filtered.some(b => b.id === activeBranchId)) {
            const activeB = branches.find(b => b.id === activeBranchId);
            if (activeB) return [...filtered, activeB];
        }
        return filtered;
    }, [filter, isBranchDetailView, selectedBranchId, activeBranchId]);

    return (
        <div className={`w-full ${isBranchDetailView ? 'h-[75vh] md:h-[540px]' : 'h-[640px] md:h-[560px]'} border-2 border-gray-900 rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col md:flex-row relative transition-all duration-300`}>
            
            {/* Contenedor del Mapa */}
            <div className="relative flex-1 h-[320px] sm:h-[380px] md:h-full z-10">
                {/* Botón para colapsar sidebar (Desktop) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:flex absolute top-1/2 right-0 z-[1000] -translate-y-1/2 translate-x-1/2 bg-white border-2 border-gray-900 rounded-full p-2 shadow-xl items-center justify-center hover:bg-orange-500 hover:text-white transition-all hover:scale-110"
                    aria-label={isSidebarOpen ? "Ocultar panel" : "Mostrar panel"}
                    title={isSidebarOpen ? "Ocultar panel" : "Mostrar panel"}
                >
                    {isSidebarOpen ? <FaChevronRight size={13} /> : <FaChevronLeft size={13} />}
                </button>

                {/* Barra de Filtros Flotante sobre el Mapa */}
                {!isBranchDetailView && (
                    <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-gray-200">
                        <button
                            onClick={handleClearSelection}
                            className="p-2 rounded-xl text-gray-700 hover:bg-orange-500 hover:text-white transition-colors"
                            title="Recentrar vista"
                            aria-label="Recentrar vista"
                        >
                            <FaMapMarkerAlt size={13} />
                        </button>
                        <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-bold">
                            <button
                                onClick={() => handleFilterChange('lima')}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${filter === 'lima' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Lima
                            </button>
                            <button
                                onClick={() => handleFilterChange('provincia')}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${filter === 'provincia' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Provincias
                            </button>
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${filter === 'all' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Todas
                            </button>
                        </div>
                    </div>
                )}

                {/* Mapa Leaflet */}
                <MapContainer
                    center={mapState.center}
                    zoom={mapState.zoom}
                    scrollWheelZoom
                    zoomControl={true}
                    attributionControl={false}
                    className="w-full h-full"
                >
                    <AttributionControl position="bottomright" prefix={false} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <UnifiedMapController
                        center={mapState.center}
                        zoom={mapState.zoom}
                        bounds={activeBounds}
                        isSidebarOpen={isSidebarOpen}
                    />

                    {mapMarkersBranches.map(branch => {
                        const isSelected = activeBranchId === branch.id;
                        const icon = isSelected
                            ? createActivePinIcon(branch.type)
                            : (branch.type === 'RTP' ? RtpPinIcon : RtvPinIcon);

                        return (
                            <Marker
                                key={branch.id}
                                position={branch.position}
                                icon={icon}
                                ref={(ref) => { markerRefs.current[branch.id] = ref; }}
                                eventHandlers={{
                                    click: () => handleSelectBranch(branch),
                                }}
                            >
                                <Popup offset={[-4, -55]} className="custom-popup" closeButton={false}>
                                    <div className="p-1 space-y-1 text-left min-w-[140px]">
                                        <div className="flex items-center justify-between gap-1.5">
                                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white">
                                                {branch.type}
                                            </span>
                                            <span className="text-[8.5px] font-semibold text-gray-500 uppercase">
                                                {branch.region}
                                            </span>
                                        </div>
                                        <p className="font-bold text-gray-900 text-[11px] leading-snug">
                                            {branch.name}
                                        </p>
                                        <p className="text-gray-600 text-[9.5px] leading-tight line-clamp-2">
                                            {branch.address}
                                        </p>
                                        {branch.phone && (
                                            <p className="text-[9.5px] font-bold text-orange-600">
                                                📞 {branch.phone}
                                            </p>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Marcador del Usuario */}
                    {userLocation && (
                        <Marker position={userLocation} icon={UserPinIcon}>
                            <Popup offset={[0, -25]} closeButton={false}>
                                <div className="p-1 text-center font-bold text-[11px] text-orange-600">
                                    📍 Estás aquí
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            {/* Panel Lateral Interactivo (Lista de Sedes & Detalles) */}
            <aside className={`
                ${isSidebarOpen ? 'w-full md:w-[360px] lg:w-[400px]' : 'md:w-0 md:p-0 md:border-l-0'}
                border-t-2 md:border-t-0 md:border-l-2 border-gray-900 bg-white
                flex flex-col flex-1 md:flex-initial
                overflow-hidden h-full
                transition-all duration-300 ease-in-out z-20
            `}>
                {/* Cabecera del Panel */}
                <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <h3 className="text-xs font-bold text-gray-900">
                                {selectedBranch ? 'Detalles de la Sede' : 'Explorar Sedes'}
                            </h3>
                        </div>

                        {selectedBranch && !isBranchDetailView && (
                            <button
                                onClick={handleClearSelection}
                                className="flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-0.5 rounded-lg transition-colors"
                            >
                                <FaTimes size={9} />
                                <span>Ver lista</span>
                            </button>
                        )}
                    </div>

                    {/* Barra de búsqueda y GPS (cuando se muestra la lista) */}
                    {!selectedBranch && (
                        <div className="space-y-1.5">
                            <div className="relative">
                                <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
                                <input
                                    type="text"
                                    placeholder="Buscar sede, distrito o calle..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-7 pr-3 py-1 text-[11px] rounded-lg bg-gray-100/80 border border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => handleUseMyLocation(true)}
                                disabled={isLocating}
                                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-md shadow-orange-500/20 transition-all active:scale-[0.98]"
                            >
                                <FaDirections size={13} />
                                <span>{isLocating ? 'Calculando sede más cercana...' : 'Ubicar la sede más cercana a mí'}</span>
                            </button>
                            {geoError && <p className="text-[9.5px] text-red-500 text-center leading-tight">{geoError}</p>}
                        </div>
                    )}
                </div>

                {/* Contenido del Panel */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                    {/* CASO A: SEDE SELECCIONADA -> MOSTRAR FICHA DETALLADA */}
                    {selectedBranch ? (
                        <div className="space-y-2.5 animate-fade-in">
                            {/* Tarjeta Principal de la Sede Seleccionada */}
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50/80 via-white to-orange-50/40 border border-orange-400 shadow-sm space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className="inline-block px-1.5 py-0.5 rounded bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider mb-0.5">
                                            {selectedBranch.type} San Cristóbal
                                        </span>
                                        <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                                            {selectedBranch.name}
                                        </h4>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-orange-200 bg-white p-0.5 shrink-0 overflow-hidden shadow-xs">
                                        <img
                                            src={selectedBranch.type === 'RTP' ? rtpLogo : rtvLogo}
                                            alt={selectedBranch.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Ubicación con la misma caja de ícono w-7 h-7 y tipografía nivelada */}
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/95 border border-orange-100 shadow-2xs">
                                    <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0 text-orange-500">
                                        <FaMapMarkerAlt size={12} />
                                    </div>
                                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-tight">Ubicación</span>
                                        <p className="font-bold text-gray-800 text-[10.5px] leading-tight line-clamp-2">{selectedBranch.address}</p>
                                    </div>
                                </div>

                                {/* Horario y Teléfono con íconos perfectamente alineados */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/95 border border-orange-100 shadow-2xs">
                                        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0 text-orange-500">
                                            <FaClock size={12} />
                                        </div>
                                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-tight">Horario</span>
                                            <span className="font-bold text-gray-800 text-[10.5px] leading-tight">7am - 6pm</span>
                                        </div>
                                    </div>

                                    {selectedBranch.phone ? (
                                        <a
                                            href={`tel:${selectedBranch.phone}`}
                                            className="flex items-center gap-2 p-2 rounded-xl bg-white/95 border border-orange-100 hover:border-orange-300 hover:bg-orange-50/40 transition-all shadow-2xs group/phone"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-orange-50 group-hover/phone:bg-orange-500 group-hover/phone:text-white border border-orange-200/80 group-hover/phone:border-orange-500 flex items-center justify-center shrink-0 text-orange-500 transition-colors">
                                                <FaPhoneAlt size={11} />
                                            </div>
                                            <div className="min-w-0 flex-1 flex flex-col justify-center">
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-tight">Llamar</span>
                                                <span className="font-bold text-gray-800 group-hover/phone:text-orange-600 text-[10.5px] leading-tight truncate">{selectedBranch.phone}</span>
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/95 border border-orange-100 shadow-2xs opacity-80">
                                            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0 text-orange-500">
                                                <FaPhoneAlt size={11} />
                                            </div>
                                            <div className="min-w-0 flex-1 flex flex-col justify-center">
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-tight">Atención</span>
                                                <span className="font-bold text-gray-800 text-[10.5px] leading-tight">Presencial</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Botones de Navegación GPS */}
                                <div className="space-y-1.5 pt-0.5">
                                    <p className="text-[9.5px] font-bold uppercase tracking-wider text-gray-500">¿Cómo llegar?</p>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <button
                                            onClick={() => {
                                                if (selectedBranch.googleMapsUrl) {
                                                    window.open(selectedBranch.googleMapsUrl, '_blank', 'noopener,noreferrer');
                                                } else {
                                                    const [lat, lng] = selectedBranch.position;
                                                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer');
                                                }
                                            }}
                                            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-800 shadow-xs transition-all active:scale-95"
                                        >
                                            <SiGooglemaps className="text-red-500" size={12} />
                                            <span>Google Maps</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (selectedBranch.wazeUrl) {
                                                    window.open(selectedBranch.wazeUrl, '_blank', 'noopener,noreferrer');
                                                } else {
                                                    const [lat, lng] = selectedBranch.position;
                                                    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank', 'noopener,noreferrer');
                                                }
                                            }}
                                            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-800 shadow-xs transition-all active:scale-95"
                                        >
                                            <SiWaze className="text-[#33ccff]" size={12} />
                                            <span>Waze</span>
                                        </button>
                                    </div>

                                    {/* Botón WhatsApp */}
                                    <a
                                        href={whatsappUrl(selectedBranch.whatsapp ?? selectedBranch.phone, `Hola, quisiera información sobre la sede de ${selectedBranch.name}.`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold shadow-sm transition-all active:scale-[0.98]"
                                    >
                                        <FaWhatsapp size={13} />
                                        <span>WhatsApp directo de la sede</span>
                                    </a>

                                    {/* Enlace para ver Ficha Completa */}
                                    <Link
                                        to={`/sedes/${selectedBranch.id}`}
                                        className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gray-900 hover:bg-black text-white text-[10px] font-bold transition-all shadow-xs"
                                    >
                                        <span>Ver fotos y tarifas de la sede</span>
                                        <FaChevronRight size={9} />
                                    </Link>
                                </div>
                            </div>

                            {/* Selector rápido para cambiar a otra sede */}
                            <div className="pt-1">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Otras sedes</p>
                                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                    {branches.filter(b => b.id !== selectedBranch.id).map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => handleSelectBranch(b)}
                                            className="w-full flex items-center justify-between p-1.5 rounded-lg bg-gray-50 hover:bg-orange-50 border border-gray-100 text-left transition-colors group"
                                        >
                                            <div className="min-w-0 pr-1.5">
                                                <p className="text-[11px] font-semibold text-gray-800 group-hover:text-orange-600 truncate">{b.name}</p>
                                                <p className="text-[9.5px] text-gray-400 truncate">{b.address}</p>
                                            </div>
                                            <span className="text-[9.5px] text-orange-500 font-bold shrink-0">Ver →</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* CASO B: LISTADO COMPLETO DE SEDES PARA SELECCIONAR */
                        <div className="space-y-1.5">
                            {branchesWithDistances.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    <p className="text-xs">No se encontraron sedes.</p>
                                </div>
                            ) : (
                                branchesWithDistances.map(branch => (
                                    <div
                                        key={branch.id}
                                        onClick={() => handleSelectBranch(branch)}
                                        className="p-2.5 rounded-xl border border-gray-200 hover:border-orange-500 bg-white hover:bg-orange-50/40 shadow-2xs cursor-pointer transition-all duration-200 group"
                                    >
                                        <div className="flex items-start justify-between gap-1.5">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded bg-orange-500 text-white">
                                                        {branch.type}
                                                    </span>
                                                    <h4 className="font-bold text-gray-900 text-[11px] group-hover:text-orange-600 transition-colors truncate">
                                                        {branch.name}
                                                    </h4>
                                                </div>
                                                <p className="text-[9.5px] text-gray-500 line-clamp-1 leading-snug">
                                                    {branch.address}
                                                </p>
                                            </div>

                                            {branch.distance !== null && (
                                                <span className="shrink-0 text-[9px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                                                    {branch.distance < 1
                                                        ? `${Math.round(branch.distance * 1000)} m`
                                                        : `${branch.distance.toFixed(1)} km`}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-1.5 pt-1 border-t border-gray-100 flex items-center justify-between text-[9.5px]">
                                            <span className="text-gray-400 font-medium">Lun - Sáb: 7am - 6pm</span>
                                            <span className="font-bold text-orange-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                                                <span>Ver en mapa</span>
                                                <FaChevronRight size={8} />
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}