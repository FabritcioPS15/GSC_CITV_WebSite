import type { Branch } from '../../backend/data/branches';

/**
 * Busqueda de sedes.
 *
 * Vive fuera de los componentes para que el autocompletado del header y el
 * buscador del mapa usen exactamente el mismo criterio de coincidencia.
 */

/** Quita tildes y pasa a minusculas, para que "Ica" encuentre "Ica" con o sin acento. */
export function normalizar(texto: string): string {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

const ETIQUETA_REGION: Record<Branch['region'], string> = {
    lima: 'Lima',
    provincia: 'Provincia',
};

/**
 * Indica si una sede coincide con la consulta. Se busca por nombre, direccion,
 * localidad, region, zonas cercanas y tipo, de modo que "Subtanjalla",
 * "Ica" o "provincia" encuentren la sede esperada.
 */
export function coincideBusqueda(branch: Branch, consulta: string): boolean {
    const q = normalizar(consulta).trim();
    if (!q) return true;

    return [
        branch.name,
        branch.address,
        branch.locality,
        branch.addressRegion,
        ETIQUETA_REGION[branch.region],
        branch.type,
        ...(branch.zonas ?? []),
    ].some((campo) => normalizar(campo).includes(q));
}
