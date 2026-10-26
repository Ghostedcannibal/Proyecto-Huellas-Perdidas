import React from 'react';
import { ActiveScreen } from '../types';
import { ASSETS } from '../data/mockData';
import { 
  Palette, 
  ScanFace, 
  Megaphone, 
  MessageSquareLock, 
  HeartHandshake, 
  PawPrint, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Eye, 
  ArrowRight,
  Droplets,
  Type
} from 'lucide-react';

interface BrandBoardScreenProps {
  onNavigateToScreen: (screen: ActiveScreen) => void;
}

export const BrandBoardScreen: React.FC<BrandBoardScreenProps> = ({ onNavigateToScreen }) => {
  const colors = [
    {
      name: 'Amatista Profundo',
      hex: '#3B1C56',
      percent: '40%',
      role: 'Fondos principales, autoridad, solemnidad y atmósfera protectora.',
      bgClass: 'bg-[#3B1C56]',
      textClass: 'text-white',
    },
    {
      name: 'Fucsia Llamativo',
      hex: '#FF1694',
      percent: '25%',
      role: 'Alertas críticas de extravío, botones de acción inmediata (CTA).',
      bgClass: 'bg-[#FF1694]',
      textClass: 'text-white',
    },
    {
      name: 'Magenta Vibrante',
      hex: '#D30D9D',
      percent: '20%',
      role: 'Gradientes de calidez, acentos interactivos y estados hover.',
      bgClass: 'bg-[#D30D9D]',
      textClass: 'text-white',
    },
    {
      name: 'Superficie Amatista & Luz',
      hex: '#271A33',
      percent: '15%',
      role: 'Tarjetas de información, bordes sutiles y textos de alto contraste.',
      bgClass: 'bg-[#271a33]',
      textClass: 'text-[#f0dbfe]',
    },
  ];

  const features: Array<{
    id: ActiveScreen;
    title: string;
    description: string;
    icon: React.ReactNode;
    tag: string;
  }> = [
    {
      id: 'match',
      title: 'Ficha de Coincidencia Biométrica',
      description: 'IA neuronal multimodal para cotejo fisonómico canino/felino con slider interactivo split.',
      icon: <ScanFace className="w-5 h-5 text-[#FF1694]" />,
      tag: '98.4% Match IA',
    },
    {
      id: 'report',
      title: 'Publicación de Avisos Geo-referenciados',
      description: 'Wizard de 3 pasos con auto-escaneo facial y vista previa reactiva en tiempo real.',
      icon: <Megaphone className="w-5 h-5 text-[#ffaed9]" />,
      tag: 'Radio 5 km',
    },
    {
      id: 'chat',
      title: 'Chat Cifrado Antiextorsión',
      description: 'Canal E2E con purga automática de metadatos EXIF y propuesta de puntos de encuentro seguros.',
      icon: <MessageSquareLock className="w-5 h-5 text-emerald-400" />,
      tag: 'AES-256 E2E',
    },
    {
      id: 'donations',
      title: 'Donaciones Auditadas & Cuentas Claras',
      description: 'Fondo blindado sin comisiones ocultas, trazabilidad directa a facturas clínicas DIAN.',
      icon: <HeartHandshake className="w-5 h-5 text-[#cebdff]" />,
      tag: '0% Comisiones',
    },
    {
      id: 'adoption',
      title: 'Módulo Activo de Adopción',
      description: 'Segunda oportunidad para peluditos resguardados en refugios con postulación digital.',
      icon: <PawPrint className="w-5 h-5 text-[#ffaed9]" />,
      tag: 'Adopción Ética',
    },
    {
      id: 'auth',
      title: 'Portal de Identidad Protegida',
      description: 'Validación anti-fraude de documentos, contraseñas militares y doble factor 2FA.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      tag: 'Zero-Fraud',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Brand Header Banner */}
      <div className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF1694]/20 via-[#D30D9D]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#FF1694] shadow-xl bg-[#3B1C56]">
                <img
                  src={ASSETS.logo}
                  alt="Isotipo Huellas Perdidas"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#FF1694] text-white">
                    MOODBOARD SPEC • EL VELO AMATISTA
                  </span>
                  <span className="text-xs font-mono text-[#ffaed9]">v4.2 UI Design</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
                  HUELLAS <span className="text-[#FF1694]">PERDIDAS</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#150821] text-[#ffaed9] border border-[#3d2f4a]">
                IA Biométrica
              </span>
              <span className="px-3 py-1 rounded-full bg-[#150821] text-emerald-300 border border-[#3d2f4a]">
                Antiextorsión
              </span>
              <span className="px-3 py-1 rounded-full bg-[#150821] text-[#cebdff] border border-[#3d2f4a]">
                Donaciones Auditadas
              </span>
              <span className="px-3 py-1 rounded-full bg-[#150821] text-white border border-[#3d2f4a]">
                Segunda Oportunidad
              </span>
            </div>
          </div>

          <div className="border-t border-[#3d2f4a] pt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white max-w-2xl font-display italic">
              "El refugio digital donde cada peludito encuentra su camino a casa con la certeza de la tecnología y el calor de la comunidad."
            </h2>
          </div>

          {/* 3 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-2">
              <span className="text-xs font-black text-[#FF1694] font-mono">PILAR 01</span>
              <h3 className="font-bold text-white text-sm">IA Visual de Coincidencias</h3>
              <p className="text-xs text-[#e3bdc8]">
                Algoritmos especializados de visión por computador que analizan proporciones craneales, trufa y patrones de manto.
              </p>
            </div>

            <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-2">
              <span className="text-xs font-black text-emerald-400 font-mono">PILAR 02</span>
              <h3 className="font-bold text-white text-sm">Chat Seguro & Donaciones Claras</h3>
              <p className="text-xs text-[#e3bdc8]">
                Canal cifrado blindado contra extorsiones y trazabilidad contable quirúrgica emitida directamente a clínicas.
              </p>
            </div>

            <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-2">
              <span className="text-xs font-black text-[#cebdff] font-mono">PILAR 03</span>
              <h3 className="font-bold text-white text-sm">Módulo Activo de Adopción</h3>
              <p className="text-xs text-[#e3bdc8]">
                Puente formal entre refugios certificados y familias responsables para transformar rescates en hogares definitivos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Color System "El Velo Amatista" */}
      <div className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#3d2f4a] pb-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#FF1694]" />
            <h3 className="font-bold text-white text-lg">
              Sistema Cromático: La Paleta del Velo Amatista
            </h3>
          </div>
          <span className="text-xs font-mono text-[#e3bdc8]">Harmonía WCAG AA Compliant</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {colors.map((c) => (
            <div
              key={c.name}
              className="bg-[#150821] rounded-2xl overflow-hidden border border-[#3d2f4a] p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className={`h-24 w-full rounded-xl ${c.bgClass} shadow-inner flex items-end p-2.5 justify-between border border-white/10`}>
                  <span className={`text-xs font-black font-mono ${c.textClass} bg-black/40 px-2 py-0.5 rounded`}>
                    {c.hex}
                  </span>
                  <span className={`text-xs font-bold ${c.textClass}`}>
                    {c.percent}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{c.name}</h4>
                  <p className="text-xs text-[#e3bdc8] mt-1 leading-relaxed">
                    {c.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Spec */}
      <div className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#3d2f4a] pb-4">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-[#cebdff]" />
            <h3 className="font-bold text-white text-lg">
              Dirección Tipográfica & Empatía Editorial
            </h3>
          </div>
          <span className="text-xs text-[#ffaed9]">Plus Jakarta Sans + Playfair Display</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#150821] p-5 rounded-2xl border border-[#3d2f4a] space-y-3">
            <span className="text-[11px] font-bold text-[#FF1694] uppercase tracking-wider">
              Fuente de Titulares & Énfasis Emocional
            </span>
            <p className="text-2xl font-serif text-white italic">
              Playfair Display (Serif Elegante)
            </p>
            <p className="text-xs text-[#e3bdc8]">
              Aporta calidez humana, empatía y solemnidad editorial en testimonios, rescates y citas de reencuentro.
            </p>
          </div>

          <div className="bg-[#150821] p-5 rounded-2xl border border-[#3d2f4a] space-y-3">
            <span className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider">
              Fuente de Interfaz, Datos & Legibilidad
            </span>
            <p className="text-2xl font-sans font-bold text-white">
              Plus Jakarta Sans (Sans Geométrica)
            </p>
            <p className="text-xs text-[#e3bdc8]">
              Claridad cristalina en pantallas de alta densidad, formularios de reporte, fichas biométricas y tablas contables.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Core Features Bento Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              Módulos y Pantallas de la Plataforma
            </h3>
            <p className="text-xs text-[#e3bdc8]">
              Haz clic en cualquier funcionalidad para interactuar directamente con la pantalla correspondiente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.id}
              onClick={() => onNavigateToScreen(f.id)}
              className="bg-[#271a33] hover:bg-[#32243e] border border-[#3d2f4a] hover:border-[#FF1694] rounded-2xl p-6 shadow-xl space-y-4 cursor-pointer transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#150821] border border-[#3d2f4a] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#150821] text-[#ffaed9] border border-[#FF1694]/30">
                    {f.tag}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-base group-hover:text-[#ffaed9] transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-xs text-[#e3bdc8] mt-1 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#3d2f4a] flex items-center justify-between text-xs font-bold text-[#FF1694] group-hover:text-white transition-colors">
                <span>Abrir Pantalla</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
