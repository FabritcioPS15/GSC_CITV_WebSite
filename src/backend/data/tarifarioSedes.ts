import { tarifas, categorias, type TarifaCategoriaId } from './tarifario';

/**
 * ============================================================================
 *  TARIFAS POR SEDE
 * ============================================================================
 *
 *  Acá se edita todo lo que cambia respecto del tarifario general.
 *
 *  ── LA REGLA ────────────────────────────────────────────────────────
 *  Si un servicio NO aparece en el bloque de la sede, esa sede NO lo ofrece
 *  y la fila no se muestra. No hay que anotar lo que sí hace.
 *
 *  ── CÓMO AGREGAR UN SERVICIO ────────────────────────────────────────
 *
 *      3: {
 *          'pub-taxi': {},                 ← lo ofrece al precio base
 *          'part-automovil': { precio: 55 },   ← lo ofrece, pero más barato
 *          'mer-camion': {
 *              precio: 120,
 *              label: 'Camión de carga',   ← y con otro nombre
 *          },
 *      },
 *
 *  ── CÓMO SACAR UN SERVICIO ──────────────────────────────────────────
 *  Borralo del bloque. Nada más.
 *
 *  ── SEDE QUE LO HACE TODO ───────────────────────────────────────────
 *  Si la planta no se saltea nada, usá la estrella. Los ids que agregues
 *  encima pisan a la estrella:
 *
 *      3: { '*': {} },
 *
 *  ── Ids disponibles ─────────────────────────────────────────────────
 *  PARTICULAR
 *    part-automovil          Automóvil
 *    part-furgoneta          Furgoneta / Camioneta
 *    part-camion             Camión Ligero
 *  PUBLICO
 *    pub-taxi                Taxi
 *    pub-combi               Microbus (Combi)
 *    pub-turistico-combi     Turístico (Combi / Couster)
 *    pub-turistico-bus       Turístico (Bus)
 *    pub-escolar-combi       Escolar (Combi)
 *    pub-escolar-bus         Escolar (Bus)
 *    pub-colectivo           Colectivo
 *    pub-colectivo-combi     Colectivo (Combi / Couster)
 *  MERCANCIAS
 *    mer-liviano             Vehículo Liviano de Carga
 *    mer-camion              Camión
 *    mer-quinta-rueda        Camión con Quinta Rueda
 *  RESIDUOS
 *    res-liviano             Unidad Liviana
 *    res-pesado              Unidad Pesada
 *  ESPECIALES
 *    esp-motocicleta         Motocicleta
 *    esp-menor               Vehículo Menor
 *
 *  Los números van sin comas y sin "S/". Los ids tienen que coincidir
 *  EXACTAMENTE con los de `tarifario.ts`: si se escribe mal, la app no se
 *  rompe pero ignora la línea en silencio, así que en desarrollo avisa por
 *  consola.
 */

export interface AjusteSede {
    /** Precio en soles para esta sede. Si no se pone, usa el base. */
    precio?: number;
    /** Nombre a mostrar. Si no se pone, usa el del tarifario general. */
    label?: string;
}

export const TODAS = '*';

export type TarifasDeSede = Record<string, AjusteSede>;

/** Clave: id de sede (mismo id que en `branches.ts`). */
export const TARIFAS_POR_SEDE: Record<number, TarifasDeSede> = {
    // 1 · Sede Callao
    1: { '*': {} },

    // 2 · Sede Canta Callao
    2: { '*': {} },

    // 3 · Sede Ica
    3: { '*': {} },

    // 4 · Sede Andahuaylas
    4: { '*': {} },

    // 5 · Sede Huancavelica
    5: { '*': {} },

    // 6 · Sede Ayacucho - Av. Cusco
    6: { '*': {} },

    // 7 · Sede Ayacucho - Grifo Fénix
    7: { '*': {} },
};

/** Ids que la sede ofrece, ya resuelta la estrella. */
function idsOfrecidos(sedeId: number): string[] {
    const conf = TARIFAS_POR_SEDE[sedeId] ?? {};
    if (TODAS in conf) {
        const ids = tarifas.map((t) => t.id);
        for (const id of Object.keys(conf)) {
            if (id !== TODAS && !ids.includes(id)) ids.push(id);
        }
        return ids;
    }
    return Object.keys(conf);
}

/** Precio final de una tarifa en una sede, o undefined si no la ofrece. */
export function getPrecioDeSede(sedeId: number, tarifaId: string): number | undefined {
    const item = tarifas.find((t) => t.id === tarifaId);
    if (!item) return undefined;
    if (!idsOfrecidos(sedeId).includes(tarifaId)) return undefined;
    const conf = TARIFAS_POR_SEDE[sedeId]?.[tarifaId];
    return conf?.precio !== undefined ? conf.precio : item.precio;
}

/** Nombre a mostrar, con el override de la sede si existe. */
export function getLabelDeSede(sedeId: number, tarifaId: string, base: string): string {
    return TARIFAS_POR_SEDE[sedeId]?.[tarifaId]?.label ?? base;
}

/** Todas las tarifas de la sede con precio y nombre ya resueltos. */
export function getTarifasDeSede(sedeId: number) {
    return tarifas
        .filter((t) => idsOfrecidos(sedeId).includes(t.id))
        .map((t) => ({
            id: t.id,
            categoria: t.categoria,
            label: getLabelDeSede(sedeId, t.id, t.label),
            descripcion: t.descripcion,
            precio: getPrecioDeSede(sedeId, t.id) ?? t.precio,
        }));
}

/** True si la sede tiene un precio propio para esa tarifa. */
export function getPrecioEsPropio(sedeId: number | undefined, tarifaId: string): boolean {
    if (!sedeId) return false;
    return TARIFAS_POR_SEDE[sedeId]?.[tarifaId]?.precio !== undefined;
}

/** Categorías con al menos un servicio disponible en la sede. */
export function getCategoriasDeSede(sedeId: number): TarifaCategoriaId[] {
    const disponibles = new Set(getTarifasDeSede(sedeId).map((t) => t.categoria));
    return categorias.filter((c) => disponibles.has(c.id)).map((c) => c.id);
}

/** Ids mal escritos: se ignoran en silencio, así que hay que avisarlos. */
function validarIds() {
    if (!import.meta.env.DEV) return;
    const validos = new Set(tarifas.map((t) => t.id));
    for (const [sedeId, conf] of Object.entries(TARIFAS_POR_SEDE)) {
        for (const id of Object.keys(conf)) {
            if (id !== TODAS && !validos.has(id)) {
                console.error(
                    `[tarifarioSedes] Sede ${sedeId}: "${id}" no existe en tarifario.ts. Revisar el id.`
                );
            }
        }
    }
}
validarIds();
