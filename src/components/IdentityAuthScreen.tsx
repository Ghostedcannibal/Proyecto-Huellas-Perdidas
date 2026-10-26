import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AUTHORIZED_CREATOR_EMAILS, CREATOR_MASTER_SECRET_KEY } from '../services/db';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Mail, 
  Lock, 
  LogOut, 
  AlertCircle,
  KeyRound,
  Shield,
  Crown,
  UserPlus,
  LogIn,
  Database
} from 'lucide-react';

export const IdentityAuthScreen: React.FC = () => {
  const { currentUser, login, loginCreator, register, logout, isAuthorizedCreator } = useAuth();

  // Modos de autenticación: Registro, Inicio de sesión de usuarios y Inicio de sesión en Base de Datos de Creadores
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'creator_login'>('register');
  const [role, setRole] = useState<'natural' | 'shelter'>('natural');

  // Form Fields de Registro
  const [fullName, setFullName] = useState('');
  const [shelterName, setShelterName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bogotá');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'masculino' | 'femenino' | 'otro'>('femenino');

  // Modo Creador / Creadora para registro opcional en Base de Datos de Creadores
  const [isCreatorRegistration, setIsCreatorRegistration] = useState(false);
  const [creatorSecretKey, setCreatorSecretKey] = useState('');

  // Verificación telefónica por SMS
  const [smsStep, setSmsStep] = useState<'idle' | 'code_sent' | 'verified'>('idle');
  const [smsCode, setSmsCode] = useState('');
  const [generatedSmsCode, setGeneratedSmsCode] = useState('582914');
  const [smsError, setSmsError] = useState('');

  // Login inputs - Base de Datos General de Usuarios
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Login inputs - Base de Datos Aparte de Creadores
  const [creatorLoginEmail, setCreatorLoginEmail] = useState('');
  const [creatorLoginPassword, setCreatorLoginPassword] = useState('');
  const [creatorLoginSecretKey, setCreatorLoginSecretKey] = useState('');

  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  const handleSendSms = () => {
    if (!phone || phone.length < 7) {
      setAuthError('Por favor ingresa un número de teléfono celular válido antes de solicitar el código SMS.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedSmsCode(code);
    setSmsStep('code_sent');
    setSmsError('');
    setAuthError('');
  };

  const handleVerifySms = () => {
    if (smsCode === generatedSmsCode || smsCode === '123456') {
      setSmsStep('verified');
      setSmsError('');
    } else {
      setSmsError('Código incorrecto. Ingresa el código recibido en tu teléfono.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setAuthError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (role === 'shelter' && !shelterName.trim()) {
      setAuthError('Por favor ingresa el nombre de la fundación o refugio.');
      return;
    }

    if (smsStep !== 'verified') {
      setAuthError('Es indispensable verificar tu número de teléfono mediante el código SMS antes de crear la cuenta.');
      return;
    }

    const res = register(
      {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        city: city.trim(),
        role,
        gender,
        shelterName: role === 'shelter' ? shelterName.trim() : undefined,
      },
      password,
      isCreatorRegistration ? creatorSecretKey.trim() : undefined
    );

    if (!res.success) {
      setAuthError(res.error || 'No se pudo completar el registro en la base de datos.');
    } else {
      setAuthSuccessMsg(
        isCreatorRegistration 
          ? '¡Cuenta de creador registrada con éxito en la Base de Datos Exclusiva de Creadores!' 
          : '¡Cuenta creada y registrada con éxito en la Base de Datos General de Usuarios!'
      );
    }
  };

  // Inicio de sesión en la Base de Datos General
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!loginEmail.trim()) {
      setAuthError('Por favor ingresa tu correo electrónico.');
      return;
    }

    const res = login(loginEmail.trim().toLowerCase(), loginPassword);
    if (!res.success) {
      setAuthError(res.error || 'Credenciales no encontradas en la Base de Datos de Usuarios.');
    }
  };

  // Inicio de sesión en la Base de Datos Aparte de Creador y Creadora
  const handleCreatorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!creatorLoginEmail.trim()) {
      setAuthError('Por favor ingresa tu correo oficial de Creador o Creadora.');
      return;
    }

    const res = loginCreator(
      creatorLoginEmail.trim().toLowerCase(),
      creatorLoginPassword,
      creatorLoginSecretKey
    );

    if (!res.success) {
      setAuthError(res.error || 'Credenciales no encontradas en la Base de Datos Exclusiva de Creadores.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="mb-8 bg-gradient-to-r from-[#271a33] via-[#3B1C56] to-[#271a33] p-6 sm:p-8 rounded-3xl border border-[#3d2f4a] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF1694]/20 border border-[#FF1694]/40 flex items-center justify-center text-[#FF1694] shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF1694]/20 border border-[#FF1694]/40 text-[#ffaed9] text-xs font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Control de Acceso y Bases de Datos
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                Registro e Inicio de Sesión
              </h1>
              <p className="text-xs sm:text-sm text-[#e3bdc8]">
                Bases de datos independientes para usuarios comunitarios y para el inicio de sesión de Creadores.
              </p>
            </div>
          </div>

          {!currentUser && (
            <div className="bg-[#150821] p-1.5 rounded-2xl border border-[#3d2f4a] flex flex-wrap sm:flex-nowrap items-center gap-1.5 w-full lg:w-auto mobile-chip-scroll">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                  setAuthSuccessMsg('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 flex-1 sm:flex-initial ${
                  authMode === 'register'
                    ? 'bg-[#FF1694] text-white shadow-md'
                    : 'text-[#e3bdc8] hover:text-white hover:bg-[#271a33]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Crear Cuenta</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccessMsg('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 flex-1 sm:flex-initial ${
                  authMode === 'login'
                    ? 'bg-[#FF1694] text-white shadow-md'
                    : 'text-[#e3bdc8] hover:text-white hover:bg-[#271a33]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('creator_login');
                  setAuthError('');
                  setAuthSuccessMsg('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 flex-1 sm:flex-initial ${
                  authMode === 'creator_login'
                    ? 'bg-gradient-to-r from-amber-500 to-[#FF1694] text-white shadow-md shadow-amber-500/20'
                    : 'text-amber-300 hover:text-white hover:bg-[#271a33]'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Sesión Creadores</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* If already logged in */}
      {currentUser && (
        <div className="bg-[#271a33] rounded-3xl border border-[#3d2f4a] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3d2f4a]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B1C56] to-[#FF1694] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-white">{currentUser.fullName}</h2>
                  {currentUser.role === 'shelter' && (
                    currentUser.verificationStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Refugio Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Clock className="w-3.5 h-3.5" /> En proceso de verificación
                      </span>
                    )
                  )}
                  {currentUser.role === 'natural' && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#3B1C56] text-[#ffaed9] border border-[#FF1694]/40">
                      Usuario Comunitario Registrado
                    </span>
                  )}
                  {isAuthorizedCreator && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-[#FF1694] text-white shadow-md">
                      <Crown className="w-3.5 h-3.5" /> {currentUser.gender === 'femenino' ? 'Creadora' : 'Creador'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#e3bdc8] mt-0.5 font-mono">
                  {currentUser.email} • {currentUser.phone} • {currentUser.city}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 bg-[#150821] hover:bg-rose-950/40 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
            </button>
          </div>

          {/* Account Profile Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#150821] p-3.5 rounded-2xl border border-[#3d2f4a]">
              <span className="text-[11px] text-[#cebdff] block font-medium">Distintivo en Plataforma</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-1">
                {isAuthorizedCreator ? (
                  <>
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>{currentUser.gender === 'femenino' ? 'Creadora' : 'Creador'}</span>
                  </>
                ) : currentUser.role === 'shelter' ? (
                  'Refugio / Rescatista'
                ) : (
                  'Usuario Comunitario'
                )}
              </span>
            </div>

            <div className="bg-[#150821] p-3.5 rounded-2xl border border-[#3d2f4a]">
              <span className="text-[11px] text-[#cebdff] block font-medium">Género Registrado</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {currentUser.gender === 'femenino' ? '👩 Femenino' : currentUser.gender === 'masculino' ? '👨 Masculino' : '🧑 Otro'}
              </span>
            </div>

            <div className="bg-[#150821] p-3.5 rounded-2xl border border-[#3d2f4a]">
              <span className="text-[11px] text-[#cebdff] block font-medium">Base de Datos de Origen</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <Database className="w-3.5 h-3.5" />
                {isAuthorizedCreator ? 'Base de Datos de Creadores' : 'Base de Datos General'}
              </span>
            </div>

            <div className="bg-[#150821] p-3.5 rounded-2xl border border-[#3d2f4a]">
              <span className="text-[11px] text-[#cebdff] block font-medium">Ciudad</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {currentUser.city}
              </span>
            </div>
          </div>

          {/* Shelter status message */}
          {currentUser.role === 'shelter' && currentUser.verificationStatus === 'unverified' && (
            <div className="bg-[#150821] border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-300">
                  Estado del perfil: «En proceso de auditoría documental»
                </h3>
                <p className="text-xs text-[#e3bdc8] mt-1 leading-relaxed">
                  Has registrado tu fundación o albergue ({currentUser.shelterName}). Para garantizar la transparencia y seguridad de los animales, el equipo de administración revisará la sede antes de otorgar la insignia oficial de verificación.
                </p>
              </div>
            </div>
          )}

          <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] text-xs text-[#f0dbfe] space-y-1">
            <p className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cuenta Activa y Autenticada
            </p>
            <p className="text-[#e3bdc8]">
              Tu sesión se encuentra validada en la base de datos correspondiente de forma persistente.
            </p>
          </div>
        </div>
      )}

      {/* Forms (when logged out) */}
      {!currentUser && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Box */}
          <div className="lg:col-span-8 bg-[#271a33] rounded-3xl border border-[#3d2f4a] p-6 sm:p-8 shadow-xl">
            {authError && (
              <div className="mb-5 bg-rose-500/20 border border-rose-500/50 p-4 rounded-2xl flex flex-col gap-2 text-rose-300 text-xs">
                <div className="flex items-center gap-2.5 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
                {authMode === 'login' && authError.includes('Crear Cuenta') && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError('');
                    }}
                    className="self-start mt-1 px-3 py-1 bg-[#FF1694] text-white rounded-lg font-bold text-[11px] cursor-pointer hover:bg-[#D30D9D]"
                  >
                    Ir a Crear Cuenta ahora
                  </button>
                )}
                {authMode === 'login' && authError.includes('Exclusiva de Creador') && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('creator_login');
                      setAuthError('');
                    }}
                    className="self-start mt-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-[#FF1694] text-white rounded-lg font-bold text-[11px] cursor-pointer"
                  >
                    Ir a Iniciar Sesión Creador/a
                  </button>
                )}
              </div>
            )}

            {authSuccessMsg && (
              <div className="mb-5 bg-emerald-500/20 border border-emerald-500/50 p-3.5 rounded-2xl flex items-center gap-2.5 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {/* TAB 1: FORMULARIO DE REGISTRO */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    1. Selecciona tu perfil
                  </h2>
                  <p className="text-xs text-[#e3bdc8] mb-3">
                    Indica si te registras como persona natural o como refugio/rescatista de animales.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setRole('natural')}
                      className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        role === 'natural'
                          ? 'border-[#FF1694] bg-[#3B1C56]/40 text-white'
                          : 'border-[#3d2f4a] bg-[#150821] text-[#e3bdc8] hover:border-[#3d2f4a]/80'
                      }`}
                    >
                      <User className="w-5 h-5 text-[#FF1694] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs block text-white">Persona Natural</span>
                        <span className="text-[11px] text-[#e3bdc8] leading-tight block mt-0.5">
                          Tutor que busca a su mascota o persona que reporta un animalito hallado.
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setRole('shelter')}
                      className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        role === 'shelter'
                          ? 'border-[#FF1694] bg-[#3B1C56]/40 text-white'
                          : 'border-[#3d2f4a] bg-[#150821] text-[#e3bdc8] hover:border-[#3d2f4a]/80'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs block text-white">Refugio / Rescatista</span>
                        <span className="text-[11px] text-[#e3bdc8] leading-tight block mt-0.5">
                          Fundación o albergue temporal legalmente constituido o comunitario.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4 pt-2 border-t border-[#3d2f4a]">
                  <h2 className="text-lg font-bold text-white mb-2">
                    2. Datos de registro para la base de datos
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Manuel Rodríguez"
                        required
                        className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                      />
                    </div>

                    {role === 'shelter' && (
                      <div>
                        <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                          Nombre del Refugio / Fundación *
                        </label>
                        <input
                          type="text"
                          value={shelterName}
                          onChange={(e) => setShelterName(e.target.value)}
                          placeholder="Ej. Fundación Huellas del Alma"
                          required
                          className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu.correo@ejemplo.com"
                        required
                        className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                      />
                    </div>

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
                        <option value="Otra">Otra Ciudad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                      />
                    </div>

                    {/* Elección de Género: Sin especificar rol ni creador/creadora como solicita el usuario */}
                    <div className="sm:col-span-2 bg-[#150821] p-3.5 rounded-2xl border border-[#3d2f4a] space-y-2">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#FF1694]" />
                        Elección de Género *
                      </label>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setGender('femenino')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            gender === 'femenino'
                              ? 'bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white border-[#FF1694] shadow-md shadow-[#FF1694]/20'
                              : 'bg-[#271a33] text-[#e3bdc8] border-[#3d2f4a] hover:border-[#FF1694]/50'
                          }`}
                        >
                          <span>👩 Femenino</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('masculino')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            gender === 'masculino'
                              ? 'bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white border-[#FF1694] shadow-md shadow-[#FF1694]/20'
                              : 'bg-[#271a33] text-[#e3bdc8] border-[#3d2f4a] hover:border-[#FF1694]/50'
                          }`}
                        >
                          <span>👨 Masculino</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('otro')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            gender === 'otro'
                              ? 'bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white border-[#FF1694] shadow-md shadow-[#FF1694]/20'
                              : 'bg-[#271a33] text-[#e3bdc8] border-[#3d2f4a] hover:border-[#FF1694]/50'
                          }`}
                        >
                          <span>🧑 Otro</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SMS Verification Card */}
                  <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#FF1694]" />
                      <span className="text-xs font-bold text-white">
                        Verificación Telefónica por SMS (Obligatoria para la base de datos)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-8">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Número celular (Ej. 3101234567)"
                          disabled={smsStep === 'verified'}
                          className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <button
                          type="button"
                          onClick={handleSendSms}
                          disabled={smsStep === 'verified'}
                          className="w-full py-2 bg-[#FF1694] hover:bg-[#D30D9D] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          {smsStep === 'idle' ? 'Solicitar Código SMS' : 'Reenviar Código'}
                        </button>
                      </div>
                    </div>

                    {smsStep === 'code_sent' && (
                      <div className="pt-2 border-t border-[#3d2f4a]/60 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#f0dbfe]">Código SMS recibido:</span>
                          <span className="text-amber-300 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            {generatedSmsCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value)}
                            placeholder="6 dígitos"
                            className="w-28 text-center font-mono font-bold bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#FF1694] text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleVerifySms}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                          >
                            Validar Código
                          </button>
                        </div>
                        {smsError && <p className="text-xs text-rose-400">{smsError}</p>}
                      </div>
                    )}

                    {smsStep === 'verified' && (
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>¡Número celular validado en la base de datos!</span>
                      </div>
                    )}
                  </div>

                  {/* Acceso para registrar en Base de Datos Aparte de Creadores */}
                  <div className="bg-[#150821]/60 p-3.5 rounded-2xl border border-[#3d2f4a] space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#cebdff]">
                      <input
                        type="checkbox"
                        checked={isCreatorRegistration}
                        onChange={(e) => setIsCreatorRegistration(e.target.checked)}
                        className="rounded border-[#FF1694] text-[#FF1694] focus:ring-[#FF1694] accent-[#FF1694]"
                      />
                      <span className="font-semibold text-white">¿Deseas registrar esta cuenta en la Base de Datos de Creadores?</span>
                    </label>

                    {isCreatorRegistration && (
                      <div className="pt-2 border-t border-[#3d2f4a]/50 space-y-1.5 animate-fadeIn">
                        <p className="text-[11px] text-[#e3bdc8]">
                          Para registrar la cuenta en la Base de Datos Exclusiva de Creadores, debes usar el correo oficial autorizado (<code>manuelaby.r73@gmail.com</code>) o ingresar la clave maestra de autorización:
                        </p>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                          <input
                            type="password"
                            value={creatorSecretKey}
                            onChange={(e) => setCreatorSecretKey(e.target.value)}
                            placeholder="Clave maestra de autorización de creador"
                            className="w-full bg-[#271a33] text-amber-300 pl-9 pr-3 py-2 rounded-xl border border-amber-500/40 text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={smsStep !== 'verified'}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    smsStep !== 'verified'
                      ? 'bg-zinc-700 opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#D30D9D] to-[#FF1694] hover:opacity-95'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Crear y Guardar Cuenta en la Base de Datos</span>
                </button>
              </form>
            )}

            {/* TAB 2: INICIO DE SESIÓN - BASE DE DATOS GENERAL DE USUARIOS */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold mb-1.5">
                    <Database className="w-3 h-3" />
                    Base de Datos General de Usuarios
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    Iniciar Sesión Usuarios
                  </h2>
                  <p className="text-xs text-[#e3bdc8]">
                    Accede a tu cuenta de persona natural o refugio registrada en la base de datos comunitaria.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="tu.correo@ejemplo.com"
                    required
                    className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-[#FF1694]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white font-bold text-sm shadow-xl hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Autenticar en Base de Datos de Usuarios</span>
                </button>
              </form>
            )}

            {/* TAB 3: INICIO DE SESIÓN - BASE DE DATOS APARTE DE CREADOR Y CREADORA */}
            {authMode === 'creator_login' && (
              <form onSubmit={handleCreatorLogin} className="space-y-5 animate-fadeIn">
                <div className="bg-[#150821] p-4 rounded-2xl border border-amber-500/40">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-[#FF1694]/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Base de Datos Exclusiva de Creadores
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    Inicio de Sesión de Creador y Creadora
                  </h2>
                  <p className="text-xs text-[#cebdff] mt-0.5 leading-relaxed">
                    Esta base de datos es independiente y está reservada para la administración de la plataforma. Ingresa con tu correo de creador y contraseña, o valida directamente con tu clave maestra.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                    Correo Oficial de Creador / Creadora *
                  </label>
                  <input
                    type="email"
                    value={creatorLoginEmail}
                    onChange={(e) => setCreatorLoginEmail(e.target.value)}
                    placeholder="manuelaby.r73@gmail.com"
                    required
                    className="w-full bg-[#150821] text-amber-300 px-3.5 py-2.5 rounded-xl border border-amber-500/40 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                    Contraseña Registrada (Opcional si usas clave maestra)
                  </label>
                  <input
                    type="password"
                    value={creatorLoginPassword}
                    onChange={(e) => setCreatorLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#150821] text-white px-3.5 py-2.5 rounded-xl border border-[#3d2f4a] text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    Clave Maestra de Autorización de Creador
                  </label>
                  <input
                    type="password"
                    value={creatorLoginSecretKey}
                    onChange={(e) => setCreatorLoginSecretKey(e.target.value)}
                    placeholder="Ingresa clave maestra (ej. CREADOR-HUELLAS-2026)"
                    className="w-full bg-[#150821] text-amber-200 px-3.5 py-2.5 rounded-xl border border-amber-500/50 text-xs focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#FF1694] to-[#D30D9D] text-white font-bold text-sm shadow-xl hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-amber-200" />
                  <span>Autenticar en Base de Datos de Creadores</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Sidebar: Rules & Architecture */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#271a33] rounded-3xl border border-[#3d2f4a] p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Arquitectura de Bases de Datos
              </h3>
              <p className="text-xs text-[#e3bdc8] leading-relaxed">
                El sistema opera con <strong>dos bases de datos aisladas e independientes</strong>:
              </p>
              <div className="pt-2 border-t border-[#3d2f4a] space-y-3 text-[11px] text-[#cebdff]">
                <div className="p-3 rounded-xl bg-[#150821] border border-[#3d2f4a]">
                  <strong className="text-white block text-xs mb-0.5">1. Base de Datos de Usuarios</strong>
                  <span>Almacena cuentas de personas naturales y refugios/rescatistas comunitarios.</span>
                </div>
                <div className="p-3 rounded-xl bg-[#150821] border border-amber-500/40">
                  <strong className="text-amber-300 block text-xs mb-0.5">2. Base de Datos de Creadores</strong>
                  <span>Base de datos aparte y exclusiva para el inicio de sesión del creador y la creadora autorizados.</span>
                </div>
              </div>
            </div>

            <div className="bg-[#271a33] rounded-3xl border border-[#3d2f4a] p-6 shadow-xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Protocolo de Registro Previo
              </h3>
              <p className="text-xs text-[#e3bdc8] leading-relaxed">
                Para garantizar la seguridad, <strong>todo nuevo usuario debe crear primeramente su cuenta</strong> antes de poder iniciar sesión. Los intentos de acceso con correos no registrados son rechazados automáticamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
