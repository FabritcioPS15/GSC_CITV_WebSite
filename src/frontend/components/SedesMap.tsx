import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl } from 'react-leaflet';
import { SiGooglemaps, SiWaze } from 'react-icons/si';
import { FaMapMarkerAlt, FaChevronRight, FaChevronLeft, FaWhatsapp, FaSearch, FaTimes, FaPhoneAlt, FaClock, FaDirections, FaRoute } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import rtvLogo from '../../resources/logos/RTV LOGO CIRCULAR.png';
import rtpLogo from '../../resources/logos/RTP LOGO CIRCULAR.png';
import { branches, branchSlug, Branch, whatsappUrl } from '../../backend/data/branches';
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

// Pin de la sede seleccionada. Antes llevaba un halo y un anillo naranja
// (0 0 25px rgba(249,115,22,0.9) + 0 0 0 4px #f97316) que dominaba la vista.
// Ahora la selección se comunica solo con un leve aumento de tamaño, sin glow.
const createActivePinIcon = (type: 'RTP' | 'RTV') => L.divIcon({
    className: 'custom-logo-pin-icon',
    html: `
      <div class="map-pin-wrapper" style="transform: scale(1.08); z-index: 1000;">
        <div class="map-pin-body map-pin-body-branch">
          <div class="map-pin-logo">
            <img src="${type === 'RTP' ? rtpLogo : rtvLogo}" alt="${type} Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
          </div>
        </div>
      </div>
    `,
    iconSize: [54, 72],
    iconAnchor: [27, 72]
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

/** Quita tildes y pasa a minúsculas, para que "Sede Principal" encuentre "sede principal". */
function normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const ETIQUETA_REGION: Record<Branch['region'], string> = {
    lima: 'Lima',
    provincia: 'Provincia',
};

/** Campos por los que se puede buscar una sede. */
function coincideBusqueda(branch: Branch, consulta: string): boolean {
    const q = normalizar(consulta).trim();
    if (!q) return true;
    return [branch.name, branch.address, ETIQUETA_REGION[branch.region], branch.type]
        .some((campo) => normalizar(campo).includes(q));
}

// Controlador unificado de cámara para evitar conflictos de animación
function UnifiedMapController({
    center,
    zoom,
    bounds
}: {
    center: [number, number],
    zoom: number,
    bounds: [number, number][] | null
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

    // Leaflet calcula los tiles usando el tamano del contenedor en el momento del
    // render. Si el contenedor cambia de tamano (sidebar, resize de ventana) y
    // Leaflet no se entera, sigue pidiendo tiles para el tamano viejo y quedan
    // zonas en blanco. Un timeout fijo no resuelve bien la carrera con la
    // transicion CSS, por eso se usa ResizeObserver.
    useEffect(() => {
        const contenedor = map.getContainer();
        let pendiente: number | undefined;
        const ro = new ResizeObserver(() => {
            window.clearTimeout(pendiente);
            // Se aplaza un frame para no invalidar en medio del layout.
            pendiente = window.setTimeout(() => {
                map.invalidateSize({ animate: false });
            }, 50);
        });
        ro.observe(contenedor);
        return () => {
            ro.disconnect();
            window.clearTimeout(pendiente);
        };
    }, [map]);

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
    /** Confirmación de la última búsqueda, para que el botón dé feedback. */
    const [nearestFound, setNearestFound] = useState<{ name: string; km: number } | null>(null);
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
            list = list.filter(b => coincideBusqueda(b, searchQuery));
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
        // El encuadre lo resuelve UnifiedMapController con fitBounds sobre
        // boundsVisibles, asi que no hace falta fijar center ni zoom a mano.
        setActiveBounds(null);
        setPickedBranchId(null);
    };

    const handleFilterChange = (newFilter: 'all' | 'lima' | 'provincia') => {
        if (isBranchDetailView) return;
        setActiveBounds(null);
        setPickedBranchId(null);
        setFilter(newFilter);
    };

    const handleUseMyLocation = (manual = false) => {
        if (!navigator.geolocation) {
            setGeoError('Tu navegador no soporta geolocalización.');
            return;
        }

        // Sin consentimiento hay que abrir los ajustes de cookies. Antes solo se
        // hacia en silencio y el boton pulsado noidia ninguna reaccion, igual que
        // si estuviera roto.
        if (!getConsent().location) {
            if (manual) {
                window.dispatchEvent(new Event('open-cookie-settings'));
            }
            return;
        }

        setIsLocating(true);
        setGeoError(null);
        setNearestFound(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords: [number, number] = [
                    position.coords.latitude,
                    position.coords.longitude
                ];
                setUserLocation(coords);

                // Encontrar la sede más cercana con cálculo de distancia geodésica exacta
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
                    // Solo cambia el filtro y encuadra usuario + sede. No se
                    // selecciona la sede ni se abre su ficha: el botón debe
                    // acercar la vista, no navegar a otra pantalla.
                    setFilter(foundBranch.region);
                    setActiveBounds([coords, foundBranch.position]);
                    setIsSidebarOpen(true);
                    // Confirmación visible en el panel. Sin esto, encuadrar el
                    // mapa no comunica si la búsqueda funcionó, y más en móvil
                    // donde el salto de vista se lee como glitch.
                    setNearestFound({ name: foundBranch.name, km: minDistance });
                }

                setIsLocating(false);
            },
            (error) => {
                console.warn("Geolocation error:", error.message);
                if (manual) {
                    if (error.code === error.PERMISSION_DENIED) {
                        setGeoError('Acceso a ubicación denegado. Permite la ubicación en el navegador.');
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        setGeoError('Señal de GPS no disponible. Verifica tu conexión.');
                    } else if (error.code === error.TIMEOUT) {
                        setGeoError('Tiempo de espera agotado al consultar GPS. Intenta de nuevo.');
                    } else {
                        setGeoError('No se pudo obtener tu ubicación precisa.');
                    }
                }
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
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
        let lista = branches;
        if (filter !== 'all') {
            lista = lista.filter((b) => b.region === filter);
        }
        // La busqueda tambien filtra los marcadores. Antes solo filtraba la lista
        // lateral, asi que se veian sedes en el mapa que no estaban en los
        // resultados y al usuario le parecian resultados sin correspondencia.
        if (searchQuery.trim()) {
            lista = lista.filter((b) => coincideBusqueda(b, searchQuery));
        }
        // Si hay una sede activa seleccionada fuera del filtro actual, mantenerla visible en el mapa
        const filtered = lista;
        if (activeBranchId && !filtered.some(b => b.id === activeBranchId)) {
            const activeB = branches.find(b => b.id === activeBranchId);
            if (activeB) return [...filtered, activeB];
        }
        return filtered;
    }, [filter, isBranchDetailView, selectedBranchId, activeBranchId, searchQuery]);

    /**
     * Limites de los marcadores que se estan mostrando ahora mismo.
     *
     * Se pasan al controlador para que encuadre con fitBounds en vez de usar un
     * centro y zoom fijos. Con valores fijos el encuadre no coincidia con las
     * sedes del filtro y el mapa terminaba mostrando zona vacia ( oceanica, sin
     * tiles cargados ) en lugar de las sedes.
     */
    const boundsVisibles = useMemo<[number, number][]>(
        () => mapMarkersBranches.map((b) => b.position),
        [mapMarkersBranches]
    );

    return (
        <div className={`w-full ${isBranchDetailView ? 'h-[75vh] md:h-[540px]' : 'h-[660px] md:h-[560px]'} border-2 border-gray-900 rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col md:flex-row relative transition-all duration-300`}>

            {/* Contenedor del Mapa */}
            <div className="relative h-[250px] sm:h-[280px] md:h-full md:flex-1 shrink-0 z-10">

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
                        // keepBuffer mantiene tiles de zoom vecinos ya cargados para
                        // que al cambiar de filtro no queden huecos grises mientras
                        // se piden los nuevos.
                        keepBuffer={3}
                        updateWhenIdle
                    />
                    <UnifiedMapController
                        center={mapState.center}
                        zoom={mapState.zoom}
                        bounds={activeBounds ?? boundsVisibles}
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
                                {/* Offset vertical calibrado al alto del pin (72px).
                                    El horizontal (x=14) corre el popup a la derecha
                                    respecto del pin, dejando la punta cerca del
                                    borde izquierdo de la caja. */}
                                <Popup offset={[-4, -58]} className="custom-popup" closeButton={false}>
                                    {/* w-[180px] fijo: con min-width el popup no
                                        encogia en pantallas angostas. space-y-0.5
                                        aprieta los bloques para reducir el alto. */}
                                    <div className="w-[180px] space-y-0.5 text-left">
                                        <div className="flex items-center justify-between gap-1.5">
                                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white">
                                                {branch.type}
                                            </span>
                                            <span className="text-[8.5px] font-semibold text-gray-500 uppercase">
                                                {branch.region}
                                            </span>
                                        </div>
                                        <p className="font-bold text-gray-900 text-[11px] leading-tight line-clamp-1">
                                            {branch.name}
                                        </p>
                                        <p className="text-[9.5px] text-gray-600 leading-[1.15] line-clamp-1">
                                            {branch.address}
                                        </p>
                                        {branch.phone && (
                                            <p className="flex items-center gap-1 text-[9.5px] font-bold text-orange-600 leading-tight">
                                                <FaPhoneAlt size={9} className="shrink-0" />
                                                {branch.phone}
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
                                    Estás aquí
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            {/* Panel Lateral Interactivo (Lista de Sedes & Detalles) */}
            <aside className={`
                ${isSidebarOpen ? 'w-full md:w-[360px] lg:w-[400px]' : 'md:w-0 md:border-l-0'}
                border-t-2 md:border-t-0 md:border-l-2 border-gray-900
                relative flex-1 md:flex-initial min-h-0
                h-full
                transition-all duration-300 ease-in-out z-20
            `}>
                {/* Botón para colapsar/expandir sidebar (solo Desktop) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:flex absolute -left-[17px] top-1/2 -translate-y-1/2 z-[1001] w-[34px] h-[34px] bg-white border-2 border-gray-900 rounded-full items-center justify-center shadow-xl hover:bg-orange-500 hover:text-white transition-all hover:scale-110"
                    aria-label={isSidebarOpen ? 'Ocultar panel' : 'Mostrar panel'}
                    title={isSidebarOpen ? 'Ocultar panel' : 'Mostrar panel'}
                >
                    {isSidebarOpen ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
                </button>

                {/* Wrapper interno con overflow-hidden para animar el contenido */}
                <div className="overflow-hidden h-full min-h-0 bg-white flex flex-col">
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
                                        type="search"
                                        placeholder="Buscar sede, distrito o calle..."
                                        aria-label="Buscar sede, distrito o calle"
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
                                {geoError && (
                                    <p role="alert" className="text-[9.5px] text-red-500 text-center leading-tight">
                                        {geoError}
                                    </p>
                                )}
                                {!geoError && nearestFound && (
                                    <p className="text-[9.5px] text-gray-500 text-center leading-tight">
                                        Tu sede más cercana es{' '}
                                        <span className="font-bold text-gray-900">{nearestFound.name}</span>
                                        {nearestFound.km < 1
                                            ? ` (${Math.round(nearestFound.km * 1000)} m)`
                                            : ` (${nearestFound.km.toFixed(1)} km)`}
                                        . El mapa la muestra junto a tu ubicación.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Contenido del Panel. min-h-0 es obligatorio: sin el, un item
                    flex con overflow-y-auto conserva min-height:auto y la lista
                    crece mas que el panel en vez de scrollear, recortandose. */}
                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2.5 space-y-2 custom-map-scrollbar">
                        {/* CASO A: SEDE SELECCIONADA -> MOSTRAR FICHA DETALLADA */}
                        {selectedBranch ? (
                            <div className="space-y-2.5 animate-fade-in">
                                {/* Tarjeta Principal de la Sede Seleccionada */}
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50/80 via-white to-orange-50/40 border border-orange-400 shadow-sm space-y-2.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className="inline-block px-1.5 py-0.5 rounded bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider">
                                                    {selectedBranch.type} San Cristóbal
                                                </span>
                                                {userLocation && (
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[9px] font-bold">
                                                        <FaRoute size={8} />
                                                        {getDistanceKm(userLocation, selectedBranch.position) < 1
                                                            ? `${Math.round(getDistanceKm(userLocation, selectedBranch.position) * 1000)} m`
                                                            : `${getDistanceKm(userLocation, selectedBranch.position).toFixed(1)} km`}
                                                    </span>
                                                )}
                                            </div>
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

                                    {/* Botones de Navegación GPS y Contacto */}
                                    <div className="space-y-1.5 pt-0.5">
                                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-gray-500">¿Cómo llegar y contactar?</p>

                                        {/* Fila 1: Google Maps y Waze */}
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <button
                                                onClick={() => {
                                                    const [lat, lng] = selectedBranch.position;
                                                    const originQuery = userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : '';
                                                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${originQuery}&travelmode=driving`, '_blank', 'noopener,noreferrer');
                                                }}
                                                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-800 shadow-xs transition-all active:scale-95"
                                            >
                                                <SiGooglemaps className="text-red-500" size={13} />
                                                <span>Google Maps</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    const [lat, lng] = selectedBranch.position;
                                                    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank', 'noopener,noreferrer');
                                                }}
                                                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-800 shadow-xs transition-all active:scale-95"
                                            >
                                                <SiWaze className="text-[#33ccff]" size={13} />
                                                <span>Waze</span>
                                            </button>
                                        </div>

                                        {/* Fila 2: WhatsApp y Ver sede a la misma altura */}
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <a
                                                href={whatsappUrl(selectedBranch.whatsapp ?? selectedBranch.phone, `Hola, quisiera información sobre la sede de ${selectedBranch.name}.`)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold shadow-xs transition-all active:scale-95"
                                            >
                                                <FaWhatsapp size={14} />
                                                <span>WhatsApp</span>
                                            </a>

                                            <Link
                                                to={`/sedes/${branchSlug(selectedBranch)}`}
                                                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gray-900 hover:bg-black text-white text-[11px] font-bold shadow-xs transition-all active:scale-95"
                                            >
                                                <span>Ver sede</span>
                                                <FaChevronRight size={10} />
                                            </Link>
                                        </div>
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
                                                    <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                                                        <FaRoute size={8} />
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
                </div> {/* end inner overflow wrapper */}
            </aside>
        </div>
    );
}