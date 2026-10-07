import LegalLayout from '../components/LegalLayout';
import { BookOpen } from 'lucide-react';
import { EMAIL_CONTACTO, TELEFONO_CONTACTO } from '../../backend/data/contacto';

const Placeholder = ({ children }: { children: string }) => (
  <mark className="bg-orange-100 text-orange-800 px-1.5 py-0.5 font-bold">{children}</mark>
);

const LibroReclamaciones = () => {
  return (
    <LegalLayout
      path="/libro-de-reclamaciones"
      eyebrow="Defensa del Consumidor"
      title="Libro de Reclamaciones"
      lastUpdated="[FECHA DE ULTIMA ACTUALIZACION]"
      icon={<BookOpen size={26} />}
      intro="Conforme al Codigo de Proteccion y Defensa del Consumidor (Ley N. 29571) y su Reglamento (Decreto Supremo N. 017-2009-JUS), RTP San Cristóbal pone a disposicion de los consumidores el Libro de Reclamaciones en su version virtual. Este canal le permite registrar InvestigativeTrack su reclamo o queja de manera directa y con constancia."
      sections={[
        {
          id: 'identificacion-lr',
          title: 'Identificacion del proveedor',
          content: (
            <>
              <p>Los datos de identificacion del proveedor, requeridos por el Articulo 24 del Codigo de Proteccion y Defensa del Consumidor, son:</p>
              <ul className="space-y-2 border-l-2 border-orange-300 pl-4 my-4">
                <li><strong>Razon social:</strong> <Placeholder>RAZON SOCIAL DE LA EMPRESA</Placeholder></li>
                <li><strong>RUC:</strong> <Placeholder>RUC DE LA EMPRESA</Placeholder></li>
                <li><strong>Direccion del establecimiento:</strong> <Placeholder>DIRECCION DE LA SEDE PRINCIPAL</Placeholder></li>
              </ul>
            </>
          ),
        },
        {
          id: 'que-es',
          title: 'Que es el Libro de Reclamaciones',
          content: (
            <>
              <p>
                El Libro de Reclamaciones es el registro fisico o virtual en el que los consumidores pueden dejar
                constancia de sus reclamos y quejas relacionados con los bienes o servicios ofrecidos por los
                proveedores. La inscripcion de un reclamo no implica un reconhecimento de responsabilidad por
                parte de la Empresa, sino un constancia de su presentacion.
              </p>
            </>
          ),
        },
        {
          id: 'reclamo-virtual',
          title: 'Presentacion de un reclamo en linea',
          content: (
            <>
              <p>Usted puede registrar su reclamo o queja en linea completando el formulario de contacto de este sitio o escribiendo directamente a:</p>
              <ul className="space-y-2 border-l-2 border-orange-300 pl-4 my-4">
                <li><strong>Correo electronico:</strong> {EMAIL_CONTACTO}</li>
                <li><strong>Telefono:</strong> {TELEFONO_CONTACTO}</li>
              </ul>
              <p>Para que su reclamo sea tramitado, debera incluir la siguiente informacion:</p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li>Nombre completo del consumidor.</li>
                <li>Documento de identidad (DNI o CE).</li>
                <li>Domicilio y/o correo electronico para las notificaciones.</li>
                <li>Descripcion clara del reclamo o queja.</li>
                <li>Fecha y lugar donde se genero el hecho.</li>
                <li>Detalle del bien o servicio adquirido.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'libro-fisico',
          title: 'Libro de Reclamaciones fisico',
          content: (
            <>
              <p>
                La Empresa cuenta asimismo con un Libro de Reclamaciones fisico disponible en su sede principal y en
                las sedes habilitadas. Los consumidores pueden registrar sus reclamos o quejas de forma presencial
                durante el horario de atencion declarado.
              </p>
            </>
          ),
        },
        {
          id: 'plazo-respuesta',
          title: 'Plazo de respuesta',
          content: (
            <>
              <p>
                De acuerdo al Codigo de Proteccion y Defensa del Consumidor, la Empresa atendera los reclamos
               presentados en un plazo no mayor a quince (15) dias habiles contados desde su registro. El
                consumidor recibirá una respuesta escrita con el detalle de las acciones adoptadas.
              </p>
            </>
          ),
        },
        {
          id: 'instancias',
          title: 'Instancias adicionales',
          content: (
            <>
              <p>
                Si considera que su reclamo no ha sido solucionado de manera satisfactoria, puede acudir a las
                siguientes instancias:
              </p>
              <ul className="space-y-2.5 list-disc pl-5 marker:text-orange-500">
                <li><strong>Indecopi:</strong> Organismo de competencia y defensa del consumidor.</li>
                <li><strong>Direccion General de Defensa del Consumidor:</strong> del Ministerio de Economia y Finanzas.</li>
                <li><strong>Centros de conciliacion:</strong> de la Direccion de ASIC y Supervision de la Direccion General de Comercio.</li>
              </ul>
              <p>
                El presente registro en el Libro de Reclamaciones no limita su derecho a acudir a las
                instancias administrativas o judiciales competentes.
              </p>
            </>
          ),
        },
      ]}
    />
  );
};

export default LibroReclamaciones;
