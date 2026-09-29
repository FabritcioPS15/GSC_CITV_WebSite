import LegalLayout from '../components/LegalLayout';
import { ShieldCheck } from 'lucide-react';
import { EMAIL_CONTACTO, TELEFONO_CONTACTO } from '../../backend/data/contacto';

const Placeholder = ({ children }: { children: string }) => (
  <mark className="bg-orange-100 text-orange-800 px-1.5 py-0.5 font-bold">{children}</mark>
);

const Privacidad = () => {
  return (
    <LegalLayout
      eyebrow="Proteccion de Datos Personales"
      title="Politica de Privacidad"
      lastUpdated="[FECHA DE ULTIMA ACTUALIZACION]"
      icon={<ShieldCheck size={26} />}
      intro="En Grupo San Cristobal (en adelante, la Empresa, nosotros o RTP/RTV San Cristobal) tratamos los datos personales que usted nos proporciona a traves de este sitio web con transparencia y conforme a la Ley N. 29733, Ley de Proteccion de Datos Personales, su Reglamento aprobado por Decreto Supremo N. 003-2013-JUS, y el Codigo de Proteccion y Defensa del Consumidor (Ley N. 29571). Esta politica explica que datos recopilamos, para que los usamos, con quien los compartimos y como usted puede ejercer sus derechos."
      sections={[
        {
          id: 'identificacion',
          title: 'Identificacion del titular del banco de datos',
          content: (
            <>
              <p>
                Conforme al articulo 4 de la Ley N. 29733, el tratamiento de sus datos personales se realiza por
                intermedio de la siguiente entidad, titular del banco de datos personales:
              </p>
              <ul className="space-y-2 border-l-2 border-orange-300 pl-4 my-4">
                <li><strong>Razon social:</strong> <Placeholder>RAZON SOCIAL DE LA EMPRESA</Placeholder></li>
                <li><strong>RUC:</strong> <Placeholder>RUC DE LA EMPRESA</Placeholder></li>
                <li><strong>Domicilio fiscal:</strong> <Placeholder>DOMICILIO FISCAL</Placeholder></li>
                <li><strong>Sitio web:</strong> <Placeholder>DOMINIO WEB OFICIAL</Placeholder></li>
              </ul>
              <p>
                Cualquier reclamo, consulta o ejercicio de derechos debe dirigirse a nuestro correo de privacidad:
                <a href={`mailto:${EMAIL_CONTACTO}`} className="text-orange-600 hover:underline break-words">{EMAIL_CONTACTO}</a>.
              </p>
            </>
          ),
        },
        {
          id: 'alcance',
          title: 'Alcance y definiciones',
          content: (
            <>
              <p>
                Esta politica aplica a la persona (el Titular, usted o usuario) que visita, consulta o utiliza este
                sitio web y los canales digitales de atencion de la Empresa.
              </p>
              <ul className="space-y-2 list-disc pl-5 marker:text-orange-500">
                <li><strong>Banco de datos personales:</strong> conjunto organizado de datos personales tratados con la finalidad de registrarlos de manera sistematica.</li>
                <li><strong>Dato personal:</strong> toda informacion que identifica o puede permitir identificar a una persona, de forma directa o indirecta.</li>
                <li><strong>Dato sensible:</strong> datos sobre la salud, origen racial, identidad, opinion politica, religion u otros de naturaleza similar.</li>
                <li><strong>Tratamiento:</strong> toda operacion que implica la recepcion, compilacion, almacenamiento, acceso, uso, reproduccion, transporte, difusion o eliminacion de datos.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'datos',
          title: 'Datos que recopilamos',
          content: (
            <>
              <p>La Empresa no recopila datos a traves de este sitio de manera automatica, salvo la informacion tecnica basica del navegador.</p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li><strong>Formularios de contacto y atencion:</strong> nombre, correo electronico, numero de telefono y mensaje o consulta realizada a traves de nuestros canales.</li>
                <li><strong>Consultas en linea:</strong> numero de placa de vehiculo y tipo de servicio consultado (inspeccion tecnica, revision, GLP o GNV).</li>
                <li><strong>Geolocalizacion (opcional):</strong> si usted lo autoriza, su navegador comparte su ubicacion aproximada para identificar la sede mas cercana. Se utiliza localmente en su navegador.</li>
                <li><strong>Informacion tecnica basica:</strong> tipo de navegador, sistema operativo, paginas visitadas y datos de navegacion, tratados conforme a la Politica de Cookies.</li>
              </ul>
              <div className="border-l-4 border-red-400 bg-red-50 p-4 my-4 text-sm text-red-900">
                <strong>Importante:</strong> no recopilamos datos sensibles a traves de este sitio. Si requiere
                tratarlos, por ejemplo informacion medica, debera gestionar la relacion directamente con la sede
                correspondiente bajo las medidas de seguridad de la Empresa.
              </div>
            </>
          ),
        },
        {
          id: 'finalidad',
          title: 'Finalidades del tratamiento',
          content: (
            <>
              <p>Sus datos personales son tratados para las siguientes finalidades:</p>
              <ol className="space-y-2.5 list-decimal pl-5 marker:text-orange-600 marker:font-bold">
                <li>Gestionar y atender sus solicitudes de informacion, cotizaciones y consultas de servicios.</li>
                <li>Brindar los servicios de inspeccion tecnica, revision y conversion de GLP o GNV.</li>
                <li>Identificar la sede mas cercana cuando usted lo autoriza mediante geolocalizacion.</li>
                <li>Cumplir con las obligaciones legales, normativas y contractuales aplicables.</li>
                <li>Mejorar la calidad de nuestros productos y servicios mediante el analisis de navegacion.</li>
              </ol>
            </>
          ),
        },
        {
          id: 'consentimiento',
          title: 'Base legal y consentimiento',
          content: (
            <>
              <p>El tratamiento de sus datos personales se sustenta en las bases legales previstas en la Ley N. 29733:</p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li><strong>Consentimiento (articulo 5):</strong> usted lo otorga al hacer clic en Aceptar en el aviso de cookies o al enviar un formulario.</li>
                <li><strong>Ejecucion de la relacion contractual:</strong> para atender las consultas de servicios que usted solicita.</li>
                <li><strong>Cumplimiento de obligacion legal:</strong> para atender requerimientos de autoridades competentes.</li>
                <li><strong>Interes legitimo:</strong> para mejorar nuestros servicios y la seguridad del sitio, previo analisis de equilibrio de intereses.</li>
              </ul>
              <p>
                Usted puede retirar su consentimiento en cualquier momento, de forma gratuita, escribiendo a nuestro
                correo de privacidad. El retiro no afecta la licitud del tratamiento previo a ese momento.
              </p>
            </>
          ),
        },
        {
          id: 'terceros',
          title: 'Transferencia y tratamiento por terceros',
          content: (
            <>
              <p>
                La Empresa no vende ni cede sus datos personales. Sin embargo, para operar el sitio, su navegador
                puede establecer comunicacion con los siguientes terceros:
              </p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li><strong>OpenStreetMap y Leaflet:</strong> para mostrar mapas y calcular la distancia a las sedes. Estas entidades reciben su direccion IP y datos tecnicos de navegacion.</li>
                <li><strong>Servicios de rutas en linea (OSRM):</strong> para estimar la distancia y el tiempo hasta la sede mas cercana, unicamente si usted lo autoriza de forma expresa.</li>
                <li><strong>Proveedores tecnologicos:</strong> servicios de hospedaje web necesarios para el funcionamiento del sitio, sujetos a acuerdos de confidencialidad.</li>
                <li><strong>WhatsApp (Meta):</strong> cuando usted decide contactarnos mediante nuestros enlaces de WhatsApp, acepta la politica de privacidad de dicho servicio.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'seguridad',
          title: 'Seguridad de la informacion',
          content: (
            <>
              <p>La Empresa implementa medidas tecnicas y organizativas razonables para proteger sus datos personales, conforme al articulo 5 de la Ley N. 29733. Entre estas medidas se incluyen:</p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li>Uso de conexiones seguras mediante HTTPS.</li>
                <li>Control de acceso interno a la informacion por personal autorizado.</li>
                <li>Almacenamiento local de preferencias en su navegador mediante localStorage y sessionStorage.</li>
                <li>Capacitacion y binders de confidencialidad para el personal con acceso a datos personales.</li>
              </ul>
              <p>No obstante lo anterior, ningun sistema es completamente seguro y la Empresa no se responsabiliza por incidentes que se originen en vulnerabilidades fuera de su control razonable.</p>
            </>
          ),
        },
        {
          id: 'plazos',
          title: 'Plazo de conservacion de los datos',
          content: (
            <>
              <p>
                Sus datos personales se conservaran por el tiempo necesario para cumplir las finalidades descritas y,
                en particular, por los plazos legales exigidos por la normativa vigente, tales como los registros de
                inspeccion, los registros de atencion al usuario y el registro de treatment de datos personales. Una
                vez cumplidos estos plazos, los datos se eliminaran o bloquearan conforme a la ley.
              </p>
            </>
          ),
        },
        {
          id: 'arco',
          title: 'Derechos ARCO del titular',
          content: (
            <>
              <p>De conformidad con el articulo 14 de la Ley N. 29733, usted tiene derecho a:</p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li><strong>Acceso (A):</strong> conocer si sus datos personales estan siendo tratados y conocer su contenido.</li>
                <li><strong>Rectificacion (R):</strong> solicitar la correccion de datos inexactos, incompletos o con errores.</li>
                <li><strong>Cancelacion (C):</strong> solicitar la eliminacion de sus datos cuando considere que no se requieren para las finalidades collecting.</li>
                <li><strong>Oposicion (O):</strong> oponerse al tratamiento de sus datos por motivos legales fundados.</li>
                <li><strong>Informacion de terceros:</strong> conocer si sus datos han sido proporcionados a terceros o entidades competencia.</li>
                <li><strong>Revocacion del consentimiento:</strong> retirar su consentimiento en cualquier momento y de forma gratuita.</li>
              </ul>
              <p>
                Para ejercer estos derechos, envie una solicitud escrita firmada que incluya su nombre completo,
                documento de identidad, datos de contacto, el derecho que desea ejercer, la descripcion clara de los
                datos involucrados y su firma escaneada o digital, al correo de privacidad indicado en esta politica.
                La Empresa atendera su solicitud en un plazo maximo de veinte dias habiles, prorrogable por veinte
                dias adicionales en casos justificados.
              </p>
            </>
          ),
        },
        {
          id: 'menores',
          title: 'Proteccion de menores de edad',
          content: (
            <>
              <p>
                Este sitio esta dirigido a personas mayores de dieciocho anos. La Empresa no recopila de forma
                intencional datos personales de menores de edad. Si usted es menor de dieciocho anos o cree que un
                menor nos ha proporcionado datos, contactenos para solicitar su eliminacion inmediata.
              </p>
            </>
          ),
        },
        {
          id: 'modificaciones',
          title: 'Modificaciones de la politica',
          content: (
            <>
              <p>
                La Empresa puede actualizar esta politica de privacidad en cualquier momento. Cualquier modificacion
                sera publicada en esta pagina indicando la fecha de ultima actualizacion. Si el cambio afecta
                sustancialmente el tratamiento de sus datos, le informaremos mediante un aviso destacado o le
                solicitaremos un nuevo consentimiento.
              </p>
            </>
          ),
        },
        {
          id: 'contacto-legal',
          title: 'Contacto',
          content: (
            <>
              <p>Para cualquier consulta, reclamo o ejercicio de derechos relacionado con la proteccion de sus datos personales, puede contactarnos a traves de:</p>
              <ul className="space-y-2 border-l-2 border-orange-300 pl-4 my-4">
                <li><strong>Correo electronico:</strong> <a href={`mailto:${EMAIL_CONTACTO}`} className="text-orange-600 hover:underline break-words">{EMAIL_CONTACTO}</a></li>
                <li><strong>Telefono:</strong> {TELEFONO_CONTACTO}</li>
                <li><strong>Direccion:</strong> <Placeholder>DIRECCION FISCAL</Placeholder></li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
};

export default Privacidad;
