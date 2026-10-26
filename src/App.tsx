import React, { useState } from 'react';
import { ActiveScreen } from './types';
import { ASSETS } from './data/mockData';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { SearchLensScreen } from './components/SearchLensScreen';
import { NoticePublishScreen } from './components/NoticePublishScreen';
import { PrivateChatScreen } from './components/PrivateChatScreen';
import { AuditedDonationsScreen } from './components/AuditedDonationsScreen';
import { AdoptionScreen } from './components/AdoptionScreen';
import { IdentityAuthScreen } from './components/IdentityAuthScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { ShieldCheck, Home, Search, Megaphone, MessageSquare, User, LayoutDashboard } from 'lucide-react';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const { isAuthorizedCreator } = useAuth();

  const handleNavigateToChat = () => {
    setActiveScreen('chat');
    setUnreadChatCount(0);
  };

  return (
    <div className="min-h-screen bg-[#1a0d26] text-[#f0dbfe] flex flex-col selection:bg-[#FF1694] selection:text-white transition-colors duration-200">
      {/* Top Main Navigation */}
      <Navbar
        activeScreen={activeScreen}
        onSelectScreen={(screen) => {
          // Si intenta ir a admin sin autorización de creador/a, redirigir a inicio
          if (screen === 'admin' && !isAuthorizedCreator) {
            setActiveScreen('home');
            return;
          }
          setActiveScreen(screen);
          if (screen === 'chat') setUnreadChatCount(0);
        }}
        unreadCount={unreadChatCount}
      />

      {/* Main Content Area: Padding adaptable a móviles para dar espacio a la barra inferior */}
      <main className="flex-1 pb-24 md:pb-16">
        {activeScreen === 'home' && (
          <HomeScreen
            onNavigateToScreen={(screen) => {
              if (screen === 'admin' && !isAuthorizedCreator) {
                setActiveScreen('home');
                return;
              }
              setActiveScreen(screen);
              if (screen === 'chat') setUnreadChatCount(0);
            }}
          />
        )}

        {activeScreen === 'search' && (
          <SearchLensScreen
            onNavigateToChat={handleNavigateToChat}
            onNavigateToReport={() => setActiveScreen('report')}
          />
        )}

        {activeScreen === 'report' && (
          <NoticePublishScreen
            onNavigateToSearch={() => setActiveScreen('search')}
            onNavigateToAdmin={isAuthorizedCreator ? () => setActiveScreen('admin') : undefined}
          />
        )}

        {activeScreen === 'chat' && (
          <PrivateChatScreen
            onNavigateToAuth={() => setActiveScreen('auth')}
          />
        )}

        {activeScreen === 'donations' && (
          <AuditedDonationsScreen />
        )}

        {activeScreen === 'adoption' && (
          <AdoptionScreen />
        )}

        {activeScreen === 'auth' && (
          <IdentityAuthScreen />
        )}

        {/* El panel de administrador está TOTALMENTE oculto e inaccesible para invitados y usuarios registrados comunes.
            Únicamente el creador y la creadora autenticados tienen acceso */}
        {activeScreen === 'admin' && (
          isAuthorizedCreator ? (
            <AdminDashboardScreen 
              onNavigateHome={() => setActiveScreen('home')}
              onNavigateAuth={() => setActiveScreen('auth')}
            />
          ) : (
            <HomeScreen
              onNavigateToScreen={(screen) => {
                setActiveScreen(screen);
                if (screen === 'chat') setUnreadChatCount(0);
              }}
            />
          )
        )}
      </main>

      {/* Footer (Ajustado con margen inferior en móvil para evitar solapamiento) */}
      <footer className="border-t border-[#3d2f4a] bg-[#150821] py-8 px-4 sm:px-6 lg:px-8 mb-16 md:mb-0 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#e3bdc8]">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveScreen('home')}
              className="w-9 h-9 overflow-hidden bg-transparent cursor-pointer flex items-center justify-center"
            >
              <img
                src={ASSETS.logo}
                alt="Logo"
                className="w-full h-full object-contain logo-theme-adaptive"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="font-bold text-white">Huellas Perdidas © 2026</p>
              <p className="text-[11px]">Red colaborativa de búsqueda y rescate de animales domésticos</p>
            </div>
          </div>

          {/* Screen quick selector pills (Sin acceso a admin para invitados ni usuarios comunes) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'search', label: 'Buscador Lens' },
              { id: 'report', label: 'Reportar Mascota' },
              { id: 'chat', label: 'Chat' },
              { id: 'donations', label: 'Donaciones' },
              { id: 'adoption', label: 'Adopciones' },
              { id: 'auth', label: 'Registro / Acceso' },
              ...(isAuthorizedCreator ? [{ id: 'admin', label: 'Consola Creadores' }] : [])
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveScreen(item.id as ActiveScreen);
                  if (item.id === 'chat') setUnreadChatCount(0);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                  activeScreen === item.id ? 'bg-[#FF1694] text-white font-bold' : 'hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Red Comunitaria Segura</span>
          </div>
        </div>
      </footer>

      {/* Barra de Navegación Inferior Móvil (Sticky Bottom Nav para Smartphones) */}
      <nav 
        aria-label="Navegación móvil inferior rápida"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a0d26]/95 backdrop-blur-lg border-t border-[#3d2f4a] px-2 py-1.5 transition-colors duration-200 mobile-bottom-bar shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Inicio */}
          <button
            type="button"
            onClick={() => setActiveScreen('home')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[54px] min-h-[46px] cursor-pointer ${
              activeScreen === 'home'
                ? 'text-[#FF1694] font-bold'
                : 'text-[#e3bdc8] hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Inicio</span>
          </button>

          {/* 2. Buscador Lens */}
          <button
            type="button"
            onClick={() => setActiveScreen('search')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[54px] min-h-[46px] cursor-pointer ${
              activeScreen === 'search'
                ? 'text-[#FF1694] font-bold'
                : 'text-[#e3bdc8] hover:text-white'
            }`}
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Buscar</span>
          </button>

          {/* 3. Acción Principal: Reportar Mascota */}
          <button
            type="button"
            onClick={() => setActiveScreen('report')}
            className="flex flex-col items-center justify-center -mt-4 group cursor-pointer transition-transform active:scale-95"
            aria-label="Reportar mascota perdida o encontrada"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
              activeScreen === 'report'
                ? 'bg-[#FF1694] text-white ring-4 ring-[#FF1694]/30 shadow-[#FF1694]/50'
                : 'bg-gradient-to-tr from-[#D30D9D] to-[#FF1694] text-white shadow-[#FF1694]/40 hover:opacity-95'
            }`}>
              <Megaphone className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold mt-1 ${
              activeScreen === 'report' ? 'text-[#FF1694]' : 'text-[#e3bdc8]'
            }`}>
              Reportar
            </span>
          </button>

          {/* 4. Chat Cifrado */}
          <button
            type="button"
            onClick={handleNavigateToChat}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[54px] min-h-[46px] cursor-pointer ${
              activeScreen === 'chat'
                ? 'text-[#FF1694] font-bold'
                : 'text-[#e3bdc8] hover:text-white'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 mb-0.5" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#FF1694] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadChatCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Chat</span>
          </button>

          {/* 5. Cuenta / Consola */}
          {isAuthorizedCreator ? (
            <button
              type="button"
              onClick={() => setActiveScreen('admin')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[54px] min-h-[46px] cursor-pointer ${
                activeScreen === 'admin'
                  ? 'text-amber-400 font-bold'
                  : 'text-[#e3bdc8] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-0.5 text-amber-400" />
              <span className="text-[10px] tracking-tight text-amber-300">Consola</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveScreen('auth')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[54px] min-h-[46px] cursor-pointer ${
                activeScreen === 'auth'
                  ? 'text-[#FF1694] font-bold'
                  : 'text-[#e3bdc8] hover:text-white'
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">Cuenta</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
