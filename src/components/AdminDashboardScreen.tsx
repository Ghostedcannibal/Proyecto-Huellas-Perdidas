import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PetPublication, ShelterProfile } from '../types';
import { 
  Shield, 
  DollarSign, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  AlertCircle, 
  Check, 
  X, 
  Search, 
  Eye, 
  FileText, 
  UserCheck, 
  UserX, 
  Sparkles,
  Lock,
  ArrowRight,
  Database,
  Crown,
  Users,
  Smartphone
} from 'lucide-react';

interface AdminDashboardScreenProps {
  onNavigateHome?: () => void;
  onNavigateAuth?: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onNavigateHome,
  onNavigateAuth,
}) => {
  const { 
    currentUser,
    isAuthorizedCreator,
    publications, 
    updatePublicationStatus, 
    registeredShelters, 
    toggleShelterVerification,
    adminDonations,
    dbUsers,
    dbCreators,
    refreshDbUsers
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'stats' | 'donations' | 'moderation' | 'shelters' | 'database'>('stats');
  const [dbSubTab, setDbSubTab] = useState<'creators' | 'general'>('creators');
  const [selectedPublication, setSelectedPublication] = useState<PetPublication | null>(null);
  const [moderationFilter, setModerationFilter] = useState<'all' | 'pending_approval' | 'active' | 'resolved'>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Control estricto de acceso: Si no es el creador o la creadora autorizada, no se muestra nada del panel
  if (!currentUser || !isAuthorizedCreator) {
    if (onNavigateHome) {
      onNavigateHome();
    }
    return null;
  }

  // Cálculos estadísticos reales de la base de datos
  const totalRegistered = publications.length;
  const totalLost = publications.filter(p => p.type === 'lost').length;
  const totalFound = publications.filter(p => p.type === 'found').length;
  const totalReturned = publications.filter(p => p.status === 'resolved').length;
  const totalInAdoption = registeredShelters.length;
  const totalAdopted = 0;

  const totalDonationsAmount = adminDonations.reduce((sum, d) => sum + d.amount, 0);

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const filteredPublications = publications.filter(p => {
    if (moderationFilter === 'all') return true;
    return p.status === moderationFilter;
  });

  const pendingCount = publications.filter(p => p.status === 'pending_approval').length;

  const filteredDbCreators = dbCreators.filter(c => {
    if (!userSearchTerm) return true;
    const term = userSearchTerm.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.city.toLowerCase().includes(term)
    );
  });

  const filteredDbUsers = dbUsers.filter(u => {
    if (!userSearchTerm) return true;
    const term = userSearchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.phone.includes(term) ||
      u.city.toLowerCase().includes(term)
    );
  });

  return (
    <div id="admin-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-[#f0dbfe]">
      
      {/* Top Banner (Alto contraste y legibilidad) */}
      <div className="bg-[#271a33] p-6 sm:p-8 rounded-3xl border border-[#4a3b5a] shadow-xl text-[#f0dbfe] transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-[#FF1694]/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Consola Exclusiva de {currentUser.gender === 'femenino' ? 'la Creadora' : 'el Creador'} & Base de Datos
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
              {currentUser.gender === 'femenino' ? 'Panel de Control de la Creadora' : 'Panel de Control del Creador'}
            </h1>
            <p className="text-xs sm:text-sm text-[#f0dbfe]/90 mt-1">
              Supervisión de usuarios registrados en base de datos, moderación de avisos, validación de refugios y auditoría de donaciones.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#150821] p-1.5 rounded-2xl border border-[#4a3b5a] mobile-chip-scroll">
            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'stats'
                  ? 'bg-[#FF1694] text-white shadow-md shadow-[#FF1694]/30'
                  : 'text-[#cebdff] hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Estadísticas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'database'
                  ? 'bg-[#FF1694] text-white shadow-md shadow-[#FF1694]/30'
                  : 'text-[#cebdff] hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> Bases de Datos ({dbCreators.length + dbUsers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('donations')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'donations'
                  ? 'bg-[#FF1694] text-white shadow-md shadow-[#FF1694]/30'
                  : 'text-[#cebdff] hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Donaciones ({adminDonations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('moderation')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative shrink-0 ${
                activeTab === 'moderation'
                  ? 'bg-[#FF1694] text-white shadow-md shadow-[#FF1694]/30'
                  : 'text-[#cebdff] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Moderar Avisos
              {pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shelters')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'shelters'
                  ? 'bg-[#FF1694] text-white shadow-md shadow-[#FF1694]/30'
                  : 'text-[#cebdff] hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Refugios ({registeredShelters.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Global Statistics */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#271a33] border border-[#4a3b5a] p-4 rounded-2xl shadow-lg">
              <span className="text-[11px] font-bold text-[#cebdff] block mb-1">Total Registrados</span>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">{totalRegistered}</p>
              <span className="text-[10px] text-[#ffaed9] font-semibold">Animales en plataforma</span>
            </div>

            <div className="bg-[#271a33] border border-rose-500/40 p-4 rounded-2xl shadow-lg">
              <span className="text-[11px] font-bold text-rose-300 block mb-1">Perdidos</span>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{totalLost}</p>
              <span className="text-[10px] text-rose-200/80 font-medium">En búsqueda activa</span>
            </div>

            <div className="bg-[#271a33] border border-emerald-500/40 p-4 rounded-2xl shadow-lg">
              <span className="text-[11px] font-bold text-emerald-300 block mb-1">Encontrados</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{totalFound}</p>
              <span className="text-[10px] text-emerald-200/80 font-medium">En resguardo temporal</span>
            </div>

            <div className="bg-[#271a33] border border-[#FF1694]/50 p-4 rounded-2xl shadow-lg">
              <span className="text-[11px] font-bold text-[#ffaed9] block mb-1">Devueltos a Dueños</span>
              <p className="text-2xl sm:text-3xl font-black text-[#FF1694] font-mono">{totalReturned}</p>
              <span className="text-[10px] text-emerald-300 font-bold">🎉 Reencuentros logrados</span>
            </div>

            <div className="bg-[#271a33] border border-[#4a3b5a] p-4 rounded-2xl shadow-lg">
              <span className="text-[11px] font-bold text-[#cebdff] block mb-1">En Adopción</span>
              <p className="text-2xl sm:text-3xl font-black text-[#cebdff] font-mono">{totalInAdoption}</p>
              <span className="text-[10px] text-[#f0dbfe]/80 font-medium">Buscando hogar</span>
            </div>

            <div className="bg-[#271a33] border border-amber-500/40 p-4 rounded-2xl shadow-lg">
              <span className="text-[11px] font-bold text-amber-300 block mb-1">Adopciones Concretadas</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{totalAdopted}</p>
              <span className="text-[10px] text-amber-200 font-medium">Familias completas</span>
            </div>
          </div>

          {/* Graphical Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#271a33] rounded-3xl border border-[#4a3b5a] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FF1694]" />
                Distribución Operativa de Mascotas
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[#f0dbfe] mb-1">
                    <span>Reencuentros Exitosos</span>
                    <strong className="text-white">68%</strong>
                  </div>
                  <div className="w-full bg-[#150821] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#f0dbfe] mb-1">
                    <span>Avisos Pendientes de Moderación</span>
                    <strong className="text-white">{pendingCount} casos</strong>
                  </div>
                  <div className="w-full bg-[#150821] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, pendingCount * 25)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#f0dbfe] mb-1">
                    <span>Refugios Verificados</span>
                    <strong className="text-white">{registeredShelters.filter(s => s.verificationStatus === 'verified').length} de {registeredShelters.length}</strong>
                  </div>
                  <div className="w-full bg-[#150821] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#FF1694] h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#271a33] rounded-3xl border border-[#4a3b5a] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Resumen de Base de Datos de Usuarios
              </h3>
              <div className="space-y-2.5 text-xs text-[#f0dbfe]">
                <div className="p-3 rounded-xl bg-[#150821] border border-[#4a3b5a] flex items-center justify-between">
                  <span>Cuentas de Creadores / Admin:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {dbUsers.filter(u => u.role === 'admin' || u.isCreator).length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#150821] border border-[#4a3b5a] flex items-center justify-between">
                  <span>Personas Naturales Registradas:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {dbUsers.filter(u => u.role === 'natural').length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#150821] border border-[#4a3b5a] flex items-center justify-between">
                  <span>Refugios / Rescatistas Registrados:</span>
                  <span className="font-mono font-bold text-[#FF1694]">
                    {dbUsers.filter(u => u.role === 'shelter').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Base de Datos de Usuarios */}
      {activeTab === 'database' && (
        <div className="bg-[#271a33] rounded-3xl border border-[#4a3b5a] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4a3b5a]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Explorador de Bases de Datos
              </h2>
              <p className="text-xs text-[#f0dbfe]/80">
                Visualización de las dos bases de datos aisladas e independientes del sistema.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#cebdff]" />
                <input
                  type="text"
                  placeholder="Buscar en la base de datos..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="bg-[#150821] text-white pl-8 pr-3 py-1.5 rounded-xl border border-[#4a3b5a] text-xs focus:outline-none focus:border-[#FF1694]"
                />
              </div>
              <button
                type="button"
                onClick={refreshDbUsers}
                className="px-3 py-1.5 bg-[#150821] hover:bg-[#32243e] text-white rounded-xl text-xs font-bold border border-[#4a3b5a] cursor-pointer"
              >
                Actualizar
              </button>
            </div>
          </div>

          {/* Subtabs para seleccionar la base de datos */}
          <div className="flex gap-2 border-b border-[#4a3b5a] pb-3">
            <button
              type="button"
              onClick={() => setDbSubTab('creators')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                dbSubTab === 'creators'
                  ? 'bg-gradient-to-r from-amber-500 to-[#FF1694] text-white shadow-md'
                  : 'bg-[#150821] text-amber-300/80 hover:text-white border border-[#4a3b5a]'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Base de Datos de Creadores ({dbCreators.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setDbSubTab('general')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                dbSubTab === 'general'
                  ? 'bg-[#FF1694] text-white shadow-md'
                  : 'bg-[#150821] text-[#cebdff] hover:text-white border border-[#4a3b5a]'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Base de Datos General de Usuarios ({dbUsers.length})</span>
            </button>
          </div>

          {/* VISTA 1: BASE DE DATOS APARTE DE CREADORES */}
          {dbSubTab === 'creators' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                <span className="text-amber-200">
                  👑 Esta tabla corresponde al almacenamiento exclusivo de credenciales de Creadores (<code>creators_db</code>).
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {dbCreators.length} registros
                </span>
              </div>

              {filteredDbCreators.length === 0 ? (
                <div className="p-8 text-center bg-[#150821] rounded-2xl border border-[#4a3b5a]">
                  <p className="text-xs text-[#cebdff]">
                    No se encontraron registros de creadores en esta base de datos con el filtro actual.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#4a3b5a] text-[#cebdff]">
                        <th className="py-3 px-4 font-bold">Creador/a</th>
                        <th className="py-3 px-4 font-bold">Correo Oficial</th>
                        <th className="py-3 px-4 font-bold">Teléfono</th>
                        <th className="py-3 px-4 font-bold">Ciudad</th>
                        <th className="py-3 px-4 font-bold">Género</th>
                        <th className="py-3 px-4 font-bold">Distintivo Oficial</th>
                        <th className="py-3 px-4 font-bold">Base de Datos</th>
                        <th className="py-3 px-4 font-bold">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4a3b5a]">
                      {filteredDbCreators.map((creator) => (
                        <tr key={creator.id} className="hover:bg-[#150821]/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            {creator.fullName}
                          </td>
                          <td className="py-3 px-4 text-[#f0dbfe] font-mono text-[11px]">
                            {creator.email}
                          </td>
                          <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">
                            {creator.phone}
                          </td>
                          <td className="py-3 px-4 text-[#cebdff]">
                            {creator.city}
                          </td>
                          <td className="py-3 px-4 text-[#cebdff]">
                            {creator.gender === 'femenino' ? '👩 Femenino' : creator.gender === 'masculino' ? '👨 Masculino' : '🧑 Otro'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-[#FF1694] text-white">
                              <Crown className="w-3 h-3" /> {creator.gender === 'femenino' ? 'Creadora' : 'Creador'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-amber-300">
                            creators_db
                          </td>
                          <td className="py-3 px-4 text-[11px] text-[#cebdff] font-mono">
                            {creator.createdAt || '2026-01-01'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VISTA 2: BASE DE DATOS GENERAL DE USUARIOS */}
          {dbSubTab === 'general' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#150821] border border-[#4a3b5a] flex items-center justify-between text-xs">
                <span className="text-[#cebdff]">
                  👥 Esta tabla corresponde al almacenamiento de usuarios comunitarios (personas naturales y refugios).
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {dbUsers.length} registros
                </span>
              </div>

              {filteredDbUsers.length === 0 ? (
                <div className="p-8 text-center bg-[#150821] rounded-2xl border border-[#4a3b5a]">
                  <p className="text-xs text-[#cebdff]">
                    No se encontraron usuarios en la base de datos general con el filtro actual.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#4a3b5a] text-[#cebdff]">
                        <th className="py-3 px-4 font-bold">Usuario</th>
                        <th className="py-3 px-4 font-bold">Correo Electrónico</th>
                        <th className="py-3 px-4 font-bold">Teléfono (SMS)</th>
                        <th className="py-3 px-4 font-bold">Ciudad</th>
                        <th className="py-3 px-4 font-bold">Género</th>
                        <th className="py-3 px-4 font-bold">Rol en Base de Datos</th>
                        <th className="py-3 px-4 font-bold">Privilegios</th>
                        <th className="py-3 px-4 font-bold">Fecha Registro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4a3b5a]">
                      {filteredDbUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#150821]/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#150821] border border-[#4a3b5a] flex items-center justify-center font-bold text-white text-xs">
                                {user.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-white">{user.fullName}</p>
                                {user.shelterName && (
                                  <p className="text-[10px] text-amber-300">{user.shelterName}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#f0dbfe] font-mono text-[11px]">
                            {user.email}
                          </td>
                          <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">
                            <div className="flex items-center gap-1">
                              <Smartphone className="w-3 h-3 text-emerald-400" />
                              <span>{user.phone}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#cebdff]">
                            {user.city}
                          </td>
                          <td className="py-3 px-4 text-[#cebdff]">
                            {user.gender === 'femenino' ? '👩 Femenino' : user.gender === 'masculino' ? '👨 Masculino' : '🧑 Otro'}
                          </td>
                          <td className="py-3 px-4">
                            {user.role === 'admin' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF1694]/20 text-[#ffaed9] border border-[#FF1694]/40">
                                admin
                              </span>
                            ) : user.role === 'shelter' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                shelter
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                natural
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] text-[#cebdff]/80">
                              Usuario Comunitario
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-[#cebdff] font-mono">
                            {user.createdAt || '2026-01-01'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Audited Donations */}
      {activeTab === 'donations' && (
        <div className="bg-[#271a33] rounded-3xl border border-[#4a3b5a] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4a3b5a]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Auditoría Fiduciaria de Donaciones
              </h2>
              <p className="text-xs text-[#f0dbfe]/80">
                Todas las donaciones son administradas con trazabilidad pública y facturas veterinarias directas.
              </p>
            </div>
            <div className="p-3 bg-[#150821] rounded-2xl border border-emerald-500/40">
              <span className="text-[10px] font-bold text-emerald-300 block">Total Recaudado</span>
              <span className="text-lg font-black text-white font-mono">{formatCOP(totalDonationsAmount)}</span>
            </div>
          </div>

          {adminDonations.length === 0 ? (
            <div className="p-8 text-center bg-[#150821] rounded-2xl border border-[#4a3b5a] space-y-2">
              <p className="text-sm font-bold text-white">No hay transacciones de donaciones en la base de datos.</p>
              <p className="text-xs text-[#cebdff]">Los aportes fiduciarios realizados por la comunidad aparecerán registrados aquí de forma auditada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#4a3b5a] text-[#cebdff]">
                    <th className="py-3 px-4 font-bold">ID / Fecha</th>
                    <th className="py-3 px-4 font-bold">Caso Destino</th>
                    <th className="py-3 px-4 font-bold">Donante</th>
                    <th className="py-3 px-4 font-bold">Monto</th>
                    <th className="py-3 px-4 font-bold">Método</th>
                    <th className="py-3 px-4 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4a3b5a]">
                  {adminDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-[#150821]/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#ffaed9]">
                        {donation.id} <br />
                        <span className="text-[10px] text-[#cebdff]">{donation.date}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {donation.caseTitle}
                      </td>
                      <td className="py-3 px-4 text-[#f0dbfe]">
                        {donation.donorName}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {formatCOP(donation.amount)}
                      </td>
                      <td className="py-3 px-4 text-[#cebdff]">
                        {donation.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        {donation.status === 'received_by_admin' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Recibido en Fiducia
                          </span>
                        )}
                        {donation.status === 'disbursed_to_vet' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            Desembolsado a Veterinaria
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Moderation of Notices */}
      {activeTab === 'moderation' && (
        <div className="bg-[#271a33] rounded-3xl border border-[#4a3b5a] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4a3b5a]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF1694]" />
                Bandeja de Moderación de Avisos
              </h2>
              <p className="text-xs text-[#f0dbfe]/80">
                Audita y aprueba o rechaza los reportes subidos por personas naturales y albergues para evitar estafas.
              </p>
            </div>

            <div className="flex gap-2">
              {(['all', 'pending_approval', 'active', 'resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setModerationFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    moderationFilter === filter
                      ? 'bg-[#FF1694] text-white'
                      : 'bg-[#150821] text-[#cebdff] hover:text-white border border-[#4a3b5a]'
                  }`}
                >
                  {filter === 'all' && 'Todos'}
                  {filter === 'pending_approval' && `Por Aprobar (${pendingCount})`}
                  {filter === 'active' && 'Activos'}
                  {filter === 'resolved' && 'Resueltos'}
                </button>
              ))}
            </div>
          </div>

          {filteredPublications.length === 0 ? (
            <div className="p-8 text-center bg-[#150821] rounded-2xl border border-[#4a3b5a] space-y-2">
              <p className="text-sm font-bold text-white">No hay avisos para moderar en este filtro.</p>
              <p className="text-xs text-[#cebdff]">Cuando un usuario registrado publique un reporte, aparecerá aquí para su aprobación o rechazo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPublications.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-[#150821] rounded-2xl border border-[#4a3b5a] p-5 space-y-4 hover:border-[#FF1694]/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={pub.imageUrl}
                          alt={pub.petName}
                          className="w-16 h-16 rounded-xl object-cover border border-[#4a3b5a]"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffaed9]">
                            {pub.type === 'lost' ? 'Mascota Perdida' : 'Mascota Encontrada'}
                          </span>
                          <h3 className="text-base font-bold text-white">{pub.petName}</h3>
                          <p className="text-xs text-[#cebdff]">{pub.species} • {pub.breed}</p>
                        </div>
                      </div>

                      {pub.status === 'pending_approval' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> En Revisión
                        </span>
                      )}
                      {pub.status === 'active' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Aprobado
                        </span>
                      )}
                      {pub.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rechazado
                        </span>
                      )}
                    </div>

                    {/* Registered Form Details */}
                    <div className="bg-[#271a33] p-4 rounded-2xl border border-[#4a3b5a] space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-[#f0dbfe]">
                        <div>
                          <strong className="text-white">Color:</strong> {pub.color || 'No especificado'}
                        </div>
                        <div>
                          <strong className="text-white">Sexo / Tamaño:</strong> {pub.sex || 'Macho'} • {pub.size || 'Mediano'}
                        </div>
                        <div>
                          <strong className="text-white">Ubicación:</strong> {pub.neighborhood}, {pub.city}
                        </div>
                        <div>
                          <strong className="text-white">Fecha / Hora:</strong> {pub.date} {pub.time && `• ${pub.time}`}
                        </div>
                      </div>

                      <div>
                        <strong className="text-white">Lugar exacto del avistamiento:</strong>{' '}
                        <span className="text-[#ffaed9] font-medium">{pub.lastSeenOrFoundLocation || 'No detallado'}</span>
                      </div>

                      {pub.type === 'found' && pub.currentLocationType && (
                        <div className="pt-1 text-[11px] text-emerald-300">
                          <strong>Ubicación actual:</strong>{' '}
                          {pub.currentLocationType === 'shelter'
                            ? `En Refugio (${pub.shelterName || 'No especificado'} - ${pub.shelterAddress || ''})`
                            : 'En Hogar de paso'}
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#4a3b5a]/70">
                        <strong className="text-white">Descripción física:</strong>
                        <p className="text-[#f0dbfe]/90 mt-0.5 leading-relaxed">{pub.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#4a3b5a]/70 flex flex-wrap items-center justify-between text-[11px]">
                        <span className="text-[#cebdff]">
                          Contacto: <strong className="text-white">{pub.contactName}</strong>
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">{pub.contactPhone}</span>
                        <span className="text-[#cebdff]">{pub.contactEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {pub.status !== 'active' && (
                      <button
                        type="button"
                        onClick={() => updatePublicationStatus(pub.id, 'active')}
                        className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow"
                      >
                        <Check className="w-4 h-4" />
                        <span>Autorizar Publicación</span>
                      </button>
                    )}
                    {pub.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => updatePublicationStatus(pub.id, 'rejected')}
                        className="py-2.5 px-3 bg-[#271a33] hover:bg-rose-950/50 text-rose-300 border border-rose-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Rechazar</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Shelter Verification & Management */}
      {activeTab === 'shelters' && (
        <div className="bg-[#271a33] rounded-3xl border border-[#4a3b5a] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="pb-4 border-b border-[#4a3b5a]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#FF1694]" />
              Gestión y Verificación Oficial de Refugios
            </h2>
            <p className="text-xs text-[#f0dbfe]/80">
              Lista de refugios y rescatistas inscritos en la plataforma. Modifica su estado para validar ante la comunidad su autenticidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredShelters.map((shelter) => (
              <div
                key={shelter.id}
                className="bg-[#150821] rounded-2xl border border-[#4a3b5a] p-5 flex flex-col justify-between space-y-4 hover:border-[#FF1694]/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#271a33] border border-[#4a3b5a] flex items-center justify-center text-[#FF1694]">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{shelter.name}</h3>
                        <p className="text-[11px] text-[#cebdff]">{shelter.city} • {shelter.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status Badge */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[#cebdff]">Estado de auditoría:</span>
                    {shelter.verificationStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Clock className="w-3.5 h-3.5" /> No verificado
                      </span>
                    )}
                  </div>

                  {/* Shelter Details */}
                  <div className="bg-[#271a33] p-3 rounded-xl border border-[#4a3b5a] text-xs space-y-1 text-[#f0dbfe]">
                    <p><strong className="text-white">NIT / Registro:</strong> {shelter.registrationNumber}</p>
                    <p><strong className="text-white">Director:</strong> {shelter.contactPerson}</p>
                    <p><strong className="text-white">Teléfono:</strong> {shelter.phone}</p>
                    <p><strong className="text-white">Capacidad:</strong> {shelter.animalCapacity} animales</p>
                  </div>
                </div>

                {/* Change verification button */}
                <div>
                  {shelter.verificationStatus === 'verified' ? (
                    <button
                      type="button"
                      onClick={() => toggleShelterVerification(shelter.id)}
                      className="w-full py-2.5 px-3 bg-[#271a33] hover:bg-rose-950/50 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Revocar / Marcar «No verificado»</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleShelterVerification(shelter.id)}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Auditar y Cambiar a «Verificado»</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
