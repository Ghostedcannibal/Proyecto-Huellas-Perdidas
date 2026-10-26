import React, { useState } from 'react';
import { PetReport, BiometricMatchData } from '../types';
import { ASSETS } from '../data/mockData';
import { 
  ScanFace, 
  MapPin, 
  Share2, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  MessageSquareLock, 
  SlidersHorizontal, 
  ExternalLink, 
  AlertTriangle,
  Lock,
  ArrowRight,
  X,
  Compass
} from 'lucide-react';

interface BiometricMatchScreenProps {
  report: PetReport;
  matchData: BiometricMatchData;
  onNavigateToChat: () => void;
}

export const BiometricMatchScreen: React.FC<BiometricMatchScreenProps> = ({
  report,
  matchData,
  onNavigateToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'facial' | 'fur' | 'features'>('facial');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Alert & Identity Header */}
      <div className="bg-[#271a33] border border-[#3d2f4a] rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#FF1694]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF1694] text-white flex items-center gap-1 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5" /> SE BUSCA • EXTRAVIADO
              </span>
              <span className="text-xs font-mono font-bold text-[#cebdff] bg-[#3B1C56] px-2.5 py-1 rounded-full border border-[#D30D9D]/30">
                ID REPORTE: {report.id}
              </span>
              <span className="text-xs text-[#e3bdc8] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Alerta Comunitaria Activa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Ficha de Coincidencia Biométrica por IA
              <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Cotejo Confirmado 98.4%
              </span>
            </h1>
            <p className="text-sm text-[#e3bdc8] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF1694]" />
              <span>Extraviado en: <strong className="text-white">{report.location}</strong></span>
              <span className="text-[#3d2f4a]">•</span>
              <span>Fecha: <strong className="text-white">{report.lostDate}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#32243e] hover:bg-[#3d2f4a] text-white text-xs font-semibold border border-[#3d2f4a] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#ffaed9]" />
              <span>Difundir Alerta</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-[#32243e] hover:bg-[#3d2f4a] text-white text-xs font-semibold border border-[#3d2f4a] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#cebdff]" />
              <span>Ficha PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Comparative View: 2 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Mascota Buscada (Reporte Oficial) */}
        <div className="bg-[#271a33] border border-[#3d2f4a] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="p-5 border-b border-[#3d2f4a] bg-[#23162f]/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <h2 className="font-bold text-white text-base">
                Mascota Buscada (Reporte Oficial)
              </h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
              Tutor: {report.ownerName}
            </span>
          </div>

          {/* Photo with Interactive Pinned Points */}
          <div className="relative aspect-4/3 bg-black overflow-hidden group">
            <img
              src={report.imageUrl}
              alt={report.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d26]/80 via-transparent to-transparent" />

            {/* Interactive Pin 1: Cicatriz */}
            <button
              onClick={() => setSelectedPin(selectedPin === 'pin1' ? null : 'pin1')}
              className="absolute top-[28%] left-[34%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
            >
              <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1694] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-[#FF1694] text-white text-[11px] font-bold items-center justify-center shadow-lg border border-white">
                  1
                </span>
              </span>
              <div className="absolute left-7 top-0 bg-[#150821] text-white text-xs px-2.5 py-1 rounded-md border border-[#FF1694] shadow-xl whitespace-nowrap z-20">
                <span className="font-bold text-[#ffaed9]">Cicatriz Oreja Izq.</span>
              </div>
            </button>

            {/* Interactive Pin 2: Collar */}
            <button
              onClick={() => setSelectedPin(selectedPin === 'pin2' ? null : 'pin2')}
              className="absolute bottom-[26%] left-[48%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
            >
              <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-400 text-black text-[11px] font-bold items-center justify-center shadow-lg border border-white">
                  2
                </span>
              </span>
              <div className="absolute left-7 bottom-0 bg-[#150821] text-white text-xs px-2.5 py-1 rounded-md border border-amber-400 shadow-xl whitespace-nowrap z-20">
                <span className="font-bold text-amber-300">Collar Rojo Grabado</span>
              </div>
            </button>

            {/* Bottom Tag */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="bg-[#150821]/80 backdrop-blur-md px-3 py-1 rounded-full font-mono">
                Foto original del dueño (Registrada)
              </span>
              <span className="bg-[#FF1694] text-white px-2.5 py-0.5 rounded-full font-bold">
                Recompensa: {report.reward}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#150821] p-2.5 rounded-xl border border-[#3d2f4a]">
                <p className="text-[11px] text-[#e3bdc8]">Nombre</p>
                <p className="text-sm font-bold text-white">{report.name}</p>
              </div>
              <div className="bg-[#150821] p-2.5 rounded-xl border border-[#3d2f4a]">
                <p className="text-[11px] text-[#e3bdc8]">Raza / Especie</p>
                <p className="text-sm font-bold text-white truncate">{report.breed}</p>
              </div>
              <div className="bg-[#150821] p-2.5 rounded-xl border border-[#3d2f4a]">
                <p className="text-[11px] text-[#e3bdc8]">Edad / Sexo</p>
                <p className="text-sm font-bold text-white">{report.age} • {report.sex}</p>
              </div>
              <div className="bg-[#150821] p-2.5 rounded-xl border border-[#3d2f4a]">
                <p className="text-[11px] text-[#e3bdc8]">Microchip</p>
                <p className="text-sm font-bold text-emerald-400 font-mono">...2394812</p>
              </div>
            </div>

            <div className="bg-[#150821] p-3 rounded-xl border border-[#3d2f4a] text-xs space-y-1">
              <p className="font-semibold text-[#ffaed9] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Señas Particulares Reportadas:
              </p>
              <ul className="list-disc list-inside text-[#e3bdc8] space-y-0.5 pl-1">
                {report.particularFeatures.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Mascota Avistada / Custodiada */}
        <div className="bg-[#271a33] border border-[#FF1694]/40 rounded-2xl overflow-hidden shadow-xl shadow-[#FF1694]/10 flex flex-col justify-between relative">
          <div className="p-5 border-b border-[#3d2f4a] bg-gradient-to-r from-[#3B1C56] to-[#271a33] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="font-bold text-white text-base">
                Mascota en Custodia (Rescate Reciente)
              </h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {matchData.rescuedDate}
            </span>
          </div>

          {/* Photo with AI Bounding Boxes */}
          <div className="relative aspect-4/3 bg-black overflow-hidden group">
            <img
              src={matchData.imageUrl}
              alt="Mascota en refugio"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d26]/80 via-transparent to-transparent" />

            {/* AI Bounding Box 1: Face */}
            <div 
              className="absolute border-2 border-emerald-400 rounded-lg bg-emerald-400/10 pointer-events-none transition-all duration-300"
              style={{
                top: `${matchData.facialBoxes[0].y}%`,
                left: `${matchData.facialBoxes[0].x}%`,
                width: `${matchData.facialBoxes[0].width}%`,
                height: `${matchData.facialBoxes[0].height}%`,
              }}
            >
              <div className="absolute -top-6 left-0 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> MATCH FACIAL 99.1%
              </div>
            </div>

            {/* AI Bounding Box 2: Collar */}
            <div 
              className="absolute border-2 border-amber-400 rounded-lg bg-amber-400/10 pointer-events-none"
              style={{
                top: `${matchData.facialBoxes[1].y}%`,
                left: `${matchData.facialBoxes[1].x}%`,
                width: `${matchData.facialBoxes[1].width}%`,
                height: `${matchData.facialBoxes[1].height}%`,
              }}
            >
              <div className="absolute -top-6 left-0 bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                COLLAR DETECTADO
              </div>
            </div>

            {/* Overlay Badges */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="bg-[#150821]/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-300 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> Custodia Protegida Activa
              </span>
              <span className="bg-[#3B1C56] text-white px-2.5 py-0.5 rounded-full border border-[#FF1694]/50 font-bold">
                Distancia: {matchData.proximityKm} km
              </span>
            </div>
          </div>

          {/* Custody Info Table */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#150821] p-2.5 rounded-xl border border-[#3d2f4a]">
                <p className="text-[11px] text-[#e3bdc8]">Entidad Custodia</p>
                <p className="text-sm font-bold text-white truncate">Refugio San Roque</p>
              </div>
              <div className="bg-[#150821] p-2.5 rounded-xl border border-[#3d2f4a]">
                <p className="text-[11px] text-[#e3bdc8]">Veterinario a Cargo</p>
                <p className="text-sm font-bold text-[#cebdff] truncate">{matchData.vetReporter}</p>
              </div>
              <div className="bg-[#150821] p-2.5 rounded-xl border border-[#3d2f4a] col-span-2 sm:col-span-1">
                <p className="text-[11px] text-[#e3bdc8]">Estado Físico</p>
                <p className="text-sm font-bold text-emerald-300">Sin lesiones / Sano</p>
              </div>
            </div>

            <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 text-xs flex items-start gap-2 text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Protocolo Antiextorsión Activo:</strong>
                El canino se encuentra resguardado en clínica aliada. La entrega sólo se coordinará por el canal oficial cifrado sin intermediarios de recompensa previa.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Confidence Gauge & In-Depth Verification Tabs */}
      <div className="bg-[#271a33] border border-[#3d2f4a] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#3d2f4a]">
          {/* Radial Gauge */}
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#150821]"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#FF1694]"
                  strokeWidth="10"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * matchData.confidenceScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white font-mono">
                  {matchData.confidenceScore}%
                </span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                  Alta Certeza
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ScanFace className="w-5 h-5 text-[#FF1694]" />
                Cálculo de Afinidad Biométrica Multimodal
              </h3>
              <p className="text-xs text-[#e3bdc8] max-w-md">
                Modelo de redes neuronales convolucionales especializado en fisonomía canina.
                Analiza proporciones craneales, pigmentación ocular y mapa de pelaje.
              </p>
            </div>
          </div>

          {/* Quick Comparative Breakdown Bars */}
          <div className="w-full md:w-80 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#e3bdc8]">Morfología Facial & Ojos</span>
                <span className="text-[#ffaed9] font-mono">{matchData.facialScore}%</span>
              </div>
              <div className="w-full h-2 bg-[#150821] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#D30D9D] to-[#FF1694] rounded-full transition-all duration-1000"
                  style={{ width: `${matchData.facialScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#e3bdc8]">Patrón y Tonalidad del Pelaje</span>
                <span className="text-[#cebdff] font-mono">{matchData.coatScore}%</span>
              </div>
              <div className="w-full h-2 bg-[#150821] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#3B1C56] to-[#cebdff] rounded-full transition-all duration-1000"
                  style={{ width: `${matchData.coatScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#e3bdc8]">Proximidad Geo-Temporal (1.2 km)</span>
                <span className="text-emerald-400 font-mono">96.5%</span>
              </div>
              <div className="w-full h-2 bg-[#150821] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: '96.5%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="space-y-4">
          <div className="mobile-chip-scroll flex items-center gap-2 border-b border-[#3d2f4a] pb-2">
            <button
              onClick={() => setActiveTab('facial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                activeTab === 'facial'
                  ? 'bg-[#FF1694] text-white shadow'
                  : 'text-[#e3bdc8] hover:bg-[#32243e]'
              }`}
            >
              Morfología Facial
            </button>
            <button
              onClick={() => setActiveTab('fur')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                activeTab === 'fur'
                  ? 'bg-[#FF1694] text-white shadow'
                  : 'text-[#e3bdc8] hover:bg-[#32243e]'
              }`}
            >
              Patrón de Pelaje
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                activeTab === 'features'
                  ? 'bg-[#FF1694] text-white shadow'
                  : 'text-[#e3bdc8] hover:bg-[#32243e]'
              }`}
            >
              Señas Particulares (Cicatriz y Collar)
            </button>
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'facial' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#150821] p-3.5 rounded-xl border border-[#3d2f4a] space-y-1">
                <span className="text-[#ffaed9] font-bold block">Distancia Inter-ocular:</span>
                <p className="text-[#e3bdc8]">Desviación angular menor al 0.4%, coincidente con cráneo braquicéfalo de Golden Retriever.</p>
              </div>
              <div className="bg-[#150821] p-3.5 rounded-xl border border-[#3d2f4a] space-y-1">
                <span className="text-[#ffaed9] font-bold block">Pigmentación de la Trufa:</span>
                <p className="text-[#e3bdc8]">Negro homogéneo con ligera despigmentación invernal (snow nose) reportada en ficha médica.</p>
              </div>
              <div className="bg-[#150821] p-3.5 rounded-xl border border-[#3d2f4a] space-y-1">
                <span className="text-[#ffaed9] font-bold block">Contorno Bucal & Sonrisa:</span>
                <p className="text-[#e3bdc8]">Comisura labial típica con 99.2% de correlación en vector de landmarks faciales.</p>
              </div>
            </div>
          )}

          {activeTab === 'fur' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#150821] p-3.5 rounded-xl border border-[#3d2f4a] space-y-1">
                <span className="text-[#cebdff] font-bold block">Manto y Coloración:</span>
                <p className="text-[#e3bdc8]">Dorado miel con subtonalidad crema en pecho y flecos de extremidades anteriores.</p>
              </div>
              <div className="bg-[#150821] p-3.5 rounded-xl border border-[#3d2f4a] space-y-1">
                <span className="text-[#cebdff] font-bold block">Textura del Pecho:</span>
                <p className="text-[#e3bdc8]">Ondulaciones suaves con remolino pectoral simétrico identificado por la red neuronal.</p>
              </div>
              <div className="bg-[#150821] p-3.5 rounded-xl border border-[#3d2f4a] space-y-1">
                <span className="text-[#cebdff] font-bold block">Densidad de Subpelo:</span>
                <p className="text-[#e3bdc8]">Capa doble resistente al agua típica de la raza, longitud media estimada en 6.4 cm.</p>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#150821] p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Cicatriz Oreja Izquierda (CONFIRMADA)
                </span>
                <p className="text-[#e3bdc8]">
                  La inspección física en el refugio corroboró una pequeña muesca de 1.1 cm en el borde inferior de la oreja izquierda, coincidiendo exactamente con el reporte original de Elena S.
                </p>
              </div>
              <div className="bg-[#150821] p-3.5 rounded-xl border border-amber-400/30 space-y-1">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Collar Rojo Grabado (CONFIRMADO)
                </span>
                <p className="text-[#e3bdc8]">
                  Porta collar de nylon rojo con desgaste leve y placa metálica circular. Por seguridad, el teléfono en la placa se validará durante el protocolo de chat cifrado.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-[#271a33] border border-[#3d2f4a] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF1694]/20 border border-[#FF1694] flex items-center justify-center text-[#FF1694]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">¿Cómo proceder con el reencuentro?</h4>
            <p className="text-xs text-[#e3bdc8]">
              Inicia comunicación cifrada con el refugio o utiliza las herramientas de validación visual.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#32243e] hover:bg-[#3d2f4a] text-white text-xs font-bold border border-[#3d2f4a] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#ffaed9]" />
            <span>Validar Fotografías en Detalle</span>
          </button>

          <button
            onClick={() => setShowMapModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#32243e] hover:bg-[#3d2f4a] text-white text-xs font-bold border border-[#3d2f4a] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#cebdff]" />
            <span>Ver en Mapa Interactivo</span>
          </button>

          <button
            onClick={onNavigateToChat}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D30D9D] to-[#FF1694] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#FF1694]/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquareLock className="w-4 h-4" />
            <span>Contactar Refugio por Chat Privado</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison Split Slider Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#271a33] border border-[#3d2f4a] rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#3d2f4a] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#FF1694]" />
                <h3 className="font-bold text-white text-lg">
                  Comparador Fotográfico Split-Slider
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg text-[#e3bdc8] hover:text-white hover:bg-[#32243e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#e3bdc8]">
              Desliza la barra central para cotejar la morfología del hocico, orejas y marcas entre la foto de búsqueda y la foto del rescate.
            </p>

            {/* Split Image Canvas */}
            <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden select-none border border-[#3d2f4a] bg-black">
              {/* Rescued Image (Background / Right) */}
              <img
                src={ASSETS.compareFound}
                alt="En Resguardo"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 right-3 bg-[#150821]/80 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-500/40 z-10">
                Resguardo (Refugio)
              </span>

              {/* Lost Image (Clipped / Left) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={ASSETS.compareLost}
                  alt="Original Dueño"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#150821]/80 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-400/40 z-10">
                  Original (Dueño)
                </span>
              </div>

              {/* Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(255,255,255,0.8)] z-20"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FF1694] border-2 border-white flex items-center justify-center text-white shadow-lg">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Range Slider for Touch & Keyboard Accessibility */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                aria-label="Posición de comparación split"
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#e3bdc8] pt-2">
              <span>← Desliza hacia la izquierda / derecha →</span>
              <button
                onClick={() => setSliderPosition(50)}
                className="text-[#ffaed9] underline hover:text-white cursor-pointer"
              >
                Centrar Comparación (50%)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#271a33] border border-[#3d2f4a] rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#3d2f4a] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#FF1694]" />
                <h3 className="font-bold text-white text-lg">
                  Corredor Geográfico del Avistamiento (1.2 km)
                </h3>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-1 rounded-lg text-[#e3bdc8] hover:text-white hover:bg-[#32243e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-[#3d2f4a]">
              <img
                src={ASSETS.mapSantiago}
                alt="Mapa Georreferenciado"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#1a0d26]/40" />

              {/* Point A: Perdida */}
              <div className="absolute top-[38%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="px-2 py-1 rounded bg-[#FF1694] text-white text-[10px] font-bold shadow-lg mb-1 whitespace-nowrap">
                  Punto de Pérdida (14:30)
                </div>
                <div className="w-5 h-5 rounded-full bg-[#FF1694] border-2 border-white animate-bounce flex items-center justify-center text-white text-[10px] font-bold">
                  A
                </div>
              </div>

              {/* Point B: Rescate */}
              <div className="absolute top-[52%] left-[64%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="px-2 py-1 rounded bg-emerald-500 text-black text-[10px] font-bold shadow-lg mb-1 whitespace-nowrap">
                  Resguardo Refugio (15:10)
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-400 border-2 border-white animate-pulse flex items-center justify-center text-black text-[10px] font-bold">
                  B
                </div>
              </div>

              {/* Dotted Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="30%"
                  y1="38%"
                  x2="64%"
                  y2="52%"
                  stroke="#FF1694"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
              </svg>

              {/* Radius Badge */}
              <div className="absolute bottom-3 left-3 bg-[#150821]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#3d2f4a] text-xs text-white">
                <span className="text-[#ffaed9] font-bold">Distancia estimada en línea recta:</span> 1.2 km • Tiempo caminata canina aprox: 18 min
              </div>
            </div>

            <div className="bg-[#150821] p-3 rounded-xl border border-[#3d2f4a] text-xs text-[#e3bdc8] flex items-center justify-between">
              <span>Coordenadas de rescate: <strong>4.6097° N, 74.0817° W</strong></span>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-[#FF1694] font-bold hover:underline"
              >
                Cerrar Mapa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#271a33] border border-[#3d2f4a] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#3d2f4a] pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#FF1694]" /> Difundir Alerta Comunitaria
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-[#e3bdc8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#e3bdc8]">
              Comparte el enlace oficial cifrado en grupos vecinales de WhatsApp, Telegram y redes sociales para acelerar la confirmación.
            </p>

            <div className="bg-[#150821] p-3 rounded-xl border border-[#3d2f4a] text-xs font-mono text-[#ffaed9] flex items-center justify-between">
              <span className="truncate">https://huellasperdidas.app/reporte/HP-8942</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://huellasperdidas.app/reporte/HP-8942');
                  alert('¡Enlace copiado al portapapeles!');
                  setShowShareModal(false);
                }}
                className="text-white bg-[#FF1694] px-2.5 py-1 rounded font-sans font-bold hover:opacity-90 ml-2"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
