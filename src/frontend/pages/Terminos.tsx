import LegalLayout from '../components/LegalLayout';
import { FileText } from 'lucide-react';
import { EMAIL_CONTACTO, TELEFONO_CONTACTO } from '../../backend/data/contacto';

const Placeholder = ({ children }: { children: string }) => (
  <mark className="bg-orange-100 text-orange-800 px-1.5 py-0.5 font-bold">{children}</mark>
);

const Terminos = () => {
  return (
    <LegalLayout
      path="/terminos"
      eyebrow="Uso del Sitio y de los Servicios"
      title="Terminos y Condiciones"
      lastUpdated="[FECHA DE ULTIMA ACTUALIZACION]"
      icon={<FileText size={26} />}
      intro="Los presentes Terminos y Condiciones regulan el acceso y uso del sitio web de Grupo San Cristobal, asi como la utilizacion de sus canales digitales de atencion, consultas en linea y servicios de informacion. Al utilizar este sitio, usted declara haber leido, entendido y aceptado en su totalidad las condiciones aqui establecidas."
      sections={[
        {
          id: 'aceptacion',
          title: 'Aceptacion de los terminos',
          content: (
            <>
              <p>
                Al acceder a este sitio web, usted acepta de forma expresa e informada los presentes Terminos y
                Condiciones, la Politica de Privacidad y la Politica de Cookies. Si no está de acuerdo con alguno
                de ellos, le pedimos no utilizar el sitio.
              </p>
              <p>
                La Empresa se reserva el derecho de modificar estos Terminos en cualquier momento. Los cambios
                seran publicados en esta pagina con su respective fecha de actualizacion y sera su
                responsabilidad revisarlos periodicamente.
              </p>
            </>
          ),
        },
        {
          id: 'objeto',
          title: 'Objeto del sitio',
          content: (
            <>
              <p>Este sitio web tiene por finalidad:</p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li>Informar sobre los servicios de inspeccion tecnica vehicular, revision y conversion de GLP o GNV ofrecidos por la Empresa.</li>
                <li>Publicar informacion sobre nuestras sedes, horarios, tarifas y requisitos.</li>
                <li>Ofrecer canales digitales de atencion y solicitud de informacion.</li>
                <li>Proporcionar herramientas de consulta informativa sobre placas de vehiculos y estado de revisiones.</li>
              </ul>
              <p>
                La informacion publicada en este sitio tiene caracter meramente informativo y no constituye una
                certificacion oficial ni sustituye los tramites realizados ante el Ministerio de Transportes y
                Comunicaciones (MTC) u otra entidad competente.
              </p>
            </>
          ),
        },
        {
          id: 'uso-permitido',
          title: 'Uso permitido y prohibiciones',
          content: (
            <>
              <p>Al utilizar este sitio, usted se compromete a:</p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li>Hacer un uso personal y no comercial del sitio.</li>
                <li>Proporcionar informacion veraz y exacta en los formularios que complete.</li>
                <li>No intentar acceder de forma no autorizada a los sistemas, servidores o bases de datos del sitio.</li>
                <li>No introducir malware, virus ni codigos maliciosos de ningun tipo.</li>
                <li>No realizar acciones que puedan perjudicar la seguridad, integridad o disponibilidad del sitio o de terceros usuarios.</li>
                <li>No extraer, copiar ni reproducir bulk el contenido del sitio sin autorizacion previa y escrita.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'servicios-info',
          title: 'Servicios de consulta e informacion en linea',
          content: (
            <>
              <p>
                El sitio ofrece herramientas de consulta informativa, incluyendo la consulta por numero de placa y
                el estado de revisiones tecnicas. Se hace constar que:
              </p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li>Los resultados mostrados tienen caracter orientativo y se basan en la informacion disponible en el momento de la consulta.</li>
                <li>Los resultados no constituyen un documento oficial ni tienen efectos legales.</li>
                <li>La Empresa no se responsabiliza por errores, omisiones o desactualizaciones en la informacion mostrada.</li>
                <li>Para efectos legales y oficiales, debera acudir a una sede autorizada o a los canales oficiales del MTC.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'disponibilidad',
          title: 'Disponibilidad y modificaciones del servicio',
          content: (
            <>
              <p>
                La Empresa se reserva el derecho de suspender, modificar o discontinuar cualquier
                servicio o funcionalidad del sitio en cualquier momento, sin previo aviso, ya sea por motivos
                tecnicos, de mantenimiento, operativos o legales.
              </p>
              <p>
                Procuraremos mantener el sitio disponible de forma continua, pero no garantizamos que funcione
                sin interrupciones ni errores. El sitio podria no estar disponible por mantenimientos programados,
                fallas en la red o causas de fuerza mayor.
              </p>
            </>
          ),
        },
        {
          id: 'propiedad-intelectual',
          title: 'Propiedad intelectual',
          content: (
            <>
              <p>
                El contenido de este sitio web, incluyendo pero no limitado a textos, imagenes, disenos, logotipos,
                marcas, codigos fuente y elementos visuales, es propiedad de la Empresa o de sus licenciantes y se
                encuentra protegido por la legislacion peruana sobre propiedad industrial e intelectual (Ley N. 27811
                y Decreto Legislativo N. 822).
              </p>
              <p>
                Queda expresamente prohibida la reproduccion, distribucion, comunicacion publica, transformacion o
                distribucion total o parcial de dicho contenido sin la autorizacion previa y escrita de la Empresa.
              </p>
            </>
          ),
        },
        {
          id: 'enlaces',
          title: 'Enlaces a sitios de terceros',
          content: (
            <>
              <p>
                Este sitio puede contener enlaces a sitios web de terceros. La Empresa no controla ni se hace
                responsable del contenido, politicas de privacidad, practicidad o disponibilidad de dichos sitios.
                La inclusion de un enlace no implica respaldo ni asociacion alguna con el sitio enlazado.
              </p>
            </>
          ),
        },
        {
          id: 'responsabilidad',
          title: 'Limitacion de responsabilidad',
          content: (
            <>
              <p>
                La Empresa no se responsabiliza por danos y perjuicios derivados de:
              </p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li>La utilizacion del sitio o de la informacion publicada en el.</li>
                <li>La suspension, interrupcion o indisponibilidad del servicio por causas ajenas a su control razonable.</li>
                <li>La introduccion de datos incorrectos por parte del usuario en los formularios o consultas.</li>
                <li>Acciones de terceros o ataques a sistemas que comprometan el funcionamiento del sitio.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'ley-aplicable',
          title: 'Legislacion aplicable y solucion de controversias',
          content: (
            <>
              <p>
                Los presentes Terminos y Condiciones se rigen por las leyes de la Republica del Peru. Para la
                solucion de cualquier controversia o diferencia que surja de su interpretacion o ejecucion, las
                partes acuerdan someter la controversia a la jurisdiccion de los jueces y tribunales competentes de
                la ciudad de <Placeholder>CIUDAD DE LA SEDE PRINCIPAL</Placeholder>, renunciando al fuero de sus
                domicilios.
              </p>
            </>
          ),
        },
        {
          id: 'derecho-revocacion',
          title: 'Derecho de revocacion del consentimiento',
          content: (
            <>
              <p>
                Usted puede, en cualquier momento, revocar su consentimiento otorgado a traves de los formularios
                de este sitio, escribiendo al correo de privacidad indicado en la Politica de Privacidad. El
                ejercicio de este derecho no tendra efecto retroactivo sobre los tratamientos ya realizados.
              </p>
            </>
          ),
        },
        {
          id: 'contacto-terminos',
          title: 'Contacto',
          content: (
            <>
              <p>Para cualquier consulta sobre estos Terminos y Condiciones, contactenos a traves de:</p>
              <ul className="space-y-2 border-l-2 border-orange-300 pl-4 my-4">
                <li><strong>Correo electronico:</strong> {EMAIL_CONTACTO}</li>
                <li><strong>Telefono:</strong> {TELEFONO_CONTACTO}</li>
                <li><strong>Direccion:</strong> <Placeholder>DIRECCION DE LA SEDE PRINCIPAL</Placeholder></li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
};

export default Terminos;
