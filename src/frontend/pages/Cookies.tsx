import LegalLayout from '../components/LegalLayout';
import { Cookie } from 'lucide-react';
import { EMAIL_CONTACTO, TELEFONO_CONTACTO } from '../../backend/data/contacto';

const Cookies = () => {
  return (
    <LegalLayout
      path="/cookies"
      eyebrow="Tecnologia y Navegacion"
      title="Politica de Cookies"
      lastUpdated="[FECHA DE ULTIMA ACTUALIZACION]"
      icon={<Cookie size={26} />}
      intro="Esta politica explica que cookies y tecnologias similares utiliza RTP San Cristóbal en este sitio web, para que fines utilizan, como puede rechazarlas y como gestionarlas. Respetamos su derecho a elegir libremente conforme a la Ley N. 29733 y a las directrices de la Autoridad Nacional de Proteccion de Datos Personales."
      sections={[
        {
          id: 'que-son',
          title: 'Que son las cookies',
          content: (
            <>
              <p>
                Las cookies son pequenos archivos de texto que se almacenan en su navegador al visitar un sitio web.
                Permiten recordar informacion sobre sus visitas para ofrecerle una experiencia mas personalizada y
               Holder el funcionamiento tecnico del sitio. Las tecnologias similares incluyen el almacenamiento
                local (localStorage y sessionStorage) y technologies de rastreo de tipo pixel.
              </p>
            </>
          ),
        },
        {
          id: 'tipos',
          title: 'Tipos de cookies que utilizamos',
          content: (
            <>
              <ul className="space-y-3">
                <li className="border-l-2 border-orange-400 pl-4">
                  <strong>Cookies estrictamente necesarias.</strong> Son indispensables para el funcionamiento basico
                  del sitio. No requieren consentimiento previo porque sin ellas el sitio no podria operar. En este
                  grupo se encuentra el almacenamiento de su preferencia de consentimiento.
                </li>
                <li className="border-l-2 border-orange-400 pl-4">
                  <strong>Cookies de preferencia y geolocalizacion.</strong> Permiten recordar decisiones suyas, como
                  la aceptacion o rechazo de la geolocalizacion, para no volver a preguntarle en cada visita.
                </li>
                <li className="border-l-2 border-gray-300 pl-4">
                  <strong>Cookies analiticas.</strong> Se utilizan para medir como los visitantes utilizan el sitio
                  de forma agregada yanonima. Este sitio no utiliza cookies analiticas de terceros en la actualidad.
                </li>
                <li className="border-l-2 border-gray-300 pl-4">
                  <strong>Cookies publicitarias.</strong> Se utilizan para mostrar publicidad relevante based en sus
                  intereses. Este sitio no utiliza cookies publicitarias de terceros en la actualidad.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'tabla',
          title: 'Cookies y tecnologias que usamos en este sitio',
          content: (
            <>
              <div className="overflow-x-auto border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-black">Nombre</th>
                      <th className="px-4 py-3 font-black">Propietario</th>
                      <th className="px-4 py-3 font-black">Finalidad</th>
                      <th className="px-4 py-3 font-black">Duracion</th>
                      <th className="px-4 py-3 font-black">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">cookieConsent</td>
                      <td className="px-4 py-3">RTP San Cristóbal</td>
                      <td className="px-4 py-3">Registra su decision sobre el aviso de cookies y evita mostrarlo novamente.</td>
                      <td className="px-4 py-3">Persistente</td>
                      <td className="px-4 py-3">Estrictamente necesaria</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">hasAskedLocation</td>
                      <td className="px-4 py-3">RTP San Cristóbal</td>
                      <td className="px-4 py-3">Registra si ya respondio al aviso de geolocalizacion.</td>
                      <td className="px-4 py-3">Persistente</td>
                      <td className="px-4 py-3">Preferencia</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">hasSeenWelcomePopup</td>
                      <td className="px-4 py-3">RTP San Cristóbal</td>
                      <td className="px-4 py-3">Evita mostrar el mensaje de bienvenida en cada visita.</td>
                      <td className="px-4 py-3">Persistente</td>
                      <td className="px-4 py-3">Estrictamente necesaria</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">userLat / userLon</td>
                      <td className="px-4 py-3">RTP San Cristóbal</td>
                      <td className="px-4 py-3">Guarda temporalmente sus coordenadas para calcular la distancia a la sede mas cercana. No se envia a nuestros servidores.</td>
                      <td className="px-4 py-3">Sesion</td>
                      <td className="px-4 py-3">Preferencia</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">OSM Tiles</td>
                      <td className="px-4 py-3">OpenStreetMap</td>
                      <td className="px-4 py-3">Carga de las imagenes del mapa de sedes. El servidor de OpenStreetMap recibe su direccion IP y datos tecnicos de navegacion.</td>
                      <td className="px-4 py-3">Sesion</td>
                      <td className="px-4 py-3">De terceros</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">OSRM Route</td>
                      <td className="px-4 py-3">router.project-osrm.org</td>
                      <td className="px-4 py-3">Calculo de distancia y tiempo estimado hasta la sede. Solo se activa si usted autoriza la geolocalizacion y acepta el calculo de ruta.</td>
                      <td className="px-4 py-3">Sesion</td>
                      <td className="px-4 py-3">De terceros</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500">
                Nota: la informacion de geolocalizacion y el calculo de ruta hacia terceros requieren su
                consentimiento expreso. Si lo rechaza, el sitio funcionara igualmente mostrando unicamente la
                distancia en linea recta.
              </p>
            </>
          ),
        },
        {
          id: 'consentimiento',
          title: 'Su consentimiento',
          content: (
            <>
              <p>
                De acuerdo a la Ley N. 29733 y las directrices de la Autoridad Nacional de Proteccion de Datos
                Personales, el uso de cookies no estrictamente necesarias esta sujeto a su consentimiento previo,
                expreso, informado, inequivoco y separable del consentimiento para el tratamiento de sus datos
                personales. Pode.Withdraw su consentimiento en cualquier momento y de forma gratuita.
              </p>
              <p>
                Al fazer clic en Aceptar, usted declara haber leido y aceptado esta Politica de Cookies y la
                Politica de Privacidad. Si selecciona Rechazar, solo se activaran las cookies estrictamente
                necesarias. Puede cambiar su decision en cualquier momento desde el enlace Configurar cookies
                disponible en el pie de cada pagina.
              </p>
            </>
          ),
        },
        {
          id: 'gestionar',
          title: 'Como puede gestionar o deshabilitar las cookies',
          content: (
            <>
              <p>
                Puede controlar y restringir sus preferencias de cookies desde las opciones de su navegador. La mayoria
                de los navegadores permiten eliminar cookies, bloquearlas por sitio o configurar reglas para
               los navegadores. A continuacion se indican las rutas habituales de los navegadores mas utilizados:
              </p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li><strong>Google Chrome:</strong> Configuracion &gt; Privacidad y seguridad &gt; Cookies de terceros y otros datos.</li>
                <li><strong>Mozilla Firefox:</strong> Configuracion &gt; Privacidad y seguridad &gt; Cookies y datos de sitios.</li>
                <li><strong>Microsoft Edge:</strong> Configuracion &gt; Privacidad, busqueda y servicios &gt; Cookies y datos de sitios.</li>
                <li><strong>Safari:</strong> Preferencias &gt; Privacidad y seguridad &gt; Cookies.</li>
              </ul>
              <p>
                Advertencia: si deshabilita las cookies estrictamente necesarias, algunas funciones del sitio
                podrian no operar correctamente y el aviso de consentimiento volveria a mostrarse en cada visita.
              </p>
            </>
          ),
        },
        {
          id: 'terceros',
          title: 'Cookies de terceros y transferencias',
          content: (
            <>
              <p>
                Algunos componentes del sitio interactuan con servicios de terceros que pueden instalar cookies o
                almacenar datos tecnicos en su navegador. Estos servicios se encuentran sujetos a sus propias
                politicas de privacidad, sobre las cuales RTP San Cristóbal no tiene control:
              </p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li><strong>OpenStreetMap:</strong> politica de privacidad disponible en openstreetmap.org.</li>
                <li><strong>WhatsApp (Meta):</strong> al hacer clic en nuestros enlaces, se aplica la politica de privacidad de WhatsApp.</li>
              </ul>
              <p>
                En ningun caso estos terceros acceden a los datos que usted ingresa en nuestros formularios, ya que
                estos se procesan unicamente en nuestros sistemas.
              </p>
            </>
          ),
        },
        {
          id: 'seguridad',
          title: 'Seguridad de la informacion',
          content: (
            <>
              <p>
                Para proteger la informacion almacenada en su navegador, el sitio utiliza conexiones seguras HTTPS y
                aplica medidas de seguridad razonables conforme al articulo 5 de la Ley N. 29733. No obstante, si su
                equipo esta infectado con software malicioso, su equipo o su red pueden estar expuestos a riesgos que
                estan fuera de nuestro control. Le recomendamos mantener su navegador y su sistema operativo
                actualizados y utilizar software antivirus.
              </p>
            </>
          ),
        },
        {
          id: 'nuevas-cookies',
          title: 'Cookies nuevas y cambios en esta politica',
          content: (
            <>
              <p>
                Nos reservamos el derecho de actualizar esta Politica de Cookies en cualquier momento. Si IFRS.Cookie de
                forma significativa, se lo informaremos mediante un aviso destacado o, cuando sea requerido, le
                solicitaremos un nuevo consentimiento. La fecha de ultima actualizacion se indica al inicio de esta
                pagina.
              </p>
            </>
          ),
        },
        {
          id: 'contacto-cookies',
          title: 'Contacto',
          content: (
            <>
              <p>Si tiene preguntas sobre esta Politica de Cookies, puede contactarnos a traves de:</p>
              <ul className="space-y-2 border-l-2 border-orange-300 pl-4 my-4">
                <li><strong>Correo electronico:</strong> {EMAIL_CONTACTO}</li>
                <li><strong>Telefono:</strong> {TELEFONO_CONTACTO}</li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
};

export default Cookies;
