import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ASSETS } from '../data/mockData';
import { PetPublication } from '../types';
import { 
  Megaphone, 
  MapPin, 
  Calendar, 
  Clock, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  ShieldAlert, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Home, 
  Send,
  AlertCircle
} from 'lucide-react';

interface NoticePublishScreenProps {
  onPublishSuccess?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToAdmin?: () => void;
}

export const NoticePublishScreen: React.FC<NoticePublishScreenProps> = ({
  onPublishSuccess,
  onNavigateToSearch,
  onNavigateToAdmin
}) => {
  const { addPublication, publications, currentUser, isAuthorizedCreator } = useAuth();

  // Report Type
  const [type, setType] = useState<'lost' | 'found'>('lost');

  // Form Fields
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<'perro' | 'gato'>('perro');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [sex, setSex] = useState<'Macho' | 'Hembra'>('Macho');
  const [size, setSize] = useState<'Pequeño' | 'Mediano' | 'Grande'>('Mediano');
  const [description, setDescription] = useState('');

  // Location Fields
  const [city, setCity] = useState('Bogotá');
  const [neighborhood, setNeighborhood] = useState('');
  const [lastSeenOrFoundLocation, setLastSeenOrFoundLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');

  // Found Pet specific location
  const [currentLocationType, setCurrentLocationType] = useState<'shelter' | 'home'>('home');
  const [shelterName, setShelterName] = useState('');
  const [shelterAddress, setShelterAddress] = useState('');

  // Contact Info
  const [contactName, setContactName] = useState(currentUser?.fullName || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');

  // Photo
  const [previewImage, setPreviewImage] = useState<string>(ASSETS.maxLost);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<PetPublication | null>(null);
  const [matchingResults, setMatchingResults] = useState<PetPublication[]>([]);
  const [showEmailNotificationSimulation, setShowEmailNotificationSimulation] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!city || !neighborhood || !description || !contactPhone || !contactEmail) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create new publication
      const newPubData: Omit<PetPublication, 'id' | 'status' | 'createdAt'> = {
        type,
        species,
        petName: petName.trim() || (type === 'lost' ? 'Mascota perdida' : 'Mascota encontrada'),
        breed: breed.trim() || 'Mestizo',
        city,
        neighborhood,
        date,
        time,
        lastSeenOrFoundLocation,
        description,
        imageUrl: previewImage,
        contactName: contactName.trim() || 'Contacto Comunitario',
        contactPhone,
        contactEmail,
        color: color.trim() || 'No especificado',
        sex,
        size,
        currentLocationType: type === 'found' ? currentLocationType : undefined,
        shelterName: type === 'found' && currentLocationType === 'shelter' ? shelterName : undefined,
        shelterAddress: type === 'found' && currentLocationType === 'shelter' ? shelterAddress : undefined,
        mapCoordinates: type === 'found' ? { lat: 4.7110, lng: -74.0721 } : undefined,
      };

      const published = addPublication(newPubData);

      // Coincidence Analysis:
      // If lost, check against found; if found, check against lost
      const targetType = type === 'lost' ? 'found' : 'lost';
      const potentialMatches = publications.filter(p => {
        return (
          p.type === targetType &&
          p.species === species &&
          p.city.toLowerCase() === city.toLowerCase() &&
          (p.sex === sex || p.sex === 'Macho' || p.sex === 'Hembra')
        );
      });

      setSubmittedReport(published);
      setMatchingResults(potentialMatches);
      setShowEmailNotificationSimulation(potentialMatches.length > 0);
      setIsSubmitting(false);

      if (onPublishSuccess) {
        onPublishSuccess();
      }
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Header */}
      <div className="mb-8 bg-gradient-to-r from-[#271a33] via-[#3B1C56] to-[#271a33] p-6 sm:p-8 rounded-3xl border border-[#3d2f4a] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1694]/20 border border-[#FF1694]/40 text-[#ffaed9] text-xs font-bold mb-2">
              <Megaphone className="w-3.5 h-3.5" />
              Publicación Oficial de Aviso de Mascota
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
              Reportar Mascota Perdida o Encontrada
            </h1>
            <p className="text-xs sm:text-sm text-[#e3bdc8] mt-1">
              Completa la ficha detallada. El motor analizará coincidencias automáticamente y el reporte pasará al panel de moderación para ser publicado.
            </p>
          </div>

          {/* Lost vs Found Type Switcher */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex bg-[#150821] p-1.5 rounded-2xl border border-[#3d2f4a]">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                type === 'lost'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-[#e3bdc8] hover:text-white'
              }`}
            >
              Mascota Perdida
            </button>
            <button
              type="button"
              onClick={() => setType('found')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                type === 'found'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[#e3bdc8] hover:text-white'
              }`}
            >
              Mascota Encontrada
            </button>
          </div>
        </div>
      </div>

      {/* Submission Success & Coincidence Modal */}
      {submittedReport && (
        <div className="mb-8 bg-[#271a33] border-2 border-[#FF1694] rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">¡Aviso Registrado Exitosamente!</h2>
              <p className="text-xs text-[#e3bdc8]">
                Tu reporte ha sido enviado al <strong className="text-white">Panel de Moderación del Administrador</strong> para su debida autorización.
              </p>
            </div>
          </div>

          {/* Empathetic / Gratitude Message */}
          <div className="p-4 rounded-2xl mb-6 bg-gradient-to-r from-[#3B1C56]/80 to-[#271a33] border border-[#FF1694]/40">
            {type === 'lost' ? (
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#FF1694] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Mensaje de ánimo y apoyo de nuestra comunidad:
                  </h3>
                  <p className="text-xs text-[#f0dbfe] leading-relaxed">
                    «Entendemos profundamente la angustia y el vacío que genera perder a un ser tan querido. No estás solo: nuestra red de rescatistas, refugios y vecinos de <strong>{city}</strong> se encuentra atenta para ayudarte a encontrar a <strong>{submittedReport.petName}</strong>. ¡Mantén la fe y la esperanza, cada minuto cuenta y estamos contigo!»
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Mensaje de sincero agradecimiento:
                  </h3>
                  <p className="text-xs text-[#f0dbfe] leading-relaxed">
                    «¡Muchas gracias por tu nobleza, bondad y compromiso cívico! Gracias a personas como tú, este animalito vulnerable está a salvo de los peligros de la calle. Tu reporte es el puente que puede devolverle la tranquilidad y la alegría a una familia que lo extraña con el corazón.»
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Coincidence notification simulated email */}
          {showEmailNotificationSimulation && matchingResults.length > 0 && (
            <div className="bg-[#150821] border border-amber-500/40 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                <Mail className="w-4 h-4" />
                <span>Simulación de Notificación Automática por Correo Electrónico</span>
              </div>
              <p className="text-xs text-white mb-3">
                {type === 'lost'
                  ? `Se han detectado ${matchingResults.length} reporte(s) de mascotas encontradas en ${city} con rasgos similares. Hemos despachado una notificación a ${submittedReport.contactEmail} con la información de contacto y ubicación:`
                  : `Se han detectado ${matchingResults.length} reporte(s) de mascotas perdidas con las mismas características en ${city}. Hemos notificado a sus dueños para contactarte:`}
              </p>

              <div className="space-y-3">
                {matchingResults.map(match => (
                  <div key={match.id} className="bg-[#271a33] p-3 rounded-xl border border-[#3d2f4a] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={match.imageUrl} alt={match.petName} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-white">{match.petName} ({match.breed})</p>
                        <p className="text-[#e3bdc8]">{match.neighborhood}, {match.city} • {match.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">{match.contactName}</p>
                      <p className="text-white">{match.contactPhone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSubmittedReport(null)}
              className="px-5 py-2.5 bg-[#FF1694] hover:bg-[#D30D9D] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-md"
            >
              Publicar Otro Aviso
            </button>
            {onNavigateToSearch && (
              <button
                onClick={onNavigateToSearch}
                className="px-5 py-2.5 bg-[#150821] hover:bg-[#32243e] text-[#f0dbfe] border border-[#3d2f4a] rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Ir al Buscador Lens
              </button>
            )}
            {onNavigateToAdmin && isAuthorizedCreator && (
              <button
                onClick={onNavigateToAdmin}
                className="px-5 py-2.5 bg-[#150821] hover:bg-[#32243e] text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Ver en Consola de Creadores
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Publishing Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Pet Physical Identification */}
        <div className="bg-[#271a33] rounded-3xl border border-[#3d2f4a] p-6 sm:p-8 shadow-lg space-y-6">
          <div className="border-b border-[#3d2f4a] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF1694] text-white text-xs flex items-center justify-center font-bold">1</span>
              Datos de la Mascota
            </h2>
            <p className="text-xs text-[#e3bdc8] mt-1">
              Describe a la mascota con la mayor exactitud posible para que el algoritmo encuentre coincidencias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Nombre de la mascota (si se conoce)
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Ej. Max, Luna, Toby..."
                className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Especie *
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as 'perro' | 'gato')}
                className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
              >
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Raza *
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Ej. Golden Retriever, Criollo, Siames..."
                required
                className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Color de Pelaje *
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ej. Dorado claro, Negro con blanco..."
                required
                className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Sexo *
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as 'Macho' | 'Hembra')}
                className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
              >
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Tamaño *
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
              >
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
              Descripción Física Detallada *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe marcas particulares, señas, collar, actitud, estado de salud o cualquier detalle distintivo..."
              required
              className="w-full bg-[#150821] text-white p-3 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
              Fotografía de la Mascota *
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#FF1694] shrink-0">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#150821] border border-[#3d2f4a] hover:border-[#FF1694] text-xs font-bold text-[#f0dbfe] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#FF1694]" />
                  Seleccionar foto del dispositivo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <p className="text-[11px] text-[#e3bdc8] mt-1.5">
                  Una foto nítida aumenta en más del 85% la probabilidad de reconocimiento exitoso.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Location, Date & Time */}
        <div className="bg-[#271a33] rounded-3xl border border-[#3d2f4a] p-6 sm:p-8 shadow-lg space-y-6">
          <div className="border-b border-[#3d2f4a] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF1694] text-white text-xs flex items-center justify-center font-bold">2</span>
              Ubicación y Momento del Suceso
            </h2>
            <p className="text-xs text-[#e3bdc8] mt-1">
              Indica la ciudad, barrio, fecha, hora y el lugar exacto donde se vio por última vez la mascota.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Ciudad *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
              >
                <option value="Bogotá">Bogotá D.C.</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Barranquilla">Barranquilla</option>
                <option value="Bucaramanga">Bucaramanga</option>
                <option value="Cartagena">Cartagena</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Barrio o Sector *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#8e7a9f]" />
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ej. Cedritos, Usaquén, Laureles..."
                  required
                  className="w-full bg-[#150821] text-white pl-9 pr-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Fecha del Suceso *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-[#8e7a9f]" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-[#150821] text-white pl-9 pr-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Hora aproximada *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-[#8e7a9f]" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full bg-[#150821] text-white pl-9 pr-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
              Lugar exacto donde se vio por última vez *
            </label>
            <input
              type="text"
              value={lastSeenOrFoundLocation}
              onChange={(e) => setLastSeenOrFoundLocation(e.target.value)}
              placeholder="Ej. Parque de Cedritos calle 140 frente al supermercado"
              required
              className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
            />
          </div>

          {/* If Found Pet: Option to specify current stay (Shelter vs Home) + Minimap */}
          {type === 'found' && (
            <div className="bg-[#150821] p-5 rounded-2xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <MapPin className="w-4 h-4" />
                <span>¿Dónde se encuentra resguardada la mascota actualmente?</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentLocationType('shelter')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    currentLocationType === 'shelter'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-[#271a33] text-[#e3bdc8] border-[#3d2f4a]'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> En un Refugio / Albergue
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLocationType('home')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    currentLocationType === 'home'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-[#271a33] text-[#e3bdc8] border-[#3d2f4a]'
                  }`}
                >
                  <Home className="w-4 h-4" /> En Hogar de Paso Temporal
                </button>
              </div>

              {currentLocationType === 'shelter' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#f0dbfe] mb-1">
                      Nombre del Refugio
                    </label>
                    <input
                      type="text"
                      value={shelterName}
                      onChange={(e) => setShelterName(e.target.value)}
                      placeholder="Ej. Refugio San Roque"
                      className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#f0dbfe] mb-1">
                      Dirección del Refugio
                    </label>
                    <input
                      type="text"
                      value={shelterAddress}
                      onChange={(e) => setShelterAddress(e.target.value)}
                      placeholder="Ej. Calle 142 # 18A-32"
                      className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Minimap representation */}
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#1a0d26] to-[#3B1C56] border border-[#3d2f4a] flex flex-col items-center justify-center p-3 relative overflow-hidden text-center">
                <div className="absolute inset-0 canvas-grid opacity-30 pointer-events-none" />
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg mb-1 animate-pulse">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">
                  Punto de Georreferenciación Automático Activo
                </span>
                <span className="text-[11px] text-emerald-300">
                  Las coordenadas quedarán asociadas para facilitar el reencuentro en el mapa
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Contact Information */}
        <div className="bg-[#271a33] rounded-3xl border border-[#3d2f4a] p-6 sm:p-8 shadow-lg space-y-6">
          <div className="border-b border-[#3d2f4a] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF1694] text-white text-xs flex items-center justify-center font-bold">3</span>
              Información de Contacto
            </h2>
            <p className="text-xs text-[#e3bdc8] mt-1">
              Tus datos permitirán contactarte cuando se detecten coincidencias en el sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-[#8e7a9f]" />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  required
                  className="w-full bg-[#150821] text-white pl-9 pr-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Número Telefónico *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-[#8e7a9f]" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ej. 3101234567"
                  required
                  className="w-full bg-[#150821] text-white pl-9 pr-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#8e7a9f]" />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  required
                  className="w-full bg-[#150821] text-white pl-9 pr-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-[#e3bdc8] leading-relaxed">
              <strong className="text-white">Aviso de Moderación:</strong> Al enviar este formulario, tu publicación pasará de inmediato a la bandeja del <strong>Administrador</strong> para ser validada contra fraudes antes de hacerse pública en la red.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isSubmitting
                ? 'bg-zinc-700 opacity-60 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#D30D9D] to-[#FF1694] hover:opacity-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analizando coincidencias y registrando reporte...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar Reporte para Autorización de Moderación</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
