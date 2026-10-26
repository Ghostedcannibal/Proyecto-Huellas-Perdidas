import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { PetSearchEngine } from './PetSearchEngine';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  onNavigateToScreen: (screen: ActiveScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToScreen }) => {
  const { publications, registeredShelters, dbUsers } = useAuth();

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactReason, setContactReason] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [legalHabeas, setLegalHabeas] = useState(false);
  const [showContactSuccess, setShowContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalHabeas) return;
    setShowContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactReason('');
    setContactMsg('');
    setLegalHabeas(false);
  };

  return (
    <div className="w-full bg-[#1a0d26] text-[#f0dbfe] font-sans antialiased min-h-screen selection:bg-[#ff479d] selection:text-[#58002f]">
      {/* Top Ambient Glow Field */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#ff479d]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-24 right-10 w-[380px] h-[280px] bg-[#9b7fed]/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* 1. HERO SECTION */}
        <section className="relative w-full max-w-[1360px] mx-auto px-6 pt-8 pb-12">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#32243e] text-[#f0dbfe] shadow-md border border-[#3d2f4a]/50">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff479d] animate-ping"></span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#ffb0cb]">
                Red de Alerta Comunitaria Activa en Colombia
              </span>
              <span className="text-[#cebdff] text-[11px] font-semibold pl-2 border-l border-[#3d2f4a]">
                24/7 Monitoreo
              </span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#f0dbfe] tracking-tight leading-tight">
              Cada segundo cuenta:{' '}
              <span className="italic text-[#ffb0cb] font-serif">Reencuentros guiados</span> por
              comunidad y tecnología
            </h1>

            {/* Compassionate Subtitle */}
            <p className="text-base sm:text-lg text-[#e3bdc8] max-w-3xl leading-relaxed">
              Red solidaria nacional con biometría ética y geolocalización precisa para devolver a
              tu peludito a casa, libre de intermediarios fraudulentos y bajo estricta protección
              anti-extorsión.
            </p>

            {/* Dual Emergency CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigateToScreen('report')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-sm font-bold bg-[#ff479d] text-white px-8 py-3.5 rounded-full shadow-[0_4px_24px_rgba(255,71,157,0.45)] hover:bg-[#cd0098] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">emergency</span>
                <span>Reportar Mascota Perdida (Se Busca)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToScreen('report')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-sm font-bold bg-[#32243e] text-[#f0dbfe] hover:text-white px-8 py-3.5 rounded-full shadow-[0_0_16px_rgba(206,189,255,0.2)] hover:bg-[#42334e] transition-all border border-[#3d2f4a] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px] text-[#cebdff]">
                  volunteer_activism
                </span>
                <span>Reportar Mascota Encontrada (En Custodia)</span>
              </button>
            </div>

            {/* Live Metrics Ribbon */}
            <div className="w-full pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-4 rounded-2xl bg-[#23162f]/90 backdrop-blur-md shadow-xl border border-[#3d2f4a]/60">
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <div className="text-2xl sm:text-3xl text-[#ffb0cb] font-bold font-mono">
                    {publications.length}
                  </div>
                  <div className="text-xs text-[#e3bdc8] font-medium mt-0.5">
                    Avisos en Base de Datos
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <div className="text-2xl sm:text-3xl text-[#cebdff] font-bold font-mono">
                    {registeredShelters.length}
                  </div>
                  <div className="text-xs text-[#e3bdc8] font-medium mt-0.5">
                    Refugios Registrados
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <div className="text-2xl sm:text-3xl text-[#ffaed9] font-bold font-mono">
                    {dbUsers.length}
                  </div>
                  <div className="text-xs text-[#e3bdc8] font-medium mt-0.5">
                    Usuarios en Comunidad
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <div className="text-2xl sm:text-3xl text-[#f0dbfe] font-bold">
                    Nacional
                  </div>
                  <div className="text-[11px] text-[#e3bdc8] font-medium mt-0.5">
                    Red Activa en Colombia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2. SEARCH & SMART FILTERS SECTION WITH CRITERIA FROM NOTICE PUBLISH */}
      <section className="w-full max-w-[1360px] mx-auto px-6 py-6">
        <PetSearchEngine onNavigateToScreen={onNavigateToScreen} />
      </section>

      {/* 3. SECTION: ¿CÓMO FUNCIONA HUELLAS PERDIDAS? */}
      <section className="w-full bg-[#150821] py-14 border-y border-[#3d2f4a]">
        <div className="w-full max-w-[1360px] mx-auto px-6">
          <div className="max-w-3xl mb-10">
            <span className="text-[11px] font-bold text-[#cebdff] uppercase tracking-widest">
              Protocolo de Alta Seguridad Comunitaria
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#f0dbfe] font-semibold mt-1">
              ¿Cómo funciona Huellas Perdidas en Colombia?
            </h2>
            <p className="text-xs sm:text-sm text-[#e3bdc8] mt-2 leading-relaxed">
              Diseñamos una ruta segura que neutraliza llamadas extorsivas, acelera la identificación
              mediante visión computacional y coordina entregas protegidas en clínicas veterinarias
              aliadas.
            </p>
          </div>

          {/* 4 Steps Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#23162f] relative flex flex-col justify-between space-y-4 shadow-md hover:bg-[#271a33] transition-colors border border-[#3d2f4a]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-full bg-[#ff479d]/20 flex items-center justify-center text-[#ff479d] font-bold text-base font-mono">
                    01
                  </span>
                  <span className="material-symbols-outlined text-[28px] text-[#ffb0cb]">
                    add_location_alt
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#f0dbfe] mt-4">
                  Reporte Inmediato Geo-referenciado
                </h3>
                <p className="text-xs text-[#e3bdc8] mt-2 leading-relaxed">
                  Cargas fotos nítidas y la ubicación de última vista. El sistema activa un perímetro
                  virtual de alerta entre vecinos y brigadas a menos de 5 km.
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#ffaed9] uppercase tracking-wider pt-2 border-t border-[#3d2f4a]/60">
                Paso 1: Activación Inmediata
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#23162f] relative flex flex-col justify-between space-y-4 shadow-md hover:bg-[#271a33] transition-colors border border-[#3d2f4a]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-full bg-[#9b7fed]/30 flex items-center justify-center text-[#cebdff] font-bold text-base font-mono">
                    02
                  </span>
                  <span className="material-symbols-outlined text-[28px] text-[#cebdff]">
                    drafts
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#f0dbfe] mt-4">
                  Análisis Biométrico y Algorítmico
                </h3>
                <p className="text-xs text-[#e3bdc8] mt-2 leading-relaxed">
                  Comparamos manchas del pelaje, huella trufa y morfología con avisos de perros y
                  gatos en custodia en refugios oficiales de tu ciudad.
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#cebdff] uppercase tracking-wider pt-2 border-t border-[#3d2f4a]/60">
                Paso 2: Cruce de Coincidencias
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#23162f] relative flex flex-col justify-between space-y-4 shadow-md hover:bg-[#271a33] transition-colors border border-[#3d2f4a]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-full bg-[#32243e] flex items-center justify-center text-[#ffaed9] font-bold text-base font-mono">
                    03
                  </span>
                  <span className="material-symbols-outlined text-[28px] text-[#ffaed9]">
                    security
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#f0dbfe] mt-4">
                  Comunicación Anti-extorsión
                </h3>
                <p className="text-xs text-[#e3bdc8] mt-2 leading-relaxed">
                  El chat se mantiene enmascarado y cifrado. Nadie accede a tu número privado ni
                  cuentas bancarias hasta validar pruebas fotográficas en tiempo real.
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#ffaed9] uppercase tracking-wider pt-2 border-t border-[#3d2f4a]/60">
                Paso 3: Escudo Criptográfico
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#23162f] relative flex flex-col justify-between space-y-4 shadow-md hover:bg-[#271a33] transition-colors border border-[#3d2f4a]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-full bg-[#32243e] flex items-center justify-center text-[#ffb0cb] font-bold text-base font-mono">
                    04
                  </span>
                  <span className="material-symbols-outlined text-[28px] text-[#ffb0cb]">
                    handshake
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#f0dbfe] mt-4">
                  Reencuentro en Punto Neutro
                </h3>
                <p className="text-xs text-[#e3bdc8] mt-2 leading-relaxed">
                  La entrega se realiza en una clínica veterinaria aliada con verificación de chip o
                  cartilla de vacunación, sellando el reencuentro con plena seguridad.
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#ffb0cb] uppercase tracking-wider pt-2 border-t border-[#3d2f4a]/60">
                Paso 4: Vuelta Segura a Casa
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MAP INTERACTIVE BANNER */}
      <section className="w-full max-w-[1360px] mx-auto px-6 py-12">
        <div className="relative rounded-3xl overflow-hidden bg-[#271a33] shadow-2xl p-6 lg:p-10 border border-[#3d2f4a]">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#150821] via-[#150821]/80 to-transparent z-10 pointer-events-none"></div>

          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text & Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff479d]/20 text-[#ffb0cb] text-[11px] font-bold uppercase tracking-wider border border-[#ff479d]/40">
                <span className="material-symbols-outlined text-[16px]">radar</span>
                <span>Geomapeo Satelital de Coincidencias</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#f0dbfe] font-semibold leading-tight">
                Visualiza alertas y perímetros de búsqueda en tiempo real
              </h2>

              <p className="text-xs sm:text-sm text-[#e3bdc8] leading-relaxed">
                Explora el mapa de calor con densidad de avisos en Bogotá, Medellín, Cali,
                Barranquilla y Bucaramanga. Detecta patrones de avistamiento y zonas seguras con apoyo
                de veterinarias de guardia.
              </p>

              {/* Quadrant selector tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-xs font-semibold border border-[#3d2f4a]">
                  📍 Bogotá Norte (42 alertas)
                </span>
                <span className="px-3 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-xs font-semibold border border-[#3d2f4a]">
                  📍 Medellín Sur (28 alertas)
                </span>
                <span className="px-3 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-xs font-semibold border border-[#3d2f4a]">
                  📍 Cali Occidente (19 alertas)
                </span>
              </div>

              {/* CTA Map Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateToScreen('match')}
                  className="inline-flex items-center gap-2 text-xs font-bold bg-[#cd0098] text-white px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(205,0,152,0.4)] hover:bg-[#ff479d] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">map</span>
                  <span>Explorar Mapa Satelital de Coincidencias</span>
                </button>
              </div>
            </div>

            {/* Simulated Interactive Map Component */}
            <div className="lg:col-span-6">
              <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl bg-[#23162f] border border-[#3d2f4a]">
                <div
                  className="w-full h-full bg-cover bg-center opacity-85"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC45kuVxeAglfN4Clm9VkV5F85XDGylG8ji1GPGnajlMU32cXivaZVmfJZFMo4CF9R3KFGYqX_0-ZEOrjwk-XlfWPF2dUDDLU9Qp1mbt1nSluJprV_fQUwxIwtMzMGCtf0V_CevwZhjeL00cA7Nqrrx1wuGE0BoPge9PhZzKystYlAYuWuniGUbl400MGqtjvJvlClD0Wr_VWmlreHuI143UrSxxxGa253PsZbXg3hoo9wmZslY8lRG6w')`,
                  }}
                ></div>

                {/* Map Overlay Heatmap Emulation */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a0d26]/70 via-transparent to-[#ff479d]/20 pointer-events-none"></div>

                {/* Floating Geo Pins */}
                <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 p-2.5 rounded-xl bg-[#150821]/90 backdrop-blur-md shadow-lg border border-[#ff479d]/50 pointer-events-auto">
                  <span className="w-3 h-3 rounded-full bg-[#ffb0cb] animate-ping"></span>
                  <span className="text-xs text-[#f0dbfe] font-bold">Avistamiento: 'Max'</span>
                </div>

                <div className="absolute bottom-1/3 right-1/4 flex items-center gap-2 p-2.5 rounded-xl bg-[#150821]/90 backdrop-blur-md shadow-lg border border-[#3d2f4a] pointer-events-auto">
                  <span className="material-symbols-outlined text-[16px] text-[#cebdff]">
                    local_hospital
                  </span>
                  <span className="text-xs text-[#f0dbfe]">Punto Neutro: Cl. 127</span>
                </div>

                {/* Bottom Map Bar */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#150821]/95 backdrop-blur-md flex items-center justify-between px-4 border border-[#3d2f4a]">
                  <span className="text-xs text-[#e3bdc8] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> GPS Nodos Vivos:
                    58 cuadrantes sincronizados
                  </span>
                  <span className="text-[10px] font-bold text-[#cebdff] uppercase tracking-wider">
                    Satélite Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DIRECT CONTACT & HUMANITARIAN SUPPORT 24/7 */}
      <section className="w-full max-w-[1360px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context, WhatsApp & Emergency Directory */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#ffaed9] uppercase tracking-widest">
                Asistencia Humanitaria Continua
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#f0dbfe] font-semibold mt-1">
                Contacto Directo y Soporte 24/7
              </h2>
              <p className="text-xs sm:text-sm text-[#e3bdc8] mt-2 leading-relaxed">
                Si recibiste una llamada sospechosa pidiéndote dinero sin mostrar a tu mascota, o
                necesitas coordinar una custodia de emergencia, comunícate inmediatamente con
                nuestros canales encriptados.
              </p>
            </div>

            {/* WhatsApp Emergency Action Card */}
            <div className="p-6 rounded-2xl bg-[#23162f] shadow-lg space-y-3 border border-[#3d2f4a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">chat</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#f0dbfe]">Línea de Resguardo WhatsApp</div>
                  <div className="text-xs text-[#e3bdc8]">
                    Atención prioritaria para casos de extravío en curso
                  </div>
                </div>
              </div>
              <a
                href="https://wa.me/573000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold bg-[#32243e] text-[#f0dbfe] hover:text-[#ffb0cb] py-2.5 rounded-full transition-colors border border-[#3d2f4a]"
              >
                <span>Iniciar Chat Seguro de Emergencia</span>
                <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
              </a>
            </div>

            {/* Veterinary Directory Snapshot Card */}
            <div className="p-6 rounded-2xl bg-[#23162f] shadow-lg space-y-3 border border-[#3d2f4a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#32243e] text-[#cebdff] flex items-center justify-center shrink-0 border border-[#3d2f4a]">
                  <span className="material-symbols-outlined text-[24px]">medical_services</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#f0dbfe]">
                    Directorio de Clínicas de Guardia
                  </div>
                  <div className="text-xs text-[#e3bdc8]">
                    148 centros con lector de microchip internacional
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#e3bdc8] leading-relaxed">
                Puntos certificados para entrega protegida y verificación veterinaria sin costo para
                mascotas en custodia comunitaria.
              </p>
              <div className="pt-2 flex items-center justify-between text-[#cebdff] text-xs font-semibold">
                <span>Monitoreo 365 días al año</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Function Clean Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#271a33] shadow-2xl space-y-4 border border-[#3d2f4a]">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#f0dbfe]">
                  Envía un Mensaje a la Mesa de Ayuda
                </h3>
                <p className="text-xs text-[#e3bdc8]">
                  Un voluntario o coordinador de zona responderá en un plazo promedio de 12 minutos.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-bold text-[#e3bdc8] uppercase tracking-wider">
                      Nombre y Apellidos *
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ej: Carolina Morales"
                      required
                      className="w-full px-4 py-2 rounded-xl bg-[#150821] text-[#f0dbfe] placeholder:text-[#e3bdc8]/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#ffb0cb] border border-[#3d2f4a] shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-bold text-[#e3bdc8] uppercase tracking-wider">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="tuemail@ejemplo.com"
                      required
                      className="w-full px-4 py-2 rounded-xl bg-[#150821] text-[#f0dbfe] placeholder:text-[#e3bdc8]/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#ffb0cb] border border-[#3d2f4a] shadow-inner"
                    />
                  </div>
                </div>

                {/* Subject Reason Selector */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-bold text-[#e3bdc8] uppercase tracking-wider">
                    Motivo de Consulta *
                  </label>
                  <div className="relative">
                    <select
                      value={contactReason}
                      onChange={(e) => setContactReason(e.target.value)}
                      required
                      className="w-full appearance-none px-4 py-2 rounded-xl bg-[#150821] text-[#f0dbfe] text-xs focus:outline-none focus:ring-2 focus:ring-[#ffb0cb] cursor-pointer pr-8 border border-[#3d2f4a] shadow-inner"
                    >
                      <option value="" disabled>
                        Selecciona el motivo prioritario...
                      </option>
                      <option value="soporte-reporte">
                        Soporte en Reporte Activo (Actualización de fotos o zona)
                      </option>
                      <option value="alerta-fraude">
                        Denuncia de Intento de Fraude o Extorsión Telefónica
                      </option>
                      <option value="postulacion-aliado">
                        Postulación de Albergue, Refugio o Veterinaria Aliada
                      </option>
                      <option value="voluntariado">
                        Voluntariado en Brigada de Búsqueda Terrestre
                      </option>
                      <option value="otro">Otra inquietud comunitaria</option>
                    </select>
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#e3bdc8]">
                      <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </span>
                  </div>
                </div>

                {/* Message Area */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-bold text-[#e3bdc8] uppercase tracking-wider">
                    Descripción o Detalles del Caso *
                  </label>
                  <textarea
                    rows={4}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Indica el código de aviso si lo tienes (ej: #HP-8942), la ciudad, sector o la situación anómala presentada..."
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#150821] text-[#f0dbfe] placeholder:text-[#e3bdc8]/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#ffb0cb] border border-[#3d2f4a] shadow-inner"
                  ></textarea>
                </div>

                {/* Legal Privacy Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="legalHabeas"
                    checked={legalHabeas}
                    onChange={(e) => setLegalHabeas(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 rounded bg-[#150821] text-[#ff479d] focus:ring-[#ffb0cb] cursor-pointer"
                  />
                  <label htmlFor="legalHabeas" className="text-xs text-[#e3bdc8] cursor-pointer">
                    Acepto el tratamiento de datos personales conforme a la{' '}
                    <strong className="text-white">Ley 1581 de Habeas Data</strong> de Colombia y el
                    protocolo de enmascaramiento seguro de identidad.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold bg-[#ff479d] text-white py-3 rounded-full shadow-[0_4px_24px_rgba(255,71,157,0.45)] hover:bg-[#cd0098] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    <span>Enviar Mensaje con Encriptación Segura</span>
                  </button>
                </div>

                {/* Success Feedback Banner */}
                {showContactSuccess && (
                  <div className="p-4 rounded-xl bg-[#32243e] text-[#ffb0cb] flex items-center gap-3 shadow-inner border border-[#ff479d]/40 animate-fadeIn">
                    <span className="material-symbols-outlined text-[24px] text-emerald-400">
                      verified
                    </span>
                    <div className="text-xs">
                      <strong>Solicitud cifrada recibida con éxito.</strong> Tu caso ha sido
                      asignado a la brigada de monitoreo con prioridad inmediata.
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THREE SECURITY PILLARS */}
      <section className="w-full bg-[#150821] py-12 border-t border-[#3d2f4a]">
        <div className="w-full max-w-[1360px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#23162f] flex items-start gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-[#3d2f4a]">
              <div className="w-10 h-10 rounded-full bg-[#32243e] flex items-center justify-center text-[#ffaed9] shrink-0 border border-[#3d2f4a]">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div>
                <div className="text-sm font-bold text-[#f0dbfe]">Cifrado E2E</div>
                <div className="text-xs text-[#e3bdc8] mt-1 leading-relaxed">
                  Reportes anónimos y datos de contacto protegidos con cifrado de extremo a extremo.
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#23162f] flex items-start gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-[#3d2f4a]">
              <div className="w-10 h-10 rounded-full bg-[#32243e] flex items-center justify-center text-[#ffb0cb] shrink-0 border border-[#3d2f4a]">
                <span className="material-symbols-outlined">hub</span>
              </div>
              <div>
                <div className="text-sm font-bold text-[#f0dbfe]">Red Comunitaria Colombia</div>
                <div className="text-xs text-[#e3bdc8] mt-1 leading-relaxed">
                  Interconexión activa entre rescatistas, albergues y brigadas vecinales en todo el
                  país.
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#23162f] flex items-start gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-[#3d2f4a]">
              <div className="w-10 h-10 rounded-full bg-[#32243e] flex items-center justify-center text-[#cebdff] shrink-0 border border-[#3d2f4a]">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <div className="text-sm font-bold text-[#f0dbfe]">Protocolo Anti-extorsión</div>
                <div className="text-xs text-[#e3bdc8] mt-1 leading-relaxed">
                  Validación criptográfica de avistamientos y alertas automáticas contra fraudes y
                  chantaje.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
