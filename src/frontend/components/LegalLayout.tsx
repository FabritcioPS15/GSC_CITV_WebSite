import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Lock } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import Seo from './Seo';
import { schemaBreadcrumbs } from '../seo/schemas';

interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalLayoutProps {
  /** Ruta interna, para la canonical. Ejemplo: `/privacidad`. */
  path: string;
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  icon: ReactNode;
  sections: LegalSection[];
  tocTitle?: string;
}

const LegalLayout = ({
  path,
  eyebrow,
  title,
  lastUpdated,
  intro,
  icon,
  sections,
  tocTitle = 'Contenido',
}: LegalLayoutProps) => {
  return (
    <>
      <Seo
        path={path}
        title={`${title} | Grupo San Cristóbal`}
        description={intro}
        schema={schemaBreadcrumbs([
          { name: 'Inicio', path: '/' },
          { name: title, path },
        ])}
      />

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 pt-14 pb-12">
          <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-6">
            <Link to="/" className="hover:text-orange-600 transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600">{title}</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="shrink-0 w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-600">
              {icon}
            </div>
            <div>
              <p className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-2">{eyebrow}</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{title}</h1>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mt-6 max-w-3xl">{intro}</p>

          <div className="flex flex-wrap items-center gap-4 mt-7 text-xs font-semibold text-gray-500">
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5">
              <Lock size={12} className="text-orange-500" />
              Última actualización: {lastUpdated}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5">
              <ShieldCheck size={12} className="text-orange-500" />
              Ley N.° 29733 — Ley de Protección de Datos Personales
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-[200px_1fr] gap-10">
          <nav aria-label={tocTitle} className="md:sticky md:top-28 md:self-start">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">{tocTitle}</h2>
            <ol className="space-y-2 border-l border-gray-200 pl-4">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-[13px] text-gray-500 hover:text-orange-600 font-medium transition-colors block leading-snug"
                  >
                    <span className="text-gray-300 font-bold mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <RevealOnScroll key={section.id}>
                <article id={section.id} className="scroll-mt-28">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-orange-500 font-black text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="text-xl font-black text-gray-900">{section.title}</h2>
                  </div>
                  <div className="text-[15px] text-gray-600 leading-relaxed space-y-3.5">
                    {section.content}
                  </div>
                </article>
              </RevealOnScroll>
            ))}

            <RevealOnScroll>
              <div className="border-2 border-orange-500/30 bg-orange-50/50 p-6">
                <h2 className="text-base font-black text-gray-900 mb-2">¿Tienes dudas sobre este documento?</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Escríbenos y te orientamos. También puedes ejercer tus derechos ARCO según se explica en la
                  Política de Privacidad.
                </p>
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-sm font-bold hover:bg-orange-600 transition-colors"
                >
                  Contactar
                  <ChevronRight size={14} />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
};

export default LegalLayout;
