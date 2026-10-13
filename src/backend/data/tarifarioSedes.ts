import { tarifas, categorias, type TarifaCategoriaId, type TarifaItem } from './tarifario';

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

/**
 * ============================================================================
 *  TARIFARIO COMPLETO POR SEDE
 * ============================================================================
 *
 *  Para sedes que tienen su propia lista de precios (distinta del tarifario
 *  general), se escribe acá la lista completa. Si una sede aparece en este
 *  objeto, se IGNORA su bloque en `TARIFAS_POR_SEDE`: la lista de acá es la
 *  que se muestra, con los ids, categorías, nombres, descripciones y precios
 *  que se escriban.
 *
 *  Cada fila es un `TarifaItem`:
 *      { id, categoria, label, descripcion, precio }
 *
 *  Categorías válidas (ver `tarifario.ts`):
 *      particular · publico · mercancias · residuos · especiales · adicionales
 *
 *  Los precios van sin comas y sin "S/". El id es libre pero conviene
 *  prefijarlo por sede (p. ej. "cc-" para Canta Callao) para no chocar.
 */
export const TARIFARIO_COMPLETO_SEDE: Record<number, TarifaItem[]> = {
    // 1 · Sede Callao - Av. Néstor Gambeta
    1: [
        // PARTICULAR
        {
            id: 'ca-part-auto',
            categoria: 'particular',
            label: 'Auto Particular',
            descripcion: 'M1',
            precio: 55,
        },
        {
            id: 'ca-part-camioneta',
            categoria: 'particular',
            label: 'Camioneta Pick Up / SUV / Panel',
            descripcion: 'N1 / M1',
            precio: 70,
        },
        {
            id: 'ca-part-minivan',
            categoria: 'particular',
            label: 'Minivan Particular',
            descripcion: 'M1',
            precio: 70,
        },
        {
            id: 'ca-part-combi',
            categoria: 'particular',
            label: 'Combi Particular',
            descripcion: 'M2',
            precio: 70,
        },

        // TRANSPORTE PÚBLICO
        {
            id: 'ca-pub-taxi',
            categoria: 'publico',
            label: 'Auto Taxi',
            descripcion: 'M1',
            precio: 45,
        },
        {
            id: 'ca-pub-combi-urbano',
            categoria: 'publico',
            label: 'Combi Urbano',
            descripcion: 'M2',
            precio: 50,
        },
        {
            id: 'ca-pub-combi-personal-escolar',
            categoria: 'publico',
            label: 'Combi Transporte Personal / T. Escolar',
            descripcion: 'M2',
            precio: 70,
        },
        {
            id: 'ca-pub-couster-urbano',
            categoria: 'publico',
            label: 'Couster Urbano',
            descripcion: 'M3',
            precio: 60,
        },
        {
            id: 'ca-pub-couster-personal-escolar',
            categoria: 'publico',
            label: 'Couster T. Personal / T. Escolar',
            descripcion: 'M3',
            precio: 80,
        },
        {
            id: 'ca-pub-omnibus-urbano',
            categoria: 'publico',
            label: 'Ómnibus Urbano',
            descripcion: 'M3',
            precio: 70,
        },
        {
            id: 'ca-pub-omnibus-personal-escolar',
            categoria: 'publico',
            label: 'Ómnibus T. Personal / T. Escolar',
            descripcion: 'M3',
            precio: 90,
        },
        {
            id: 'ca-pub-omnibus-interprovincial',
            categoria: 'publico',
            label: 'Ómnibus Interprovincial',
            descripcion: 'M3',
            precio: 130,
        },

        // MERCANCÍAS
        {
            id: 'ca-mer-n2-7500',
            categoria: 'mercancias',
            label: 'Furgón / Panel / Baranda < 7500',
            descripcion: 'N2',
            precio: 80,
        },
        {
            id: 'ca-mer-n2-8500',
            categoria: 'mercancias',
            label: 'Furgón / Panel / Baranda < 8500',
            descripcion: 'N2',
            precio: 90,
        },
        {
            id: 'ca-mer-n2-10500',
            categoria: 'mercancias',
            label: 'Furgón / Panel / Baranda < 10500',
            descripcion: 'N2',
            precio: 110,
        },
        {
            id: 'ca-mer-n3-10500',
            categoria: 'mercancias',
            label: 'Furgón / Panel / Baranda > 10500',
            descripcion: 'N3',
            precio: 130,
        },
        {
            id: 'ca-mer-tracto',
            categoria: 'mercancias',
            label: 'Tracto o Remolcador',
            descripcion: 'N3',
            precio: 130,
        },
        {
            id: 'ca-mer-carreta',
            categoria: 'mercancias',
            label: 'Carreta o Semiremolque',
            descripcion: 'O4 - O3',
            precio: 80,
        },

        // CERTIFICACIONES ADICIONALES
        {
            id: 'ca-adic-opacidad',
            categoria: 'adicionales',
            label: 'Prueba de Opacidad',
            descripcion: 'Certificación adicional',
            precio: 70,
        },
        {
            id: 'ca-adic-hermeticidad',
            categoria: 'adicionales',
            label: 'Prueba de Hermeticidad',
            descripcion: 'Certificación adicional',
            precio: 50,
        },
    ],

    // 2 · Sede Canta Callao
    2: [
        // PARTICULAR
        {
            id: 'cc-part-sedan',
            categoria: 'particular',
            label: 'Sedán, Hatchback, Station Wagon',
            descripcion: 'M1 · Hasta 7 asientos',
            precio: 70,
        },
        {
            id: 'cc-part-suv',
            categoria: 'particular',
            label: 'SUV',
            descripcion: 'M1 · 5 a 7 asientos',
            precio: 80,
        },
        {
            id: 'cc-part-multiproposito',
            categoria: 'particular',
            label: 'Multipropósito, Microbús',
            descripcion: 'M1 · 5 a 7 asientos',
            precio: 80,
        },

        // TRANSPORTE PÚBLICO
        {
            id: 'cc-pub-taxi',
            categoria: 'publico',
            label: 'Taxi',
            descripcion: 'M1 · Hasta 5 asientos',
            precio: 50,
        },
        {
            id: 'cc-pub-combi-urbano',
            categoria: 'publico',
            label: 'Combi / Microbús Urbano',
            descripcion: 'M2 · Máx. 16 asientos – 4 TN',
            precio: 60,
        },
        {
            id: 'cc-pub-couster-urbano',
            categoria: 'publico',
            label: 'Couster o Minibús Urbano',
            descripcion: 'M2 / M3 · Hasta 30 asientos sentados',
            precio: 70,
        },
        {
            id: 'cc-pub-bus-urbano',
            categoria: 'publico',
            label: 'Bus Transporte Urbano',
            descripcion: 'M3 · Hasta 40 asientos sentados – pie',
            precio: 70,
        },
        {
            id: 'cc-pub-escolar',
            categoria: 'publico',
            label: 'Escolar (Combi / H1 / Minibús)',
            descripcion: 'M2 · Hasta 15 asientos sentados',
            precio: 80,
        },
        {
            id: 'cc-pub-turismo-combi',
            categoria: 'publico',
            label: 'Turismo y Personal (Combi)',
            descripcion: 'M2 · Máx. 16 asientos – 4 TN',
            precio: 80,
        },
        {
            id: 'cc-pub-turismo-couster',
            categoria: 'publico',
            label: 'Turismo y Personal (Couster)',
            descripcion: 'M3 · Hasta 30 asientos sentados',
            precio: 100,
        },
        {
            id: 'cc-pub-turismo-bus',
            categoria: 'publico',
            label: 'Turismo y Personal (Bus)',
            descripcion: 'M3 / C3 · Máx. 30 asientos sentados',
            precio: 120,
        },
        {
            id: 'cc-pub-ambulancia-n1',
            categoria: 'publico',
            label: 'Ambulancia',
            descripcion: 'N1 / M1 · Especial',
            precio: 100,
        },
        {
            id: 'cc-pub-ambulancia-n2',
            categoria: 'publico',
            label: 'Ambulancia',
            descripcion: 'N2 / M2 · Especial',
            precio: 120,
        },
        {
            id: 'cc-pub-bus-interprovincial',
            categoria: 'publico',
            label: 'Bus Interprovincial',
            descripcion: 'M3 · Más de 30 asientos sentados',
            precio: 130,
        },

        // MERCANCÍAS
        {
            id: 'cc-mer-n1-camioneta',
            categoria: 'mercancias',
            label: 'Camioneta Pick Up, Panel, Baranda',
            descripcion: 'N1 · Carga hasta 2.5 TN peso bruto',
            precio: 90,
        },
        {
            id: 'cc-mer-n1-furgon',
            categoria: 'mercancias',
            label: 'Furgón',
            descripcion: 'N1 · Carga 2.5 a 3.5 TN peso bruto',
            precio: 100,
        },
        {
            id: 'cc-mer-n2',
            categoria: 'mercancias',
            label: 'Furgón, Baranda, Panel, Cisterna',
            descripcion: 'N2 · Carga 3.5 a 12 TN peso bruto',
            precio: 120,
        },
        {
            id: 'cc-mer-n3',
            categoria: 'mercancias',
            label: 'Remolcador, Camión, Cisterna',
            descripcion: 'N3 · Carga más de 12 TN peso bruto',
            precio: 130,
        },
        {
            id: 'cc-mer-o4',
            categoria: 'mercancias',
            label: 'Carreta, Furgón, Baranda, Cisterna',
            descripcion: 'O4 · Carga / Privado o General',
            precio: 80,
        },

        // RESIDUOS PELIGROSOS
        {
            id: 'cc-res-n1-camioneta',
            categoria: 'residuos',
            label: 'Camioneta Pick Up, Panel, Baranda',
            descripcion: 'N1 · Carga / Privado o General',
            precio: 90,
        },
        {
            id: 'cc-res-n1-furgon',
            categoria: 'residuos',
            label: 'Furgón',
            descripcion: 'N1 · Carga 2.5 a 3.5 TN peso bruto',
            precio: 100,
        },
        {
            id: 'cc-res-n2',
            categoria: 'residuos',
            label: 'Camión de 3500 KG a 10 TN',
            descripcion: 'N2 · Carga / Privado o General',
            precio: 120,
        },
        {
            id: 'cc-res-n3',
            categoria: 'residuos',
            label: 'Camión más de 12 TN',
            descripcion: 'N3 · Carga / Privado o General',
            precio: 130,
        },
        {
            id: 'cc-res-o4',
            categoria: 'residuos',
            label: 'Plataforma, Cama Baja, Carreta, Furgón',
            descripcion: 'O4 · Carga / Privado o General',
            precio: 80,
        },

        // CERTIFICACIONES ADICIONALES
        {
            id: 'cc-adic-hermeticidad',
            categoria: 'adicionales',
            label: 'Prueba de Hermeticidad',
            descripcion: 'Certificación adicional',
            precio: 50,
        },
        {
            id: 'cc-adic-opacidad',
            categoria: 'adicionales',
            label: 'Prueba de Opacidad',
            descripcion: 'Certificación adicional',
            precio: 80,
        },
        {
            id: 'cc-adic-limitador',
            categoria: 'adicionales',
            label: 'Limitador de Velocidad',
            descripcion: 'Certificación adicional',
            precio: 100,
        },
    ],

    // 6 · Sede Ayacucho - Av. Cusco
    6: [
        // PARTICULAR
        {
            id: 'ayc-part-auto',
            categoria: 'particular',
            label: 'Auto Particular',
            descripcion: 'M1 · Inspección anual',
            precio: 60,
        },

        // TRANSPORTE PÚBLICO
        {
            id: 'ayc-pub-taxi',
            categoria: 'publico',
            label: 'Auto Taxi',
            descripcion: 'M1 · Inspección semestral',
            precio: 50,
        },
        {
            id: 'ayc-pub-rural-semestral',
            categoria: 'publico',
            label: 'Camioneta Rural',
            descripcion: 'M2 · Inspección semestral',
            precio: 50,
        },
        {
            id: 'ayc-pub-rural-anual',
            categoria: 'publico',
            label: 'Camioneta Rural',
            descripcion: 'M2 · Inspección anual',
            precio: 80,
        },
        {
            id: 'ayc-pub-couster-turistico',
            categoria: 'publico',
            label: 'Couster Turístico',
            descripcion: 'M3 · Inspección semestral',
            precio: 70,
        },
        {
            id: 'ayc-pub-couster-personal',
            categoria: 'publico',
            label: 'Couster Personal',
            descripcion: 'M3 · Inspección semestral',
            precio: 70,
        },
        {
            id: 'ayc-pub-couster-urbano',
            categoria: 'publico',
            label: 'Couster Urbano',
            descripcion: 'M3 · Inspección semestral',
            precio: 50,
        },
        {
            id: 'ayc-pub-bus-2pisos',
            categoria: 'publico',
            label: 'Bus de 2 Pisos (Transporte Nacional)',
            descripcion: 'M3 · Inspección anual',
            precio: 130,
        },

        // MERCANCÍAS
        {
            id: 'ayc-mer-pickup',
            categoria: 'mercancias',
            label: 'Camioneta Pick Up',
            descripcion: 'N1 · Inspección anual',
            precio: 80,
        },
        {
            id: 'ayc-mer-n1',
            categoria: 'mercancias',
            label: 'Menor de 3500 kg',
            descripcion: 'N1 · Inspección anual',
            precio: 100,
        },
        {
            id: 'ayc-mer-n2-3500',
            categoria: 'mercancias',
            label: 'Mayor de 3500 kg',
            descripcion: 'N2 · Inspección anual',
            precio: 120,
        },
        {
            id: 'ayc-mer-n2-6000',
            categoria: 'mercancias',
            label: 'Mayor de 6000 kg',
            descripcion: 'N2 · Inspección anual',
            precio: 130,
        },
        {
            id: 'ayc-mer-n2-10000',
            categoria: 'mercancias',
            label: 'Mayor de 10000 kg',
            descripcion: 'N2 · Inspección anual',
            precio: 140,
        },
        {
            id: 'ayc-mer-n3-15000',
            categoria: 'mercancias',
            label: 'Mayor de 15000 kg y/o Volquetes',
            descripcion: 'N3 · Inspección anual',
            precio: 150,
        },
        {
            id: 'ayc-mer-tracto',
            categoria: 'mercancias',
            label: 'Tracto',
            descripcion: 'N3 · Inspección anual',
            precio: 130,
        },
        {
            id: 'ayc-mer-carreta',
            categoria: 'mercancias',
            label: 'Carreta',
            descripcion: 'O4 · Inspección anual',
            precio: 120,
        },

        // ESPECIALES (MOTOS)
        {
            id: 'ayc-esp-mototaxi',
            categoria: 'especiales',
            label: 'Moto Taxi',
            descripcion: 'Inspección',
            precio: 35,
        },
        {
            id: 'ayc-esp-moto-lineal',
            categoria: 'especiales',
            label: 'Moto Lineal',
            descripcion: 'Inspección',
            precio: 35,
        },
        {
            id: 'ayc-esp-moto-carga',
            categoria: 'especiales',
            label: 'Moto Carga',
            descripcion: 'Inspección',
            precio: 35,
        },
        {
            id: 'ayc-esp-cuatrimoto',
            categoria: 'especiales',
            label: 'Cuatrimoto',
            descripcion: 'Inspección',
            precio: 35,
        },
    ],
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
export function getTarifasDeSede(sedeId: number): TarifaItem[] {
    // Si la sede tiene su propia lista completa, esa manda.
    const propio = TARIFARIO_COMPLETO_SEDE[sedeId];
    if (propio) return propio;

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
    // Con tarifario completo, todas las filas son propias de la sede.
    if (TARIFARIO_COMPLETO_SEDE[sedeId]) return true;
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
