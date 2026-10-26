import React, { useState } from 'react';
import { AdoptionPet } from '../types';
import { MOCK_ADOPTIONS } from '../data/mockData';
import { 
  PawPrint, 
  Heart, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Filter, 
  Home, 
  SlidersHorizontal,
  Send,
  Quote
} from 'lucide-react';

export const AdoptionScreen: React.FC = () => {
  const [pets, setPets] = useState<AdoptionPet[]>(MOCK_ADOPTIONS);

  // Filters: City, Shelter, Breed, Species
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [shelterFilter, setShelterFilter] = useState<string>('all');
  const [breedFilter, setBreedFilter] = useState<string>('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'perro' | 'gato'>('all');

  // Modal application state
  const [selectedPet, setSelectedPet] = useState<AdoptionPet | null>(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);

  // Applicant form
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [housingType, setHousingType] = useState('Casa con patio seguro');
  const [hasOtherPets, setHasOtherPets] = useState('Sí, conviven con otros animales');
  const [commitmentCheck, setCommitmentCheck] = useState(true);

  // Unique lists for dropdowns
  const cities = Array.from(new Set(pets.map(p => p.city).filter(Boolean)));
  const shelters = Array.from(new Set(pets.map(p => p.shelter).filter(Boolean)));

  const filteredPets = pets.filter((p) => {
    if (speciesFilter !== 'all' && p.species !== speciesFilter) return false;
    if (cityFilter !== 'all' && p.city !== cityFilter) return false;
    if (shelterFilter !== 'all' && p.shelter !== shelterFilter) return false;
    if (breedFilter.trim() && !p.breed.toLowerCase().includes(breedFilter.toLowerCase())) return false;
    return true;
  });

  const handleOpenModal = (pet: AdoptionPet) => {
    setSelectedPet(pet);
    setShowAppModal(true);
    setAppSubmitted(false);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSubmitted(true);
  };

  const resetFilters = () => {
    setCityFilter('all');
    setShelterFilter('all');
    setBreedFilter('');
    setSpeciesFilter('all');
  };

  // Motivational messages dictionary by pet ID or fallback
  const motivationalMessages: Record<string, string> = {
    'ad-01': 'Adoptar a Canela es regalarte una amiga fiel para siempre. Al abrirle las puertas de tu hogar, liberas un cupo para que otro perrito vulnerable sea rescatado.',
    'ad-02': 'Un gato no solo habita un espacio, llena de paz el alma de una familia. Pelusa está esperando enseñarte el verdadero significado del agradecimiento silencioso.',
    'ad-03': 'Toby tiene un corazón inmenso que solo necesita una oportunidad. Los animales adoptados demuestran una lealtad indestructible.',
    'ad-04': 'Los gigantes nobles como Milo son maestros de la paciencia y el amor puro. Dale el hogar que siempre soñó y cambiarás su mundo entero.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#271a33] via-[#3B1C56] to-[#271a33] p-6 sm:p-8 rounded-3xl border border-[#3d2f4a] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1694]/20 border border-[#FF1694]/40 text-[#ffaed9] text-xs font-bold mb-2">
              <PawPrint className="w-3.5 h-3.5" />
              Adopción Responsable y Consentida
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
              Encuentra a tu Compañero de Vida
            </h1>
            <p className="text-xs sm:text-sm text-[#e3bdc8] leading-relaxed">
              Cada uno de estos angelitos ha superado el abandono o el maltrato. Hoy están completamente sanos, vacunados, esterilizados y listos para llenar tu hogar de felicidad.
            </p>
          </div>

          <div className="bg-[#150821] p-4 rounded-2xl border border-emerald-500/30 text-xs text-emerald-300 max-w-xs">
            <span className="font-bold block text-white mb-1">🐾 Garantía de Salud:</span>
            Todos los animales se entregan con esquema completo de vacunación, desparasitación al día y microchip de identificación.
          </div>
        </div>
      </div>

      {/* Filter Section: City, Shelter, Breed & Species */}
      <div className="bg-[#271a33] p-6 rounded-3xl border border-[#3d2f4a] shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#3d2f4a]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#FF1694]" />
            <h2 className="text-sm font-bold text-white">Filtros de Búsqueda de Adopción</h2>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-[#ffaed9] hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Species */}
          <div>
            <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">Especie</label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#150821] p-1 rounded-xl border border-[#3d2f4a]">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'perro', label: 'Perros' },
                { id: 'gato', label: 'Gatos' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSpeciesFilter(t.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    speciesFilter === t.id
                      ? 'bg-[#FF1694] text-white'
                      : 'text-[#e3bdc8] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">Ciudad</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-[#150821] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
            >
              <option value="all">Todas las ciudades ({cities.length})</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Shelter */}
          <div>
            <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">Refugio / Albergue</label>
            <select
              value={shelterFilter}
              onChange={(e) => setShelterFilter(e.target.value)}
              className="w-full bg-[#150821] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
            >
              <option value="all">Todos los refugios ({shelters.length})</option>
              {shelters.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Breed Search */}
          <div>
            <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">Raza o Cruce</label>
            <input
              type="text"
              value={breedFilter}
              onChange={(e) => setBreedFilter(e.target.value)}
              placeholder="Ej. Labrador, Mestizo, Criollo..."
              className="w-full bg-[#150821] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
            />
          </div>
        </div>
      </div>

      {/* Pet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPets.map((pet) => (
          <article
            key={pet.id}
            className="bg-[#271a33] border border-[#3d2f4a] hover:border-[#FF1694] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Top Photo & Badges */}
            <div className="relative h-64 w-full overflow-hidden group">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150821] via-transparent to-transparent opacity-80" />

              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF1694] text-white shadow-md">
                  {pet.gender} • {pet.age}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#150821]/80 backdrop-blur-sm text-[#ffaed9] border border-[#FF1694]/40">
                  {pet.size}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {pet.name}
                  </h3>
                  <p className="text-xs text-[#f0dbfe] font-medium">
                    {pet.breed}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-white bg-[#150821]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#3d2f4a]">
                  <MapPin className="w-3.5 h-3.5 text-[#FF1694]" />
                  <span>{pet.city || 'Bogotá'}</span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              {/* Shelter info */}
              <div className="flex items-center gap-2 text-xs text-[#e3bdc8] pb-3 border-b border-[#3d2f4a]">
                <Building2 className="w-4 h-4 text-[#FF1694]" />
                <span>En resguardo en: <strong className="text-white">{pet.shelter}</strong></span>
              </div>

              {/* Heartwarming Story */}
              <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a]">
                <h4 className="text-xs font-bold text-[#ffaed9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF1694]" />
                  Historia de Superación
                </h4>
                <p className="text-xs text-white leading-relaxed">
                  {pet.story}
                </p>
              </div>

              {/* Motivational Message */}
              <div className="bg-gradient-to-r from-[#3B1C56]/70 to-[#271a33] p-4 rounded-2xl border border-[#FF1694]/30 flex items-start gap-2.5">
                <Quote className="w-4 h-4 text-[#FF1694] shrink-0 mt-0.5" />
                <p className="text-xs text-[#f0dbfe] italic leading-relaxed">
                  «{motivationalMessages[pet.id] || 'Adoptar es un acto supremo de amor y empatía. Este angelito está listo para agradecerte cada día con su cariño incondicional.'}»
                </p>
              </div>

              {/* Tags & Health */}
              <div className="flex flex-wrap gap-1.5">
                {pet.vaccinated && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Vacunado
                  </span>
                )}
                {pet.sterilized && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Esterilizado
                  </span>
                )}
                {pet.microchipped && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#FF1694]/10 text-[#ffaed9] border border-[#FF1694]/30 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Microchip Oficial
                  </span>
                )}
              </div>

              {/* Adoption CTA */}
              <button
                onClick={() => handleOpenModal(pet)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D30D9D] to-[#FF1694] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Postularme para Adoptar a {pet.name}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="bg-[#271a33] rounded-3xl border border-[#3d2f4a] p-12 text-center">
          <PawPrint className="w-12 h-12 text-[#e3bdc8] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white mb-1">
            No se encontraron mascotas con esos filtros
          </h3>
          <p className="text-xs text-[#e3bdc8] mb-4">
            Intenta seleccionar otra ciudad o limpiar los filtros para ver todos los animalitos disponibles.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#FF1694] text-white rounded-xl text-xs font-bold hover:bg-[#D30D9D] cursor-pointer"
          >
            Ver todos los animales
          </button>
        </div>
      )}

      {/* Adoption Application Modal */}
      {showAppModal && selectedPet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAppModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#150821] text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!appSubmitted ? (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#3d2f4a]">
                  <img
                    src={selectedPet.imageUrl}
                    alt={selectedPet.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#FF1694]"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Solicitud de Adopción para {selectedPet.name}
                    </h3>
                    <p className="text-xs text-[#e3bdc8]">
                      Custodiado por: {selectedPet.shelter} ({selectedPet.city})
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-1">
                    Nombre Completo del Postulante *
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
                    className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#f0dbfe] mb-1">
                      Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="Ej. 3101234567"
                      required
                      className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#f0dbfe] mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      required
                      className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-1">
                    Tipo de Vivienda *
                  </label>
                  <select
                    value={housingType}
                    onChange={(e) => setHousingType(e.target.value)}
                    className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs"
                  >
                    <option value="Casa con patio seguro">Casa con patio seguro</option>
                    <option value="Apartamento con mallas de seguridad">Apartamento con mallas de seguridad</option>
                    <option value="Finca o casa campestre">Finca o casa campestre</option>
                  </select>
                </div>

                <div className="bg-[#150821] p-3.5 rounded-xl border border-[#3d2f4a] space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                    <input
                      type="checkbox"
                      checked={commitmentCheck}
                      onChange={(e) => setCommitmentCheck(e.target.checked)}
                      className="accent-[#FF1694] w-4 h-4 rounded"
                    />
                    <span>Me comprometo a brindar alimentación de calidad, amor y atención veterinaria de por vida.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!commitmentCheck}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white font-bold text-xs shadow-lg hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Formulario al Refugio</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  ¡Postulación Enviada con Éxito!
                </h3>
                <p className="text-xs text-[#e3bdc8] max-w-sm mx-auto leading-relaxed">
                  El equipo de <strong>{selectedPet.shelter}</strong> se pondrá en contacto contigo a través de WhatsApp o llamada telefónica para coordinar la visita y entrevista de adopción para <strong>{selectedPet.name}</strong>.
                </p>
                <button
                  onClick={() => setShowAppModal(false)}
                  className="px-6 py-2.5 bg-[#FF1694] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#D30D9D]"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
