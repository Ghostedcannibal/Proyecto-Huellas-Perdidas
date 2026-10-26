import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ActiveScreen, PetPublication } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Camera, 
  Upload, 
  X, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  Tag, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  HelpCircle
} from 'lucide-react';

interface PetSearchEngineProps {
  onNavigateToScreen: (screen: ActiveScreen) => void;
  defaultStatus?: 'all' | 'lost' | 'found';
}

interface UnifiedPetItem {
  id: string;
  code: string;
  name: string;
  type: 'lost' | 'found';
  species: 'perro' | 'gato' | 'otro';
  breed: string;
  color: string;
  sex: 'macho' | 'hembra' | 'desconocido';
  size: 'pequeño' | 'mediano' | 'grande';
  city: string;
  neighborhood: string;
  dateStr: string;
  daysAgo: number;
  description: string;
  imageUrl: string;
  hasCollar: boolean;
  reward?: string;
  treatment?: string;
  statusTag: string;
  statusType: 'urgent' | 'shelter' | 'clinic';
  matchReasons?: string[];
  targetScreen: ActiveScreen;
}

const POPULAR_BREEDS = [
  'Criollo / Mestizo',
  'Golden Retriever',
  'Labrador Retriever',
  'Husky Siberiano',
  'Pastor Alemán',
  'Schnauzer',
  'Poodle / Caniche',
  'Bulldog Francés',
  'Pinscher',
  'Pitbull',
  'Beagle',
  'Shih Tzu',
  'Siamés',
  'Angora',
  'Persa',
  'Criollo Común Europeo'
];

const COLOR_OPTIONS = [
  'Dorado / Miel',
  'Negro',
  'Blanco',
  'Café / Chocolate',
  'Manto Negro / Caramelo',
  'Atigrado / Barcino',
  'Manchado / Con manchas',
  'Gris / Cenizo',
  'Bicolor',
  'Tricolor'
];

export const PetSearchEngine: React.FC<PetSearchEngineProps> = ({
  onNavigateToScreen,
  defaultStatus = 'all'
}) => {
  const { publications } = useAuth();

  // Primary status selector: Todos | Desaparecidos (Se Busca) | Encontrados (En Resguardo)
  const [reportType, setReportType] = useState<'all' | 'lost' | 'found'>(defaultStatus);

  // Quick search query
  const [searchQuery, setSearchQuery] = useState('');

  // Structured filters matching the upload / reporting form
  const [species, setSpecies] = useState<'all' | 'perro' | 'gato' | 'otro'>('all');
  const [petName, setPetName] = useState('');
  const [breedSelect, setBreedSelect] = useState('all');
  const [customBreed, setCustomBreed] = useState('');
  const [color, setColor] = useState('all');
  const [sex, setSex] = useState<'all' | 'macho' | 'hembra'>('all');
  const [size, setSize] = useState<'all' | 'pequeño' | 'mediano' | 'grande'>('all');
  const [city, setCity] = useState('all');
  const [neighborhood, setNeighborhood] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | '48h' | 'week' | 'month'>('all');

  // Specific traits / accessories
  const [filterReward, setFilterReward] = useState(false);
  const [filterCollar, setFilterCollar] = useState(false);
  const [filterMedical, setFilterMedical] = useState(false);

  // Photo comparison (Buscador visual / Lens)
  const [uploadedPhotoPreview, setUploadedPhotoPreview] = useState<string | null>(null);
  const [showPhotoComparator, setShowPhotoComparator] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);

  // Expandable filters panel
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);

  // Combine BASE_MOCK_PETS and real user publications from AuthContext
  const allUnifiedPets: UnifiedPetItem[] = useMemo(() => {
    const fromAuth = publications.map((pub: PetPublication) => {
      let sexNormalized: 'macho' | 'hembra' | 'desconocido' = 'desconocido';
      if (pub.sex?.toLowerCase().includes('macho')) sexNormalized = 'macho';
      else if (pub.sex?.toLowerCase().includes('hembra')) sexNormalized = 'hembra';

      let sizeNormalized: 'pequeño' | 'mediano' | 'grande' = 'mediano';
      if (pub.size?.toLowerCase().includes('peque')) sizeNormalized = 'pequeño';
      else if (pub.size?.toLowerCase().includes('gran')) sizeNormalized = 'grande';

      return {
        id: pub.id,
        code: `#HP-${pub.id.slice(0, 4).toUpperCase()}`,
        name: pub.petName || (pub.type === 'lost' ? 'Animal Desaparecido' : 'Animal En Resguardo'),
        type: pub.type,
        species: pub.species,
        breed: pub.breed || 'Criollo / Mestizo',
        color: pub.color || 'Color no especificado',
        sex: sexNormalized,
        size: sizeNormalized,
        city: pub.city || 'Bogotá',
        neighborhood: pub.neighborhood || pub.lastSeenOrFoundLocation || 'Sector no especificado',
        dateStr: pub.date || 'Reciente',
        daysAgo: 1,
        description: pub.description,
        imageUrl: pub.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
        hasCollar: pub.description.toLowerCase().includes('collar'),
        reward: pub.reward ? `$${pub.reward} COP` : undefined,
        statusTag: pub.type === 'lost' ? 'Se Busca Urgente' : 'En Resguardo',
        statusType: pub.type === 'lost' ? ('urgent' as const) : ('shelter' as const),
        targetScreen: 'chat' as const,
      };
    });

    return fromAuth;
  }, [publications]);

  // Handle Image Upload for Visual Comparison
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhotoPreview(reader.result as string);
        setIsAnalyzingPhoto(true);
        setTimeout(() => {
          setIsAnalyzingPhoto(false);
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = () => {
    setUploadedPhotoPreview(null);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setReportType('all');
    setSearchQuery('');
    setSpecies('all');
    setPetName('');
    setBreedSelect('all');
    setCustomBreed('');
    setColor('all');
    setSex('all');
    setSize('all');
    setCity('all');
    setNeighborhood('');
    setTimeRange('all');
    setFilterReward(false);
    setFilterCollar(false);
    setFilterMedical(false);
    setUploadedPhotoPreview(null);
  };

  // Calculate active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (reportType !== 'all') count++;
    if (searchQuery.trim()) count++;
    if (species !== 'all') count++;
    if (petName.trim()) count++;
    if (breedSelect !== 'all' || customBreed.trim()) count++;
    if (color !== 'all') count++;
    if (sex !== 'all') count++;
    if (size !== 'all') count++;
    if (city !== 'all') count++;
    if (neighborhood.trim()) count++;
    if (timeRange !== 'all') count++;
    if (filterReward) count++;
    if (filterCollar) count++;
    if (filterMedical) count++;
    if (uploadedPhotoPreview) count++;
    return count;
  }, [
    reportType, searchQuery, species, petName, breedSelect, customBreed,
    color, sex, size, city, neighborhood, timeRange, filterReward, filterCollar,
    filterMedical, uploadedPhotoPreview
  ]);

  // Filter application
  const filteredPets = useMemo(() => {
    return allUnifiedPets.filter((pet) => {
      // 1. Report Type (lost vs found)
      if (reportType !== 'all' && pet.type !== reportType) {
        return false;
      }

      // 2. Species
      if (species !== 'all') {
        if (species === 'perro' && pet.species !== 'perro') return false;
        if (species === 'gato' && pet.species !== 'gato') return false;
        if (species === 'otro' && pet.species !== 'otro') return false;
      }

      // 3. Name Search
      if (petName.trim()) {
        const nameQuery = petName.trim().toLowerCase();
        if (!pet.name.toLowerCase().includes(nameQuery)) {
          return false;
        }
      }

      // 4. Breed Filter
      const effectiveBreed = customBreed.trim() ? customBreed.trim().toLowerCase() : (breedSelect !== 'all' ? breedSelect.toLowerCase() : '');
      if (effectiveBreed) {
        if (!pet.breed.toLowerCase().includes(effectiveBreed)) {
          return false;
        }
      }

      // 5. Color Filter
      if (color !== 'all') {
        const colorQuery = color.toLowerCase();
        if (!pet.color.toLowerCase().includes(colorQuery)) {
          return false;
        }
      }

      // 6. Sex Filter
      if (sex !== 'all') {
        if (pet.sex !== sex) {
          return false;
        }
      }

      // 7. Size Filter
      if (size !== 'all') {
        if (pet.size !== size) {
          return false;
        }
      }

      // 8. City Filter
      if (city !== 'all') {
        if (!pet.city.toLowerCase().includes(city.toLowerCase())) {
          return false;
        }
      }

      // 9. Neighborhood Filter
      if (neighborhood.trim()) {
        const nQuery = neighborhood.trim().toLowerCase();
        if (!pet.neighborhood.toLowerCase().includes(nQuery)) {
          return false;
        }
      }

      // 10. Time range filter
      if (timeRange === 'today' && pet.daysAgo > 0) return false;
      if (timeRange === '48h' && pet.daysAgo > 2) return false;
      if (timeRange === 'week' && pet.daysAgo > 7) return false;
      if (timeRange === 'month' && pet.daysAgo > 30) return false;

      // 11. Accessories & Special Flags
      if (filterReward && !pet.reward) return false;
      if (filterCollar && !pet.hasCollar) return false;
      if (filterMedical && !pet.treatment) return false;

      // 12. Quick text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = pet.name.toLowerCase().includes(q);
        const matchCode = pet.code.toLowerCase().includes(q);
        const matchBreed = pet.breed.toLowerCase().includes(q);
        const matchDesc = pet.description.toLowerCase().includes(q);
        const matchLoc = pet.neighborhood.toLowerCase().includes(q) || pet.city.toLowerCase().includes(q);
        const matchColor = pet.color.toLowerCase().includes(q);

        if (!matchName && !matchCode && !matchBreed && !matchDesc && !matchLoc && !matchColor) {
          return false;
        }
      }

      return true;
    });
  }, [
    allUnifiedPets, reportType, species, petName, breedSelect, customBreed,
    color, sex, size, city, neighborhood, timeRange, filterReward, filterCollar,
    filterMedical, searchQuery
  ]);

  return (
    <div id="pet-search-engine" className="w-full space-y-6">
      {/* Container Box with High Contrast Light/Dark Styling */}
      <div className="rounded-3xl bg-[#23162f] border border-[#3d2f4a] shadow-2xl p-5 sm:p-7 text-[#f0dbfe] transition-colors duration-200">
        
        {/* Top Header of the Search Tool */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#3d2f4a]/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#FF1694]/20 text-[#FF1694] border border-[#FF1694]/30">
                <Search className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                  Buscador de Animales Desaparecidos y Encontrados
                </h2>
                <p className="text-xs sm:text-sm text-[#e3bdc8] mt-0.5">
                  Filtros cruzados con los mismos criterios de registro comunitario en Colombia
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#32243e] hover:bg-[#3d2f4a] text-xs font-semibold text-[#ffb0cb] border border-[#3d2f4a] transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restablecer ({activeFiltersCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#271a33] hover:bg-[#32243e] text-xs font-semibold text-[#cebdff] border border-[#3d2f4a] transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isAdvancedExpanded ? 'Ocultar filtros' : 'Ver todos los filtros'}</span>
              {isAdvancedExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 1. Status Selection Tabs: All | Lost | Found */}
        <div className="pt-5 pb-3">
          <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider block mb-2">
            Tipo de Alerta o Caso
          </label>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pb-1 mobile-chip-scroll">
            <button
              type="button"
              onClick={() => setReportType('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                reportType === 'all'
                  ? 'bg-[#FF1694] text-white border-[#FF1694] shadow-md shadow-[#FF1694]/20'
                  : 'bg-[#150821] text-[#e3bdc8] hover:text-white border-[#3d2f4a]'
              }`}
            >
              <span>Todos los Casos</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 text-white">
                {allUnifiedPets.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setReportType('lost')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                reportType === 'lost'
                  ? 'bg-[#FF1694] text-white border-[#FF1694] shadow-md shadow-[#FF1694]/20'
                  : 'bg-[#150821] text-[#e3bdc8] hover:text-white border-[#3d2f4a]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#ff479d] animate-ping"></span>
              <span>🚨 Desaparecidos (Se Busca)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 text-white">
                {allUnifiedPets.filter(p => p.type === 'lost').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setReportType('found')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                reportType === 'found'
                  ? 'bg-[#9b7fed] text-[#1a0d26] border-[#9b7fed] shadow-md shadow-[#9b7fed]/20'
                  : 'bg-[#150821] text-[#e3bdc8] hover:text-white border-[#3d2f4a]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>🏡 Encontrados (En Resguardo)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 text-white">
                {allUnifiedPets.filter(p => p.type === 'found').length}
              </span>
            </button>
          </div>
        </div>

        {/* 2. Main Quick Search Bar */}
        <div className="relative my-3">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#e3bdc8]">
            <Search className="w-4 h-4 text-[#ffb0cb]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código (#HP-8942), nombre, raza, barrio o descripción física..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#150821] text-white placeholder:text-[#e3bdc8]/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF1694] border border-[#3d2f4a] shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-[#e3bdc8] hover:text-white text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3. Detailed Filters Grid (Matching the exact fields of NoticePublishScreen) */}
        {isAdvancedExpanded && (
          <div className="pt-3 space-y-4 border-t border-[#3d2f4a]/50 mt-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              
              {/* Especie */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider flex items-center gap-1">
                  <span>Especie</span>
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a] cursor-pointer"
                >
                  <option value="all">Todas las especies</option>
                  <option value="perro">🐕 Canino / Perro</option>
                  <option value="gato">🐈 Felino / Gato</option>
                  <option value="otro">🦜 Otras especies (Aves, Conejos)</option>
                </select>
              </div>

              {/* Nombre de la Mascota */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider">
                  Nombre de la mascota
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ej: Max, Canela, Toby..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white placeholder:text-[#e3bdc8]/50 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a]"
                />
              </div>

              {/* Raza (Select o Input) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider">
                  Raza
                </label>
                <div className="space-y-1.5">
                  <select
                    value={breedSelect}
                    onChange={(e) => {
                      setBreedSelect(e.target.value);
                      if (e.target.value !== 'all') setCustomBreed('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a] cursor-pointer"
                  >
                    <option value="all">Cualquier raza</option>
                    {POPULAR_BREEDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={customBreed}
                    onChange={(e) => {
                      setCustomBreed(e.target.value);
                      if (e.target.value) setBreedSelect('all');
                    }}
                    placeholder="O escribe otra raza..."
                    className="w-full px-3.5 py-1.5 rounded-lg bg-[#150821]/80 text-white placeholder:text-[#e3bdc8]/40 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a]/80"
                  />
                </div>
              </div>

              {/* Color Predominante */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider">
                  Color de Pelaje
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a] cursor-pointer"
                >
                  <option value="all">Todos los colores</option>
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sexo */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider">
                  Sexo
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a] cursor-pointer"
                >
                  <option value="all">Indistinto (Macho o Hembra)</option>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
              </div>

              {/* Tamaño */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider">
                  Tamaño Estimado
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a] cursor-pointer"
                >
                  <option value="all">Cualquier tamaño</option>
                  <option value="pequeño">Pequeño (&lt; 10 kg)</option>
                  <option value="mediano">Mediano (10 - 25 kg)</option>
                  <option value="grande">Grande o Gigante (&gt; 25 kg)</option>
                </select>
              </div>

              {/* Ciudad */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ffb0cb]" />
                  <span>Ciudad</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a] cursor-pointer"
                >
                  <option value="all">Toda Colombia</option>
                  <option value="Bogotá">Bogotá D.C.</option>
                  <option value="Medellín">Medellín / Valle de Aburrá</option>
                  <option value="Cali">Cali</option>
                  <option value="Barranquilla">Barranquilla</option>
                  <option value="Bucaramanga">Bucaramanga</option>
                  <option value="Cartagena">Cartagena</option>
                  <option value="Pereira">Pereira</option>
                  <option value="Manizales">Manizales</option>
                </select>
              </div>

              {/* Barrio / Sector */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider">
                  Barrio o Localidad
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ej: Suba, Chapinero, El Poblado..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white placeholder:text-[#e3bdc8]/50 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a]"
                />
              </div>

            </div>

            {/* Sub-row: Fecha de desaparición, Señas particulares y Botón de Subir Foto */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-2 border-t border-[#3d2f4a]/40">
              
              {/* Fecha de extravío / hallazgo */}
              <div className="lg:col-span-4 space-y-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#cebdff]" />
                  <span>Cuándo se extravió / halló</span>
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150821] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#FF1694] border border-[#3d2f4a] cursor-pointer"
                >
                  <option value="all">Cualquier momento</option>
                  <option value="today">Hoy (últimas 24 horas)</option>
                  <option value="48h">Últimas 48 horas</option>
                  <option value="week">Última semana (7 días)</option>
                  <option value="month">Último mes (30 días)</option>
                </select>
              </div>

              {/* Señas particulares checkboxes */}
              <div className="lg:col-span-4 flex flex-col justify-end space-y-2 pb-1">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider">
                  Condiciones Particulares
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterCollar(!filterCollar)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      filterCollar
                        ? 'bg-[#FF1694] text-white border-[#FF1694]'
                        : 'bg-[#150821] text-[#e3bdc8] border-[#3d2f4a] hover:text-white'
                    }`}
                  >
                    <span>Llevaba collar</span>
                    {filterCollar && <CheckCircle2 className="w-3 h-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterReward(!filterReward)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      filterReward
                        ? 'bg-[#FF1694] text-white border-[#FF1694]'
                        : 'bg-[#150821] text-[#e3bdc8] border-[#3d2f4a] hover:text-white'
                    }`}
                  >
                    <span>Con recompensa</span>
                    {filterReward && <CheckCircle2 className="w-3 h-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterMedical(!filterMedical)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      filterMedical
                        ? 'bg-[#FF1694] text-white border-[#FF1694]'
                        : 'bg-[#150821] text-[#e3bdc8] border-[#3d2f4a] hover:text-white'
                    }`}
                  >
                    <span>Requiere medicación</span>
                    {filterMedical && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Foto de Referencia (Comparador / Lens) */}
              <div className="lg:col-span-4 flex flex-col justify-end">
                <label className="text-[11px] font-bold text-[#cebdff] uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Camera className="w-3.5 h-3.5 text-[#FF1694]" />
                  <span>Foto del animal desaparecido</span>
                </label>
                
                {uploadedPhotoPreview ? (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-[#150821] border border-[#FF1694]/50">
                    <img 
                      src={uploadedPhotoPreview} 
                      alt="Foto de referencia" 
                      className="w-10 h-10 rounded-lg object-cover border border-[#FF1694]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">Foto de referencia cargada</p>
                      <p className="text-[10px] text-[#ffb0cb]">Comparación visual activa</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearPhoto}
                      className="p-1 rounded-md text-[#e3bdc8] hover:text-white hover:bg-[#32243e] cursor-pointer"
                      title="Quitar foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#150821] hover:bg-[#271a33] border border-dashed border-[#FF1694]/60 text-xs text-[#ffb0cb] font-semibold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir foto para comparar rasgos</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

            </div>

          </div>
        )}

        {/* 4. Active Filters Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-4 mt-3 border-t border-[#3d2f4a]/40">
            <span className="text-[11px] text-[#cebdff] font-bold mr-1">Filtros activos:</span>
            
            {reportType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF1694]/20 text-[#ffb0cb] text-[11px] font-semibold border border-[#FF1694]/40">
                {reportType === 'lost' ? 'Solo Desaparecidos' : 'Solo En Resguardo'}
                <button type="button" onClick={() => setReportType('all')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {species !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Especie: {species === 'perro' ? '🐕 Canino' : species === 'gato' ? '🐈 Felino' : '🦜 Otro'}
                <button type="button" onClick={() => setSpecies('all')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {petName.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Nombre: "{petName}"
                <button type="button" onClick={() => setPetName('')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {(breedSelect !== 'all' || customBreed.trim()) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Raza: {customBreed || breedSelect}
                <button type="button" onClick={() => { setBreedSelect('all'); setCustomBreed(''); }} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {color !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Color: {color}
                <button type="button" onClick={() => setColor('all')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {sex !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Sexo: {sex}
                <button type="button" onClick={() => setSex('all')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {size !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Tamaño: {size}
                <button type="button" onClick={() => setSize('all')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {city !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Ciudad: {city}
                <button type="button" onClick={() => setCity('all')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {neighborhood.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Barrio: {neighborhood}
                <button type="button" onClick={() => setNeighborhood('')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {timeRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#f0dbfe] text-[11px] font-semibold border border-[#3d2f4a]">
                Tiempo: {timeRange}
                <button type="button" onClick={() => setTimeRange('all')} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {filterReward && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#ffb0cb] text-[11px] font-semibold border border-[#ff479d]/40">
                Con recompensa
                <button type="button" onClick={() => setFilterReward(false)} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {filterCollar && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-[#cebdff] text-[11px] font-semibold border border-[#9b7fed]/40">
                Con collar
                <button type="button" onClick={() => setFilterCollar(false)} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {filterMedical && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#32243e] text-rose-300 text-[11px] font-semibold border border-rose-500/40">
                Medicación urgente
                <button type="button" onClick={() => setFilterMedical(false)} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            {uploadedPhotoPreview && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF1694]/20 text-[#ffb0cb] text-[11px] font-semibold border border-[#FF1694]">
                Foto de referencia activa
                <button type="button" onClick={handleClearPhoto} className="hover:text-white cursor-pointer">×</button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-[#ffb0cb] hover:underline font-bold ml-2 cursor-pointer"
            >
              Limpiar todo
            </button>
          </div>
        )}

      </div>

      {/* Results Header & Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Resultados de la Búsqueda
          </h3>
          <p className="text-xs text-[#e3bdc8] mt-0.5">
            Mostrando <strong className="text-white font-bold">{filteredPets.length}</strong> de{' '}
            <strong className="text-white font-bold">{allUnifiedPets.length}</strong> casos registrados en la red
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateToScreen('report')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF1694] hover:bg-[#D30D9D] text-white text-xs font-bold shadow-md shadow-[#FF1694]/20 transition-all cursor-pointer"
          >
            <span>+ ¿No encuentras a tu mascota? Publica el reporte</span>
          </button>
        </div>
      </div>

      {/* Grid of Filtered Pet Cards */}
      {filteredPets.length === 0 ? (
        <div className="p-12 text-center bg-[#23162f] rounded-3xl border border-[#3d2f4a] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FF1694]/10 text-[#FF1694] flex items-center justify-center mx-auto border border-[#FF1694]/30">
            <Search className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-lg font-bold text-white">No se encontraron mascotas con estos filtros</h4>
            <p className="text-xs text-[#e3bdc8] leading-relaxed">
              Prueba quitando algunos filtros o ampliando la ciudad. También puedes publicar un reporte de aviso para que la comunidad comience a buscar de inmediato.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-full bg-[#32243e] hover:bg-[#3d2f4a] text-white text-xs font-bold border border-[#3d2f4a] cursor-pointer"
            >
              Restablecer filtros
            </button>
            <button
              type="button"
              onClick={() => onNavigateToScreen('report')}
              className="px-5 py-2.5 rounded-full bg-[#FF1694] hover:bg-[#D30D9D] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Publicar reporte nuevo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <article
              key={pet.id}
              className="flex flex-col rounded-3xl bg-[#23162f] overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300 border border-[#3d2f4a] hover:border-[#FF1694]/60"
            >
              {/* Pet Image with overlay & badges */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#150821]">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={pet.imageUrl}
                  alt={pet.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#23162f] via-transparent to-transparent opacity-90"></div>

                {/* Status Tag */}
                {pet.type === 'lost' ? (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#150821]/90 backdrop-blur-md text-[#ffb0cb] text-[10px] font-bold uppercase tracking-wider shadow-md border border-[#FF1694]/40">
                    <span className="w-2 h-2 rounded-full bg-[#ff479d] animate-ping"></span>
                    <span>Se Busca Urgente</span>
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9b7fed] text-[#1a0d26] text-[10px] font-bold uppercase tracking-wider shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>En Resguardo</span>
                  </div>
                )}

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#150821]/80 text-[#cebdff] text-[10px] font-mono font-bold border border-[#3d2f4a]">
                  {pet.code}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xl font-bold text-white font-sans truncate">{pet.name}</h4>
                    <span className="text-xs text-[#ffaed9] font-semibold shrink-0 capitalize">
                      {pet.sex !== 'desconocido' ? pet.sex : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#cebdff] font-semibold mt-1">
                    <span>{pet.species === 'perro' ? '🐕' : pet.species === 'gato' ? '🐈' : '🦜'}</span>
                    <span className="truncate">{pet.breed}</span>
                    <span className="text-[#e3bdc8]">•</span>
                    <span className="text-[#e3bdc8] capitalize">{pet.size}</span>
                  </div>

                  <div className="mt-2 text-xs text-[#e3bdc8] flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#ffb0cb] shrink-0" />
                    <span className="truncate">Color: <strong className="text-white font-medium">{pet.color}</strong></span>
                  </div>

                  <p className="text-xs text-[#e3bdc8] mt-2 leading-relaxed line-clamp-2">
                    {pet.description}
                  </p>

                  <div className="mt-3.5 space-y-1.5 text-xs text-[#e3bdc8] pt-3 border-t border-[#3d2f4a]/50">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF1694] shrink-0" />
                      <span className="truncate font-medium text-white">{pet.city} • {pet.neighborhood}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#cebdff] shrink-0" />
                      <span>{pet.dateStr}</span>
                    </div>
                  </div>

                  {/* Recompensa */}
                  {pet.reward && (
                    <div className="mt-3 p-2 rounded-xl bg-[#FF1694]/15 border border-[#FF1694]/30 flex items-center justify-between">
                      <span className="text-[10px] text-[#ffb0cb] uppercase font-bold">Recompensa</span>
                      <span className="text-xs font-bold text-white font-mono">{pet.reward}</span>
                    </div>
                  )}

                  {/* Tratamiento especial */}
                  {pet.treatment && (
                    <div className="mt-3 p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
                      <span className="text-[10px] text-amber-300 uppercase font-bold">Alerta Médica</span>
                      <span className="text-xs font-semibold text-amber-200">{pet.treatment}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Button */}
                <button
                  type="button"
                  onClick={() => onNavigateToScreen(pet.targetScreen)}
                  className={`w-full inline-flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-md ${
                    pet.type === 'lost'
                      ? 'bg-gradient-to-r from-[#D30D9D] to-[#FF1694] hover:opacity-95 text-white'
                      : 'bg-[#32243e] text-[#f0dbfe] hover:bg-[#42334e] hover:text-white border border-[#3d2f4a]'
                  }`}
                >
                  <span>{pet.type === 'lost' ? 'Ver Ficha y Contactar' : 'Validar Custodia'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
