import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, X, CornerDownLeft } from 'lucide-react';
import { branches, branchSlug, type Branch } from '../../backend/data/branches';
import { coincideBusqueda } from '../utils/buscarSede';

interface SedeSearchProps {
    /** Enfoca el campo al montar (el panel del header se abre con un clic). */
    autoFocus?: boolean;
    /** Se llama al navegar, para cerrar el panel o el menu movil que lo contiene. */
    onNavigate?: () => void;
    placeholder?: string;
    className?: string;
}

/** Maximo de coincidencias mostradas en el desplegable. */
const MAX_RESULTADOS = 6;

/**
 * Buscador de sedes con autocompletado.
 *
 * Al escribir filtra las sedes (nombre, distrito, ciudad, zona o region) y las
 * ofrece como opciones. Al elegir una se abre su ficha; al enviar sin elegir se
 * cae a la pagina de sedes con el filtro aplicado, que es el mismo destino que
 * declara el SearchAction de Google.
 */
export default function SedeSearch({
    autoFocus = false,
    onNavigate,
    placeholder = 'Buscar sede, distrito o ciudad...',
    className = ''
}: SedeSearchProps) {
    const [query, setQuery] = useState('');
    const [abierto, setAbierto] = useState(false);
    const [activo, setActivo] = useState(0);
    const contenedorRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const resultados = useMemo(() => {
        if (!query.trim()) return [];
        return branches.filter((b) => coincideBusqueda(b, query)).slice(0, MAX_RESULTADOS);
    }, [query]);

    // Cierra el desplegable al hacer clic fuera.
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (contenedorRef.current && !contenedorRef.current.contains(event.target as Node)) {
                setAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // La opcion activa vuelve al inicio cuando cambian los resultados.
    useEffect(() => {
        setActivo(0);
    }, [query]);

    const irASede = (branch: Branch) => {
        setAbierto(false);
        setQuery('');
        onNavigate?.();
        navigate(`/sedes/${branchSlug(branch)}`);
    };

    const verTodosLosResultados = () => {
        const texto = query.trim();
        if (!texto) return;
        setAbierto(false);
        setQuery('');
        onNavigate?.();
        navigate(`/sedes?q=${encodeURIComponent(texto)}`);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            setAbierto(false);
            return;
        }
        if (!abierto || resultados.length === 0) {
            if (event.key === 'Enter') verTodosLosResultados();
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActivo((prev) => (prev + 1) % resultados.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActivo((prev) => (prev - 1 + resultados.length) % resultados.length);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            irASede(resultados[activo]);
        }
    };

    const mostrarPanel = abierto && query.trim().length > 0;

    return (
        <div ref={contenedorRef} className={`relative ${className}`}>
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                    type="search"
                    value={query}
                    autoFocus={autoFocus}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setAbierto(true);
                    }}
                    onFocus={() => setAbierto(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    aria-label="Buscar sede, distrito o ciudad"
                    role="combobox"
                    aria-expanded={mostrarPanel}
                    aria-controls="sede-search-listbox"
                    aria-autocomplete="list"
                    className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-gray-100/80 border border-gray-200 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setAbierto(false);
                        }}
                        aria-label="Limpiar busqueda"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            {mostrarPanel && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[70] rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden animate-fade-in">
                    {resultados.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-500">
                            No encontramos sedes con ese criterio.
                        </p>
                    ) : (
                        <ul id="sede-search-listbox" role="listbox" className="max-h-80 overflow-y-auto py-1">
                            {resultados.map((branch, index) => (
                                <li key={branch.id} role="option" aria-selected={index === activo}>
                                    <button
                                        type="button"
                                        onMouseEnter={() => setActivo(index)}
                                        onClick={() => irASede(branch)}
                                        className={`w-full flex items-start gap-3 px-3.5 py-2.5 text-left transition-colors ${
                                            index === activo ? 'bg-orange-50' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                            <MapPin size={15} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-sm font-semibold text-gray-900 truncate">
                                                    {branch.name}
                                                </span>
                                                <span className="shrink-0 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                                                    {branch.type}
                                                </span>
                                            </span>
                                            <span className="mt-0.5 block text-xs text-gray-500 line-clamp-1">
                                                {branch.address}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        type="button"
                        onClick={verTodosLosResultados}
                        className="flex w-full items-center justify-between gap-2 border-t border-gray-100 px-3.5 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                        <span>Ver todas las coincidencias en el mapa</span>
                        <CornerDownLeft size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
