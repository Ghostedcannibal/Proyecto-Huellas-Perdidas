import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { ASSETS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Home,
  Search, 
  Megaphone, 
  MessageSquare, 
  HeartHandshake, 
  PawPrint, 
  LayoutDashboard,
  Menu, 
  X, 
  Bell,
  Sun,
  Moon,
  User,
  CheckCircle2,
  Clock,
  Crown
} from 'lucide-react';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onSelectScreen,
  unreadCount = 2,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentUser, isAuthorizedCreator } = useAuth();

  const navItems: Array<{ id: ActiveScreen; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'home', label: 'Inicio', icon: <Home className="w-4 h-4" /> },
    { id: 'report', label: 'Reportar Mascota', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat Cifrado', icon: <MessageSquare className="w-4 h-4" />, badge: unreadCount > 0 ? `${unreadCount}` : undefined },
    { id: 'donations', label: 'Donaciones Auditadas', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'adoption', label: 'Adopciones', icon: <PawPrint className="w-4 h-4" /> },
    ...(isAuthorizedCreator 
      ? [{ 
          id: 'admin' as ActiveScreen, 
          label: currentUser?.gender === 'femenino' ? 'Consola de la Creadora' : 'Consola del Creador', 
          icon: <LayoutDashboard className="w-4 h-4" />, 
          badge: currentUser?.gender === 'femenino' ? 'Creadora' : 'Creador' 
        }] 
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1a0d26]/95 backdrop-blur-md border-b border-[#3d2f4a] transition-colors duration-200">
      {/* Main Bar: Logo on Left, Action items on Right */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Logo & Brand */}
        <div 
          onClick={() => onSelectScreen('home')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <img 
            src={ASSETS.logo} 
            alt="Huellas Perdidas" 
            className="h-10 sm:h-11 w-auto object-contain logo-theme-adaptive transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                HUELLAS<span className="text-[#FF1694]">PERDIDAS</span>
              </span>
            </div>
            <p className="text-[11px] text-[#e3bdc8] -mt-0.5 hidden sm:block">
              Red colaborativa de búsqueda y rescate de animales domésticos
            </p>
          </div>
        </div>

        {/* Right side CTA & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick "Reportar Mascota" button */}
          <button
            type="button"
            onClick={() => onSelectScreen('report')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D30D9D] to-[#FF1694] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#FF1694]/20 transition-all cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Reportar Mascota</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative px-2.5 py-1.5 rounded-lg bg-[#271a33] text-[#e3bdc8] hover:text-white hover:bg-[#32243e] border border-[#3d2f4a] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Cambiar tema de color"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
                <span className="text-[11px] font-semibold hidden md:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#8a38b5] transition-transform hover:-rotate-12" />
                <span className="text-[11px] font-semibold hidden md:inline">Oscuro</span>
              </>
            )}
          </button>

          {/* Quick Chat Alert */}
          <button 
            onClick={() => onSelectScreen('chat')}
            className="relative p-2 rounded-lg bg-[#271a33] text-[#e3bdc8] hover:text-white hover:bg-[#32243e] border border-[#3d2f4a] transition-colors cursor-pointer"
            title="Chat de la Comunidad"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF1694] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Auth Portal Button: Silueta de una persona en el top de la página */}
          <button
            id="nav-auth-btn"
            onClick={() => onSelectScreen('auth')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-sm ${
              activeScreen === 'auth'
                ? 'bg-[#FF1694] text-white border-[#FF1694]'
                : currentUser
                ? 'bg-[#271a33] text-white border-[#FF1694]/60 hover:bg-[#32243e]'
                : 'bg-gradient-to-r from-[#3B1C56] to-[#271a33] text-[#f0dbfe] border-[#3d2f4a] hover:border-[#FF1694]'
            }`}
            title="Registro e inicio de sesión"
          >
            <div className="w-6 h-6 rounded-full bg-[#FF1694]/20 flex items-center justify-center border border-[#FF1694]/40">
              <User className="w-3.5 h-3.5 text-[#FF1694]" />
            </div>
            <div className="text-left hidden md:block">
              {currentUser ? (
                <div className="flex items-center gap-1.5">
                  <span className="max-w-[110px] truncate">{currentUser.fullName.split(' ')[0]}</span>
                  {isAuthorizedCreator && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-[#FF1694] text-white font-bold">
                      <Crown className="w-2.5 h-2.5" /> {currentUser?.gender === 'femenino' ? 'Creadora' : 'Creador'}
                    </span>
                  )}
                  {currentUser.role === 'shelter' && (
                    currentUser.verificationStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Clock className="w-2.5 h-2.5" /> No verificado
                      </span>
                    )
                  )}
                </div>
              ) : (
                <span>Registro e inicio de sesión</span>
              )}
            </div>
          </button>

          {/* Menu Drawer Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-[#271a33] text-white hover:bg-[#32243e] border border-[#3d2f4a] transition-colors cursor-pointer"
            aria-label="Abrir opciones de navegación"
            title="Más opciones"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Slide-out Menu Drawer when user clicks the menu button */}
      {isMenuOpen && (
        <div className="bg-[#150821] border-b border-[#3d2f4a] px-4 py-4 space-y-2 shadow-2xl animate-fadeIn">
          <div className="text-[11px] font-bold text-[#e3bdc8] uppercase tracking-wider px-3 pb-1 border-b border-[#3d2f4a]/50">
            Módulos de la Plataforma
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectScreen(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#FF1694] text-white'
                      : 'text-[#e3bdc8] hover:bg-[#271a33] hover:text-white bg-[#1a0d26] border border-[#3d2f4a]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D30D9D]/30 text-white border border-[#FF1694]/40 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
