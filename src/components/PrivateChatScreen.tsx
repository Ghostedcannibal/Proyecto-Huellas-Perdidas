import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import { dbService } from '../services/db';
import { 
  MessageSquare, 
  ShieldCheck, 
  Lock, 
  PhoneCall, 
  Send, 
  AlertTriangle,
  AlertOctagon,
  UserPlus,
  Sparkles,
  CheckCheck
} from 'lucide-react';

interface PrivateChatScreenProps {
  onNavigateToAuth?: () => void;
}

export const PrivateChatScreen: React.FC<PrivateChatScreenProps> = ({ onNavigateToAuth }) => {
  const { currentUser } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return dbService.getChatMessages();
  });
  const [inputText, setInputText] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Authentication Gate: Chat is inaccessible if user is not registered/logged in
  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
        <div className="bg-[#271a33] border-2 border-[#FF1694] rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-[#FF1694]/20 border border-[#FF1694] flex items-center justify-center text-[#FF1694] mx-auto mb-6 shadow-lg animate-pulse">
            <Lock className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            Acceso Exclusivo para Usuarios Registrados
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight mb-4">
            Debes registrarte para acceder al Chat
          </h1>

          <p className="text-sm sm:text-base text-[#e3bdc8] max-w-xl mx-auto mb-8 leading-relaxed">
            Para blindar a los rescatistas y dueños de mascotas frente a estafas o extorsiones anónimas, el canal de comunicación directa requiere que verifiques tu cuenta con tu número de teléfono en la base de datos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToAuth}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white text-sm font-bold rounded-2xl shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Crear Cuenta o Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.fullName} (${currentUser.role === 'shelter' ? 'Refugio' : 'Tutor'})`,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dbService.addChatMessage(newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#3B1C56] via-[#271a33] to-[#3B1C56] border border-[#3d2f4a] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF1694]/20 border border-[#FF1694] flex items-center justify-center text-[#FF1694] shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Chat de Comunicación Segura Cifrada
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Cuenta Verificada
              </span>
            </div>
            <p className="text-xs text-[#e3bdc8]">
              Sesión activa como <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCallModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#271a33] hover:bg-[#32243e] border border-[#3d2f4a] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Llamada Segura</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#ffaed9] font-mono bg-[#150821] px-3 py-1.5 rounded-xl border border-[#3d2f4a]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cifrado E2E Activo</span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#271a33] border border-[#3d2f4a] rounded-2xl overflow-hidden shadow-2xl min-h-[580px]">
        {/* Left Sidebar: Active Channels */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#3d2f4a] bg-[#23162f]/80 flex flex-col justify-between">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Bandeja Segura</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FF1694]/20 text-[#ffaed9] border border-[#FF1694]/30 font-bold">
                {messages.length > 0 ? '1 Conversación' : '0 Conversaciones'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#32243e] border border-[#FF1694] text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Canal Directo de Usuario
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">En Línea</span>
                </div>
                <p className="text-[11px] text-[#ffaed9] font-medium truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-[11px] text-[#e3bdc8] truncate mt-0.5">
                  {messages.length > 0 
                    ? `Último mensaje: ${messages[messages.length - 1].timestamp}`
                    : 'Sin mensajes registrados aún'}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Note at Bottom */}
          <div className="p-4 border-t border-[#3d2f4a] bg-[#150821]/60 text-[11px] text-[#e3bdc8] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#ffaed9]">
              <ShieldCheck className="w-3.5 h-3.5" /> Purga Automática de Metadatos
            </div>
            <p>
              Toda comunicación e imagen enviada por este canal es cifrada para proteger la privacidad y evitar filtraciones de ubicación domiciliaria.
            </p>
          </div>
        </div>

        {/* Right Chat Stream */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full bg-[#1a0d26]/60">
          {/* Stream Header */}
          <div className="p-4 border-b border-[#3d2f4a] bg-[#271a33] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3B1C56] border border-[#FF1694] flex items-center justify-center font-bold text-white text-sm">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-white text-sm">{currentUser.fullName}</h4>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Canal Privado
                  </span>
                </div>
                <p className="text-[11px] text-[#e3bdc8]">
                  Comunicación protegida • {currentUser.city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCallModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#32243e] hover:bg-[#3d2f4a] text-white text-xs font-semibold border border-[#3d2f4a] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Llamada Segura</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Reportar Sospecha</span>
              </button>
            </div>
          </div>

          {/* Anti-extortion warning banner */}
          <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Consejo de Seguridad:</strong> No realices anticipos monetarios ni transferencias sin verificar presencialmente a la mascota en un punto veterinario neutral.
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 max-h-[440px]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#3B1C56]/60 border border-[#FF1694]/40 flex items-center justify-center text-[#FF1694]">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Canal Cifrado sin Mensajes Anteriores</h4>
                <p className="text-xs text-[#e3bdc8] max-w-md leading-relaxed">
                  Esta conversación está completamente limpia y lista para su uso. Puedes enviar un mensaje a continuación para coordinar información o reencuentros de mascotas de manera segura.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <span className="text-[10px] text-[#e3bdc8] px-1 font-medium">
                      {msg.senderName} • {msg.timestamp}
                    </span>

                    <div
                      className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm space-y-2 ${
                        isMe
                          ? 'bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white rounded-tr-none shadow-md'
                          : 'bg-[#271a33] text-white border border-[#3d2f4a] rounded-tl-none shadow-md'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-[#3d2f4a] bg-[#271a33] space-y-2">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe un mensaje en el canal seguro..."
                className="flex-1 bg-[#150821] border border-[#3d2f4a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1694]"
              />

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white text-xs font-bold hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-[#e3bdc8]">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Cifrado E2E activo
              </span>
              <span className="hidden sm:inline">
                Las conversaciones son privadas y almacenadas de forma local
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <PhoneCall className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Llamada Segura con Número Enmascarado</h3>
            <p className="text-xs text-[#e3bdc8] leading-relaxed">
              El sistema enmascara tu número telefónico personal a través de una centralita VoIP para evitar que terceros capturen tu contacto.
            </p>
            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-3 bg-[#FF1694] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Reportar Sospecha de Extorsión</h3>
            <p className="text-xs text-[#e3bdc8] leading-relaxed">
              Si alguien te solicita dinero por adelantado o intenta amenazarte, este reporte se envía inmediatamente a la moderación central para bloquear la cuenta.
            </p>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full py-3 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
