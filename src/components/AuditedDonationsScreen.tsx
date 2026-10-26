import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DonationCase } from '../types';
import { MOCK_DONATIONS } from '../data/mockData';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Receipt, 
  Sparkles, 
  CheckCircle2, 
  FileCheck, 
  ExternalLink, 
  CreditCard, 
  X, 
  Lock, 
  Smartphone, 
  Building2, 
  Check, 
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react';

export const AuditedDonationsScreen: React.FC = () => {
  const { addDonation, currentUser } = useAuth();

  const [cases, setCases] = useState<DonationCase[]>(MOCK_DONATIONS);
  const [activeTab, setActiveTab] = useState<'cases' | 'ledger'>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-01');

  // Preset or Custom Donation Amounts
  const [selectedPreset, setSelectedPreset] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);

  // Gateway selection: Wompi vs Bold
  const [gateway, setGateway] = useState<'wompi' | 'bold'>('wompi');

  // Donor Contact Info
  const [donorName, setDonorName] = useState(currentUser?.fullName || 'Anónimo Solidario');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || 'donante@correo.com');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '3109824102');

  // Interactive Checkout Gateway Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'daviplata' | 'card' | 'pse'>('nequi');
  const [nequiPhone, setNequiPhone] = useState('3109824102');
  const [selectedBank, setSelectedBank] = useState('Bancolombia');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8841');
  const [cardExp, setCardExp] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('892');

  // Processing Animation state
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'approved'>('form');
  const [processingMsg, setProcessingMsg] = useState('');
  const [approvedTxId, setApprovedTxId] = useState('');

  // Invoice modal
  const [showInvoiceModal, setShowInvoiceModal] = useState<DonationCase | null>(null);

  const finalDonationAmount = isCustom ? (Number(customAmount) || 0) : selectedPreset;

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalDonationAmount < 5000) {
      alert('El monto mínimo de donación es de $5.000 COP.');
      return;
    }
    setPaymentStep('form');
    setShowCheckoutModal(true);
  };

  const handleProcessPayment = () => {
    setPaymentStep('processing');
    setProcessingMsg(`Conectando con servidores seguros de ${gateway === 'wompi' ? 'Wompi (Bancolombia)' : 'Bold'}...`);

    setTimeout(() => {
      setProcessingMsg('Verificando fondos y autorizando transacción...');
    }, 1000);

    setTimeout(() => {
      const txId = `${gateway.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-COL`;
      setApprovedTxId(txId);
      setPaymentStep('approved');

      const currentCase = cases.find(c => c.id === selectedCaseId);
      const caseTitle = currentCase ? `${currentCase.patientName} (${currentCase.title})` : 'Fondo General Veterinario';

      // Update case funded progress
      setCases(prev => prev.map(c => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            currentAmount: Math.min(c.targetAmount, c.currentAmount + finalDonationAmount),
            donorsCount: c.donorsCount + 1,
          };
        }
        return c;
      }));

      // Record in Admin Panel
      addDonation({
        donorName: donorName.trim() || 'Donante Solidario',
        donorEmail: donorEmail.trim() || 'donante@correo.com',
        amount: finalDonationAmount,
        caseTitle,
        paymentMethod: `${gateway === 'wompi' ? 'Wompi' : 'Bold'} (${paymentMethod.toUpperCase()})`,
        status: 'approved',
      });
    }, 2200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#271a33] via-[#3B1C56] to-[#271a33] p-6 sm:p-8 rounded-3xl border border-[#3d2f4a] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1694]/20 border border-[#FF1694]/40 text-[#ffaed9] text-xs font-bold mb-2">
              <HeartHandshake className="w-3.5 h-3.5" />
              Pasarela de Donaciones Auditadas & Cuentas Claras
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
              Aportes Solidarios Mediante Wompi & Bold
            </h1>
            <p className="text-xs sm:text-sm text-[#e3bdc8] leading-relaxed">
              Cero retenciones intermedias: cada peso donado va directamente a las clínicas veterinarias con facturas electrónicas avaladas por la DIAN y registro público en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#150821] p-1.5 rounded-2xl border border-[#3d2f4a] self-start md:self-auto">
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cases'
                  ? 'bg-[#FF1694] text-white shadow-md'
                  : 'text-[#e3bdc8] hover:text-white'
              }`}
            >
              Casos Activos ({cases.length})
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-[#FF1694] text-white shadow-md'
                  : 'text-[#e3bdc8] hover:text-white'
              }`}
            >
              Libro Mayor de Facturas
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#3d2f4a]">
          <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a]">
            <span className="text-xs text-[#e3bdc8]">Trazabilidad</span>
            <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">100%</p>
            <p className="text-[11px] text-emerald-400 font-semibold">Fondos Auditados</p>
          </div>

          <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a]">
            <span className="text-xs text-[#e3bdc8]">Total Donado</span>
            <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">$48.95M</p>
            <p className="text-[11px] text-[#ffaed9] font-semibold">COP Transparentes</p>
          </div>

          <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a]">
            <span className="text-xs text-[#e3bdc8]">Intervenciones</span>
            <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">38 Vidas</p>
            <p className="text-[11px] text-[#cebdff] font-semibold">Casos Médicos Salvados</p>
          </div>

          <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a]">
            <span className="text-xs text-[#e3bdc8]">Comisiones Ocultas</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">0%</p>
            <p className="text-[11px] text-emerald-300 font-semibold">Cero Retención</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Cases or Ledger + Transparent Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Area (7 cols): Cases or Ledger */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'cases' ? (
            <div className="space-y-6">
              {cases.map((c) => {
                const percent = Math.min(100, Math.round((c.currentAmount / c.targetAmount) * 100));
                return (
                  <div
                    key={c.id}
                    className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl overflow-hidden shadow-xl hover:border-[#FF1694]/50 transition-all"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12">
                      <div className="sm:col-span-5 relative aspect-4/3 sm:aspect-auto bg-black">
                        <img
                          src={c.imageUrl}
                          alt={c.patientName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 bg-[#150821]/80 text-[#ffaed9] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#FF1694]/40">
                          {c.urgency === 'Crítica' ? '🚨 Urgencia Quirúrgica' : '⚠️ Tratamiento Crítico'}
                        </span>
                      </div>

                      <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#e3bdc8]">
                            <span>{c.shelterName}</span>
                            <span className="font-mono text-[10px] text-[#cebdff]">ID: {c.id}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mt-1">
                            {c.title}
                          </h3>
                          <p className="text-xs text-[#ffaed9] font-medium">
                            Paciente: {c.patientName}
                          </p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-white font-mono">{formatCOP(c.currentAmount)}</span>
                            <span className="text-[#e3bdc8] font-mono">Meta: {formatCOP(c.targetAmount)}</span>
                          </div>
                          <div className="w-full h-2.5 bg-[#150821] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#D30D9D] to-[#FF1694] rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-[#e3bdc8]">
                            <span>{percent}% financiado</span>
                            <span>{c.donorsCount} donantes solidarios</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setSelectedCaseId(c.id)}
                            className="flex-1 py-2.5 rounded-xl bg-[#FF1694] hover:bg-[#D30D9D] text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Donar a este Caso
                          </button>
                          <button
                            onClick={() => setShowInvoiceModal(c)}
                            className="px-3.5 py-2.5 rounded-xl bg-[#150821] hover:bg-[#32243e] text-[#cebdff] text-xs font-semibold border border-[#3d2f4a] flex items-center gap-1 cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Factura</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Ledger View */
            <div className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                Libro Mayor Público de Comprobantes Fiscales
              </h3>
              <p className="text-xs text-[#e3bdc8]">
                Todos los aportes son emitidos directamente a nombre de las clínicas veterinarias tratantes con firma digital y hash SHA-256.
              </p>

              <div className="space-y-3">
                {cases.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{c.title}</span>
                      <span className="text-emerald-400 font-mono text-[11px] font-bold">
                        DIAN APROBADA
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#e3bdc8]">
                      <div>
                        <span>Hash Criptográfico: </span>
                        <strong className="font-mono text-white text-[10px]">{c.auditHash}</strong>
                      </div>
                      <div>
                        <span>Médico Responsable: </span>
                        <strong className="text-[#cebdff]">{c.vetSignatory}</strong>
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => setShowInvoiceModal(c)}
                        className="text-[#ffaed9] text-xs font-bold underline hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        Descargar Comprobante PDF Certificado <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Area (5 cols): Interactive Donation Checkout Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#271a33] border border-[#FF1694]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-[#3d2f4a] pb-4">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#FF1694]" />
                <h3 className="font-bold text-white text-lg">
                  Realizar Donación en Línea
                </h3>
              </div>
              <p className="text-xs text-[#e3bdc8] mt-1">
                Selecciona la pasarela autorizada (Wompi / Bold) y el valor que deseas aportar.
              </p>
            </div>

            <form onSubmit={handleOpenCheckout} className="space-y-5">
              {/* Destination Select */}
              <div>
                <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                  Destino del Aporte
                </label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-[#150821] border border-[#3d2f4a] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1694]"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.patientName} ({c.title})
                    </option>
                  ))}
                  <option value="general">Fondo de Reserva para Urgencias Médicas</option>
                </select>
              </div>

              {/* Gateway Selection */}
              <div>
                <label className="block text-xs font-bold text-[#f0dbfe] mb-1.5">
                  Pasarela de Pago Certificada
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGateway('wompi')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      gateway === 'wompi'
                        ? 'bg-[#150821] border-[#FF1694] ring-1 ring-[#FF1694]'
                        : 'bg-[#150821] border-[#3d2f4a]'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">Wompi</p>
                    <p className="text-[10px] text-[#e3bdc8]">Bancolombia, Nequi, PSE</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGateway('bold')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      gateway === 'bold'
                        ? 'bg-[#150821] border-[#FF1694] ring-1 ring-[#FF1694]'
                        : 'bg-[#150821] border-[#3d2f4a]'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">Bold</p>
                    <p className="text-[10px] text-[#e3bdc8]">Tarjetas, Nequi, PSE</p>
                  </button>
                </div>
              </div>

              {/* Amount Selection: Presets or Custom */}
              <div>
                <label className="block text-xs font-bold text-[#f0dbfe] mb-2">
                  Monto a Donar (COP)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[20000, 50000, 100000, 200000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(amt);
                        setIsCustom(false);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        !isCustom && selectedPreset === amt
                          ? 'bg-[#FF1694] text-white border-[#FF1694] shadow-md'
                          : 'bg-[#150821] text-[#e3bdc8] border-[#3d2f4a] hover:bg-[#32243e]'
                      }`}
                    >
                      {formatCOP(amt)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isCustom
                        ? 'bg-[#FF1694] text-white border-[#FF1694] shadow-md'
                        : 'bg-[#150821] text-[#e3bdc8] border-[#3d2f4a] hover:bg-[#32243e]'
                    }`}
                  >
                    Personalizado
                  </button>
                </div>

                {/* Custom input */}
                {isCustom && (
                  <div className="mt-2.5 animate-fadeIn">
                    <label className="block text-[11px] text-[#ffaed9] mb-1">
                      Ingresa el valor personalizado (Mínimo $5.000 COP):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-[#8e7a9f] font-mono">$</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Ej. 75000"
                        min="5000"
                        required
                        className="w-full bg-[#150821] border border-[#FF1694] rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Donor Contact */}
              <div className="space-y-3 pt-2 border-t border-[#3d2f4a]">
                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-1">
                    Tu Nombre o Razón Social
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Ej. Juan Gómez"
                    required
                    className="w-full bg-[#150821] border border-[#3d2f4a] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF1694]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-1">
                    Correo para Comprobante
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="juan@ejemplo.com"
                    required
                    className="w-full bg-[#150821] border border-[#3d2f4a] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF1694]"
                  />
                </div>
              </div>

              {/* Live Fee Breakdown */}
              <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-2 text-xs">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>Monto Total Seleccionado:</span>
                  <span className="text-[#ffaed9] font-mono text-base">{formatCOP(finalDonationAmount)}</span>
                </div>
                <div className="h-px bg-[#3d2f4a] my-1" />
                <div className="flex justify-between text-[#e3bdc8]">
                  <span>Destino Clínico Directo:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{formatCOP(finalDonationAmount)}</span>
                </div>
                <div className="flex justify-between text-[#e3bdc8]">
                  <span>Comisión de Plataforma:</span>
                  <span className="font-mono text-white font-semibold">$0 COP (100% libre)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={finalDonationAmount <= 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white text-xs font-bold shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>Continuar al Pago con {gateway === 'wompi' ? 'Wompi' : 'Bold'}</span>
              </button>

              <p className="text-[11px] text-center text-[#e3bdc8] flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Pasarela Segura Cifrada con Facturación DIAN
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Simulated Interactive Wompi / Bold Checkout Gateway Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#271a33] border-2 border-[#FF1694] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Modal Close */}
            {paymentStep !== 'processing' && (
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#150821] text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {paymentStep === 'form' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-[#3d2f4a]">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF1694]/20 border border-[#FF1694] flex items-center justify-center text-[#FF1694] font-bold">
                    {gateway === 'wompi' ? 'W' : 'B'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Pasarela {gateway === 'wompi' ? 'Wompi' : 'Bold'}
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Pago Seguro Cifrado TLS 1.3
                    </p>
                  </div>
                </div>

                {/* Amount to pay */}
                <div className="bg-[#150821] p-3.5 rounded-2xl border border-[#3d2f4a] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#e3bdc8] block">Total a pagar:</span>
                    <span className="text-lg font-black text-white font-mono">{formatCOP(finalDonationAmount)}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-[10px] font-bold">
                    COP
                  </span>
                </div>

                {/* Method selector */}
                <div>
                  <label className="block text-xs font-bold text-[#f0dbfe] mb-2">
                    Selecciona tu medio de pago:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'nequi', label: 'Nequi' },
                      { id: 'daviplata', label: 'Daviplata' },
                      { id: 'card', label: 'Tarjeta' },
                      { id: 'pse', label: 'PSE' },
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          paymentMethod === m.id
                            ? 'bg-[#FF1694] text-white border-[#FF1694] shadow'
                            : 'bg-[#150821] text-[#e3bdc8] border-[#3d2f4a] hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method Input Details */}
                {paymentMethod === 'nequi' && (
                  <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-2 text-xs">
                    <label className="block font-bold text-white">Número de celular Nequi</label>
                    <input
                      type="tel"
                      value={nequiPhone}
                      onChange={(e) => setNequiPhone(e.target.value)}
                      placeholder="3101234567"
                      className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs font-mono"
                    />
                    <p className="text-[11px] text-[#e3bdc8]">
                      Te llegará un push a la app Nequi para autorizar el cobro sin comisiones.
                    </p>
                  </div>
                )}

                {paymentMethod === 'daviplata' && (
                  <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-2 text-xs">
                    <label className="block font-bold text-white">Número Daviplata</label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="3101234567"
                      className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs font-mono"
                    />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-white mb-1">Número de Tarjeta</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-white mb-1">Vencimiento</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="MM/AA"
                          className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-white mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pse' && (
                  <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-2 text-xs">
                    <label className="block font-bold text-white">Banco emisor PSE</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-[#271a33] text-white px-3 py-2 rounded-xl border border-[#3d2f4a] text-xs"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="Nu Colombia">Nu Colombia</option>
                      <option value="BBVA Colombia">BBVA Colombia</option>
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pagar {formatCOP(finalDonationAmount)} con {gateway === 'wompi' ? 'Wompi' : 'Bold'}</span>
                </button>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full border-4 border-[#FF1694] border-t-transparent animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">
                  Procesando Aporte Seguro
                </h3>
                <p className="text-xs text-[#e3bdc8] max-w-xs mx-auto font-medium">
                  {processingMsg}
                </p>
              </div>
            )}

            {paymentStep === 'approved' && (
              <div className="py-6 text-center space-y-5 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">¡Donación Aprobada!</h3>
                  <p className="text-xs text-[#e3bdc8] mt-1">
                    Comprobante fiduciario generado con éxito.
                  </p>
                </div>

                <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] text-xs space-y-1.5 text-left">
                  <div className="flex justify-between text-[#e3bdc8]">
                    <span>Referencia:</span>
                    <span className="font-mono text-white font-bold">{approvedTxId}</span>
                  </div>
                  <div className="flex justify-between text-[#e3bdc8]">
                    <span>Monto debitado:</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatCOP(finalDonationAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[#e3bdc8]">
                    <span>Donante:</span>
                    <span className="text-white">{donorName}</span>
                  </div>
                  <div className="flex justify-between text-[#e3bdc8]">
                    <span>Pasarela:</span>
                    <span className="text-[#ffaed9] font-semibold">{gateway.toUpperCase()} ({paymentMethod.toUpperCase()})</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-3 bg-[#FF1694] hover:bg-[#D30D9D] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Finalizar y Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice Inspector Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#271a33] border border-[#3d2f4a] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#3d2f4a] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#FF1694]" />
                <h3 className="font-bold text-white text-base">
                  Comprobante Clínico Fiscal #{showInvoiceModal.auditHash.substring(0, 10)}
                </h3>
              </div>
              <button
                onClick={() => setShowInvoiceModal(null)}
                className="p-1 rounded-lg text-[#e3bdc8] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#150821] p-4 rounded-2xl border border-[#3d2f4a] space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#3d2f4a] pb-2">
                <div>
                  <p className="text-white font-bold">{showInvoiceModal.title}</p>
                  <p className="text-[#e3bdc8]">Paciente: {showInvoiceModal.patientName}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    VALIDADA DIAN
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[#ffaed9] font-bold">Conceptos Médicos Facturados:</p>
                {showInvoiceModal.breakdown.map((b, i) => (
                  <div key={i} className="flex justify-between text-[#e3bdc8]">
                    <span>{b.item}</span>
                    <span className="font-mono text-white">{formatCOP(b.cost)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#3d2f4a] pt-2 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Total Liquidado:</span>
                  <span className="text-[#FF1694] font-mono">{formatCOP(showInvoiceModal.targetAmount)}</span>
                </div>
                <div className="text-[10px] text-[#e3bdc8] font-mono pt-1">
                  Firma Digital: {showInvoiceModal.vetSignatory}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Comprobante PDF certificado descargado.');
                setShowInvoiceModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D30D9D] to-[#FF1694] text-white text-xs font-bold hover:opacity-90 cursor-pointer"
            >
              Descargar Factura Electrónica en PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
