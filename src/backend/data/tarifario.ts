export type TarifaCategoriaId =
    | 'particular'
    | 'publico'
    | 'mercancias'
    | 'residuos'
    | 'especiales';

export interface TarifaCategoria {
    id: TarifaCategoriaId;
    label: string;
    descripcion: string;
    icon: string;
}

export interface TarifaItem {
    id: string;
    categoria: TarifaCategoriaId;
    label: string;
    descripcion: string;
    precio: number;
}

export const categorias: TarifaCategoria[] = [
    {
        id: 'particular',
        label: 'Particular',
        descripcion: 'Vehículos de uso privado, flotas y transporte de personal.',
        icon: 'car',
    },
    {
        id: 'publico',
        label: 'Público',
        descripcion: 'Transporte de pasajeros: taxi, combi, bus, turístico, escolar y colectivo.',
        icon: 'bus',
    },
    {
        id: 'mercancias',
        label: 'Mercancías',
        descripcion: 'Transporte de carga: furgones, camiones y vehículos de reparto.',
        icon: 'truck',
    },
    {
        id: 'residuos',
        label: 'Residuos Peligrosos',
        descripcion: 'Unidades que trasladan materiales peligrosos o desechos contaminados.',
        icon: 'alert',
    },
    {
        id: 'especiales',
        label: 'Especiales',
        descripcion: 'Motocicletas, vehículos menores y de prueba.',
        icon: 'star',
    },
];

export const tarifas: TarifaItem[] = [
    // PARTICULAR
    {
        id: 'part-automovil',
        categoria: 'particular',
        label: 'Automóvil',
        descripcion: 'Auto, camioneta o SUV hasta 3.5 toneladas.',
        precio: 60,
    },
    {
        id: 'part-furgoneta',
        categoria: 'particular',
        label: 'Furgoneta / Camioneta',
        descripcion: 'Vehículo de carga liviana de uso privado.',
        precio: 70,
    },
    {
        id: 'part-camion',
        categoria: 'particular',
        label: 'Camión Ligero',
        descripcion: 'Unidad de hasta 3.5 toneladas de capacidad.',
        precio: 90,
    },

    // PUBLICO
    {
        id: 'pub-taxi',
        categoria: 'publico',
        label: 'Taxi',
        descripcion: 'TaxiSpider, taxi remasterado y mototaxi.',
        precio: 60,
    },
    {
        id: 'pub-combi',
        categoria: 'publico',
        label: 'Microbus (Combi)',
        descripcion: 'Combi y vehículo de transporte urbano de hasta 15 asientos.',
        precio: 100,
    },
    {
        id: 'pub-turistico-combi',
        categoria: 'publico',
        label: 'Turístico (Combi / Couster)',
        descripcion: 'Servicio turístico con combi o couster.',
        precio: 100,
    },
    {
        id: 'pub-turistico-bus',
        categoria: 'publico',
        label: 'Turístico (Bus)',
        descripcion: 'Ómnibus de turismo.',
        precio: 180,
    },
    {
        id: 'pub-escolar-combi',
        categoria: 'publico',
        label: 'Escolar (Combi)',
        descripcion: 'Transporte escolar en combi.',
        precio: 80,
    },
    {
        id: 'pub-escolar-bus',
        categoria: 'publico',
        label: 'Escolar (Bus)',
        descripcion: 'Transporte escolar en ómnibus.',
        precio: 100,
    },
    {
        id: 'pub-colectivo',
        categoria: 'publico',
        label: 'Colectivo',
        descripcion: 'Vehículo colectivo urbano.',
        precio: 65,
    },
    {
        id: 'pub-colectivo-combi',
        categoria: 'publico',
        label: 'Colectivo (Combi / Couster)',
        descripcion: 'Colectivo con configuración de combi o couster.',
        precio: 105,
    },

    // MERCANCIAS
    {
        id: 'mer-liviano',
        categoria: 'mercancias',
        label: 'Vehículo Liviano de Carga',
        descripcion: 'Reparto y distribución en CAPITAL de Lima.',
        precio: 80,
    },
    {
        id: 'mer-camion',
        categoria: 'mercancias',
        label: 'Camión',
        descripcion: 'Transporte de carga pesada hasta UTPL.',
        precio: 110,
    },
    {
        id: 'mer-quinta-rueda',
        categoria: 'mercancias',
        label: 'Camión con Quinta Rueda',
        descripcion: 'Tractor de carga con semirremolque.',
        precio: 135,
    },

    // RESIDUOS PELIGROSOS
    {
        id: 'res-liviano',
        categoria: 'residuos',
        label: 'Unidad Liviana',
        descripcion: 'Vehículo liviano habilitado para transporte de residuos.',
        precio: 95,
    },
    {
        id: 'res-pesado',
        categoria: 'residuos',
        label: 'Unidad Pesada',
        descripcion: 'Camión tractor habilitado para residuos peligrosos.',
        precio: 125,
    },

    // ESPECIALES
    {
        id: 'esp-motocicleta',
        categoria: 'especiales',
        label: 'Motocicleta',
        descripcion: 'Moto, mototaxi y Triciclo motorizado.',
        precio: 45,
    },
    {
        id: 'esp-menor',
        categoria: 'especiales',
        label: 'Vehículo Menor',
        descripcion: 'Cuatrimoto, triciclo y otros vehículos menores.',
        precio: 35,
    },
];

/** Documentos que pide la inspección para cualquier vehículo. */
export const requisitosBase: string[] = [
    'Tarjeta de Propiedad (TIV) física o electrónica.',
    'SOAT vigente.',
    'Certificado de revisión anterior, si el vehículo ya pasó la inspección.',
];

/** Requisitos adicionales según el tipo de servicio. */
export const requisitosPorCategoria: Record<TarifaCategoriaId, string[]> = {
    particular: [
        'Permiso de lunas polarizadas, si el vehículo cuenta con ellas.',
        'Certificado de conformidad de conversión a gas, si es GNV o GLP.',
    ],
    publico: [
        'Tarjeta de Circulación vigente.',
        'Habilitación vehicular del MTC o Municipalidad, según la modalidad de servicio.',
        'Permiso de lunas polarizadas, si corresponde.',
    ],
    mercancias: [
        'Tarjeta de Circulación vigente.',
        'Habilitación vehicular para transporte de carga.',
        'Permiso de lunas polarizadas, si corresponde.',
    ],
    residuos: [
        'Autorización vigente para transportar residuos peligrosos.',
        'Manifiesto y declaración de residuos del transporte.',
        'Señalización y equipamiento reglamentario del vehículo.',
    ],
    especiales: [
        'Certificado de matrícula del vehículo, si corresponde.',
    ],
};

/** Requisitos que aplican a una tarifa concreta: los generales más los de su categoría. */
export function getRequisitos(tarifaId: string): string[] {
    const item = tarifas.find((t) => t.id === tarifaId);
    if (!item) return requisitosBase;
    return [...requisitosBase, ...requisitosPorCategoria[item.categoria]];
}
