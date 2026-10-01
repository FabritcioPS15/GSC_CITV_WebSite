import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import {
    categorias,
    tarifas,
    getRequisitos,
    TarifaCategoriaId,
    TarifaItem,
} from '../../backend/data/tarifario';
import { whatsappUrl } from '../../backend/data/branches';
import { getTarifasDeSede, getPrecioEsPropio } from '../../backend/data/tarifarioSedes';
import TarifaModal from './TarifaModal';

interface TarificoProps {
    /** Id de la sede: resuelve sus precios propios desde tarifarioSedes.ts. */
    sedeId?: number;
    sedeNombre?: string;
    /** WhatsApp específico de la sede. Si no se pasa, se usa el central. */
    whatsapp?: string | null;
}

function construirMensaje(
    sede: string,
    categoria: string,
    item: TarifaItem,
    precio?: number
): string {
    const lineas = [
        'Hola, quiero información sobre las tarifas de inspección vehicular.',
        '',
        `*Sede:* ${sede}`,
        `*Categoría:* ${categoria}`,
        `*Vehículo:* ${item.label}`,
        `*Detalle:* ${item.descripcion}`,
    ];

    if (typeof precio === 'number') {
        lineas.push(`*Tarifa:* S/ ${precio.toFixed(2)}`);
    } else {
        lineas.push('*Tarifa:* Consultar');
    }

    lineas.push('', '¿Tienen disponibilidad para agendar?');
    return lineas.join('\n');
}

export default function Tarifico({ sedeId, sedeNombre, whatsapp }: TarificoProps) {
    const [activa, setActiva] = useState<TarifaCategoriaId>('particular');
    const [seleccion, setSeleccion] = useState<TarifaItem | null>(null);
    const sede = sedeNombre ?? 'San Cristobal';

    // Todas las tarifas de la sede con precio y nombre ya resueltos. Las que
    // la sede no ofrece no vienen en la lista, así que no hay que filtrar.
    const todas = useMemo(
        () => (sedeId ? getTarifasDeSede(sedeId) : tarifas),
        [sedeId]
    );

    // Si la categoría activa deja de tener filas, cae a la primera con contenido.
    const categoriasVisibles = useMemo(() => {
        const conFilas = categorias.filter((c) => todas.some((t) => t.categoria === c.id));
        return conFilas.length > 0 ? conFilas.map((c) => c.id) : categorias.map((c) => c.id);
    }, [todas]);
    useEffect(() => {
        if (!categoriasVisibles.includes(activa)) {
            setActiva(categoriasVisibles[0] ?? 'particular');
        }
    }, [categoriasVisibles, activa]);

    const items = todas.filter((t) => t.categoria === activa);
    const categoria = categorias.find((c) => c.id === activa);

    const consultar = (item: TarifaItem, precio?: number) => {
        window.open(
            whatsappUrl(whatsapp, construirMensaje(sede, categoria?.label ?? '', item, precio)),
            '_blank',
            'noopener,noreferrer'
        );
    };

    const cerrar = useCallback(() => setSeleccion(null), []);

    return (
        <div className="lg:h-full lg:flex lg:flex-col">
            {/* Marco de la tabla. Sin bordes redondeados: todo recto. */}
            <div className="bg-white border border-gray-200 lg:grid lg:grid-cols-[230px_1fr] lg:flex-1 lg:min-h-0">
                {/* Columna izquierda: categorías */}
                <nav className="border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
                    <p className="hidden lg:block px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200">
                        Categoría
                    </p>

                    {/* Móvil: selector nativo — accesible, sin ambigüedad de scroll */}
                    <div className="lg:hidden px-4 py-3">
                        <label htmlFor="categoria-movil" className="sr-only">Categoría de vehículo</label>
                        <select
                            id="categoria-movil"
                            value={activa}
                            onChange={(e) => setActiva(e.target.value as TarifaCategoriaId)}
                            className="w-full appearance-none bg-white border border-gray-200 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                        >
                            {categoriasVisibles.map((idCat) => {
                                const c = categorias.find((x) => x.id === idCat);
                                if (!c) return null;
                                return (
                                    <option key={c.id} value={c.id}>
                                        {c.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Escritorio: tira vertical con indicador lateral */}
                    <ul className="hidden lg:flex lg:flex-col lg:overflow-visible">
                        {categoriasVisibles.map((idCat) => {
                            const c = categorias.find((x) => x.id === idCat);
                            if (!c) return null;
                            const esActiva = c.id === activa;
                            return (
                                <li
                                    key={c.id}
                                    className="shrink border-b border-gray-200 last:border-b-0"
                                >
                                    <button
                                        onClick={() => setActiva(c.id)}
                                        className={`w-full px-5 py-3.5 text-left text-sm font-bold uppercase tracking-wide whitespace-nowrap border-l-4 transition-colors duration-200 ${
                                            esActiva
                                                ? 'bg-[#f97316] text-white border-l-gray-900'
                                                : 'text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 border-l-transparent'
                                        }`}
                                    >
                                        {c.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Columna derecha: tabla de tarifas */}
                <div className="lg:flex lg:flex-col lg:min-h-0">
                    {/* Cabecera de columnas. Debe compartir el mismo grid-cols que las filas
                        para que cada rótulo caiga sobre su columna. */}
                    <div className="hidden lg:grid lg:shrink-0 grid-cols-[1fr_8.5rem_9.5rem] bg-gray-900 text-white">
                        <span className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest">
                            Vehículo
                        </span>
                        <span className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-right">
                            Tarifa
                        </span>
                        <span className="px-5 py-2.5" />
                    </div>

                    {/* Filas con scroll propio: el alto de la caja no depende de la
                        cantidad de vehículos de la categoría. */}
                    <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
                    {items.length === 0 ? (
                        <p className="px-5 py-10 text-center text-sm text-gray-500">
                            Esta sede no ofrece servicios de esta categoría.
                        </p>
                    ) : null}
                    {items.map((item, i) => {
                        const precio = item.precio;
                        const esUltimo = i === items.length - 1;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setSeleccion(item)}
                                title="Ver detalle de la tarifa"
                                className={`group w-full text-left cursor-pointer border-l-4 border-l-transparent border-b border-gray-100 hover:border-l-[#f97316] hover:bg-orange-50/60 focus:outline-none focus-visible:bg-orange-50/60 active:bg-orange-50 transition-colors duration-200 ${
                                    esUltimo ? 'border-b-0' : ''
                                }`}
                            >
                                <div className="grid grid-cols-2 lg:grid-cols-[1fr_8.5rem_9.5rem] items-center">
                                    <div className="col-span-2 lg:col-span-1 px-5 pt-4 lg:py-4 lg:pr-6">
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                            {item.label}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            {item.descripcion}
                                        </p>
                                    </div>

                                    <div className="px-5 pb-4 lg:py-4 lg:px-5 lg:border-l lg:border-gray-100">
                                        <div className="flex items-baseline gap-1 lg:justify-end">
                                            {typeof precio === 'number' ? (
                                                <>
                                                    <span className="text-gray-400 font-bold text-xs">
                                                        S/
                                                    </span>
                                                    <span className="stat-num text-3xl font-black text-gray-900 leading-none">
                                                        {precio}
                                                    </span>
                                                    <span className="text-gray-400 font-bold text-xs">
                                                        .00
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-black uppercase tracking-widest">
                                                    A consultar
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end px-5 pb-4 lg:py-4 lg:pr-5">
                                        <span className="shrink-0 flex items-center gap-1.5 bg-[#25D366] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-2 transition-colors duration-200 group-hover:bg-[#1eb85a]">
                                            <FaWhatsapp size={13} />
                                            Consultar
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                    </div>
                </div>
            </div>

            <div className="lg:shrink-0 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-gray-400 max-w-xl">
                    Los precios incluyen IGV. Las tarifas pueden variar según la sede y la
                    disponibilidad de Inspectores Autorizados.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        const first = items[0];
                        if (first) setSeleccion(first);
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb85a] text-white text-xs font-black uppercase tracking-widest px-5 py-3 transition-colors duration-200 active:opacity-90"
                >
                    <FaWhatsapp size={16} />
                    Consultar por WhatsApp
                </button>
            </div>

            <TarifaModal
                item={seleccion}
                categoriaLabel={categoria?.label ?? ''}
                icono={categoria?.icon ?? 'car'}
                precio={seleccion?.precio}
                esPrecioDeSede={seleccion ? getPrecioEsPropio(sedeId, seleccion.id) : false}
                sedeNombre={sede}
                requisitos={seleccion ? getRequisitos(seleccion.id) : []}
                onClose={cerrar}
                onConsultar={() => {
                    if (seleccion) consultar(seleccion, seleccion.precio);
                    cerrar();
                }}
            />
        </div>
    );
}
