/**
 * Datos de contacto oficiales de la empresa.
 *
 * Fuente única de verdad: los componentes importan de acá en lugar de
 * escribir el correo a mano, para que un cambio se aplique en todo el sitio.
 */
export const EMAIL_CONTACTO = 'atencionalcliente@corpsancristobal.pe';

/** Teléfono principal de atención al cliente. */
export const TELEFONO_CONTACTO = '+51 987 654 321';

/** Enlace mailto: listo para usar en un href. */
export const MAILTO_CONTACTO = `mailto:${EMAIL_CONTACTO}`;
