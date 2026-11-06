import React from 'react';
import { EVENT_DETAILS } from '../data/initialData';
import { Clock, MapPin, ShieldAlert, Award, Music, HelpCircle, CheckCircle2 } from 'lucide-react';

export const EventInfoSection: React.FC = () => {
  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
      {/* Venue & Lineup Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/PEQUENO_87357065.png"
              alt="Complexo Escolar Privado Proglory Logo"
              className="w-10 h-10 object-contain bg-white rounded p-0.5 border border-amber-400/40"
            />
            <img
              src="/assets/aistudio/LOGOTSHERT_010ed54a.png"
              alt="Associação dos Estudantes Logo"
              className="w-10 h-10 object-contain bg-white rounded p-0.5 border border-amber-400/40"
            />
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Tradição & Apadrinhamento Académico
              </div>
              <div className="text-xs text-slate-400">
                Associação dos Estudantes (AEP-2 Da Graça)
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Programa Oficial · 20 de Novembro às 12h
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            O Batismo dos Caloiros do <strong>Complexo Escolar Privado Proglory</strong> é o momento alto da integração dos novos estudantes. A cerimónia solene tem início pontual às 12h00 com a comissão da <strong>Associação dos Estudantes (AEP-2)</strong>, seguida de almoço, cortejo das turmas e animação cultural.
          </p>

          {/* Schedule Timeline */}
          <div className="space-y-3 pt-2">
            {EVENT_DETAILS.lineup.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800"
              >
                <div className="font-mono-nums font-bold text-amber-400 text-sm shrink-0 w-14">
                  {item.time}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{item.act}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Stage Image & Details */}
        <div className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img
              src="/src/assets/images/academic_venue_stage_1793942326805.jpg"
              alt="Instalações e recinto da festa no Complexo Escolar Privado Proglory"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pátio Principal & Salão Multiusos · Polo II Da Graça</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Portaria equipada com torniquete ótico e validação digital. Entrada prioritária para portadores de bilhete com QR Code.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules and Tradition Discipline */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 sm:p-8">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Regulamento & Recomendações da AEP-2</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Diretrizes para o Acesso e Portaria
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EVENT_DETAILS.rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
