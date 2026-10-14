import React, { useState } from 'react';
import { TaxItem, OfficialReceipt, Language, FarmerProfile } from '../types';
import { translations } from '../utils/translations';
import { audioService } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  CheckCircle2,
  Receipt,
  Printer,
  Download,
  Plus,
  ShieldCheck,
  Building2,
  Volume2,
  Calendar,
  X,
  QrCode,
  DollarSign,
  Landmark,
  Check,
} from 'lucide-react';

interface TaxesAndReceiptsViewProps {
  taxes: TaxItem[];
  receipts: OfficialReceipt[];
  onUpdateTaxes: (taxes: TaxItem[], receipts: OfficialReceipt[]) => void;
  farmerProfile: FarmerProfile;
  currentLang: Language;
}

export const TaxesAndReceiptsView: React.FC<TaxesAndReceiptsViewProps> = ({
  taxes,
  receipts,
  onUpdateTaxes,
  farmerProfile,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [selectedReceipt, setSelectedReceipt] = useState<OfficialReceipt | null>(receipts[0] || null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTaxToPay, setSelectedTaxToPay] = useState<TaxItem | null>(null);
  const [isAddCustomTaxOpen, setIsAddCustomTaxOpen] = useState(false);

  // Payment method selection
  const [selectedBank, setSelectedBank] = useState<
    'telebirr' | 'cbe_birr' | 'awash' | 'dashen' | 'abyssinia' | 'coop_oromia'
  >('telebirr');
  const [paymentPhone, setPaymentPhone] = useState(farmerProfile.phone);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Custom revenue category state
  const [customTitle, setCustomTitle] = useState('');
  const [customAmount, setCustomAmount] = useState<number>(500);
  const [customDueDate, setCustomDueDate] = useState('ሰኔ 30 ቀን 2018 ዓ.ም');

  const bankOptions = [
    {
      id: 'telebirr',
      name: 'ቴሌብር (Telebirr)',
      color: 'bg-emerald-600',
      textColor: 'text-white',
      badge: 'ቀዳሚ ዲጂታል ክፍያ',
    },
    {
      id: 'cbe_birr',
      name: 'የኢትዮጵያ ንግድ ባንክ (CBE Birr)',
      color: 'bg-purple-800',
      textColor: 'text-white',
      badge: 'CBE Birr',
    },
    {
      id: 'awash',
      name: 'አዋሽ ባንክ (Awash Bank)',
      color: 'bg-blue-700',
      textColor: 'text-white',
      badge: 'Awash Wallet',
    },
    {
      id: 'dashen',
      name: 'ዳሽን ባንክ / አሞሌ (Dashen Amole)',
      color: 'bg-sky-600',
      textColor: 'text-white',
      badge: 'Amole',
    },
    {
      id: 'abyssinia',
      name: 'አቢሲኒያ ባንክ (Bank of Abyssinia)',
      color: 'bg-amber-600',
      textColor: 'text-white',
      badge: 'BoA Pay',
    },
    {
      id: 'coop_oromia',
      name: 'የኦሮሚያ ህብረት ስራ ባንክ (Coop Bank)',
      color: 'bg-orange-600',
      textColor: 'text-white',
      badge: 'Coop Pay',
    },
  ];

  const handleSpeakReceipt = (r: OfficialReceipt) => {
    const text = `ህጋዊ የመንግስት የግብር ደረሰኝ። የደረሰኝ ቁጥር፡ ${r.receiptNumber}። ከፋይ፡ ${r.taxpayerName}። የክፍያ ምክንያት፡ ${r.category}። የተከፈለ መጠን፡ ${r.amount.toLocaleString()} ብር። የተከፈለበት ባንክ፡ ${r.paymentMethod}። ቀን፡ ${r.paidDate}። የገቢ ሰብሳቢ ኦፊሰር ማረጋገጫ ተሰጥቷል።`;
    audioService.speakText(text);
  };

  const handleStartPay = (tax: TaxItem) => {
    setSelectedTaxToPay(tax);
    setIsPayModalOpen(true);
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaxToPay) return;

    setIsProcessingPayment(true);
    audioService.playChime('click');

    setTimeout(() => {
      const receiptNumber = `REC-REV-ET-2018-${Math.floor(10000 + Math.random() * 90000)}`;
      const currentDate = 'የካቲት 28 ቀን 2018 ዓ.ም';

      const newReceipt: OfficialReceipt = {
        receiptNumber,
        taxpayerName: farmerProfile.fullName,
        kebeleId: farmerProfile.kebeleIdNumber,
        faydaId: farmerProfile.nationalFaydaId,
        region: `${farmerProfile.region} ገቢዎች ቢሮ`,
        woreda: `${farmerProfile.woreda} ወረዳ ገቢዎች ጽ/ቤት`,
        kebele: farmerProfile.kebele,
        category: selectedTaxToPay.category,
        amount: selectedTaxToPay.amount,
        amountInWords: `${selectedTaxToPay.amount.toLocaleString()} ብር ከ 00 ሳንቲም`,
        paidDate: `${currentDate} 4:30 ጠዋት`,
        paymentMethod: selectedBank,
        transactionReference: `TX-${selectedBank.toUpperCase()}-${Date.now().toString().slice(-6)}`,
        verifierOfficer: 'አቶ ዮሐንስ መኮንን (የቀበሌ የገቢ ኦፊሰር)',
        status: 'verified',
        qrCodeValue: `GOV-ETH-TAX-VERIFIED:${receiptNumber}:${selectedTaxToPay.amount}ETB:${farmerProfile.nationalFaydaId}`,
      };

      const updatedTaxes = taxes.map((t) =>
        t.id === selectedTaxToPay.id
          ? {
              ...t,
              status: 'paid' as const,
              receiptId: receiptNumber,
              paidDate: currentDate,
              paymentMethod: selectedBank,
            }
          : t
      );

      const updatedReceipts = [newReceipt, ...receipts];
      onUpdateTaxes(updatedTaxes, updatedReceipts);
      setSelectedReceipt(newReceipt);

      setIsProcessingPayment(false);
      setIsPayModalOpen(false);
      setSelectedTaxToPay(null);

      audioService.playChime('success');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }, 1200);
  };

  const handleAddCustomRevenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newTax: TaxItem = {
      id: `TAX-${Date.now().toString().slice(-4)}`,
      category: customTitle.trim(),
      amount: Number(customAmount) || 200,
      fiscalYear: '2018 ዓ.ም',
      dueDate: customDueDate || 'ሰኔ 30 ቀን 2018 ዓ.ም',
      status: 'pending',
    };

    onUpdateTaxes([...taxes, newTax], receipts);
    audioService.playChime('success');
    setIsAddCustomTaxOpen(false);
    setCustomTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-stone-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-1">
              <Landmark className="w-4 h-4" />
              <span>የተቀናጀ የግብርና ገቢዎች ክፍያና ህጋዊ ደረሰኝ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.taxTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
              {t.taxSub}
            </p>
          </div>

          <button
            onClick={() => setIsAddCustomTaxOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
          >
            <Plus className="w-5 h-5 text-stone-950" />
            <span>አዲስ የመንግስት ተሰብሳቢ አርዕስት ጨምር</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tax Line Items & Official Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tax Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-700" />
              <span>የግብርና የመሬት ክፍያዎች ዝርዝር (ገደብ የለሽ አርዕስት)</span>
            </h3>
            <span className="text-xs text-stone-500 font-semibold">2018 በጀት ዓመት</span>
          </div>

          <div className="space-y-3">
            {taxes.map((tax) => (
              <div
                key={tax.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-900 text-sm">{tax.category}</h4>
                    {tax.status === 'paid' ? (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                        ተከፍሏል ✓
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full">
                        ክፍያ ይጠብቃል
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span>የመጨረሻ ቀን፡ {tax.dueDate}</span>
                    <span>•</span>
                    <span>በጀት፡ {tax.fiscalYear}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-stone-900 block">
                      {tax.amount.toLocaleString()} <span className="text-xs font-normal">ብር</span>
                    </span>
                  </div>

                  {tax.status === 'paid' ? (
                    <button
                      onClick={() => {
                        const r = receipts.find((item) => item.receiptNumber === tax.receiptId) || receipts[0];
                        setSelectedReceipt(r);
                        audioService.playChime('click');
                      }}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1 transition"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>ደረሰኝ እይ</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartPay(tax)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                      <span>ክፈል</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Integrated Financial Channels Display */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 space-y-2 text-xs">
            <span className="font-bold text-stone-700 block">የተጣመሩ የባንክና የክፍያ ዘርፎች (100% የተቀናጀ)፡</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {bankOptions.map((bank) => (
                <div key={bank.id} className="p-2 bg-white rounded-lg border border-stone-200 font-semibold text-[11px] text-stone-800">
                  {bank.name.split('(')[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verifiable Official Printable Receipt (5 cols) */}
        <div className="lg:col-span-5">
          {selectedReceipt ? (
            <div
              id="printable-receipt"
              className="bg-white rounded-2xl border-2 border-stone-300 shadow-xl overflow-hidden relative"
            >
              {/* Receipt Header with Ethiopian Coat of Arms styling */}
              <div className="bg-stone-900 text-white p-5 border-b-4 border-amber-500 relative">
                <div className="text-center space-y-1">
                  <span className="text-[10px] tracking-widest uppercase text-amber-400 font-bold block">
                    የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ
                  </span>
                  <h4 className="font-extrabold text-base tracking-tight">
                    {selectedReceipt.region}
                  </h4>
                  <p className="text-xs text-stone-300">
                    {selectedReceipt.woreda}
                  </p>
                  <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold mt-1">
                    ህጋዊ የገቢዎች ደረሰኝ (Official Tax Receipt)
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakReceipt(selectedReceipt)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition print:hidden"
                  title="ደረሰኙን በድምፅ አዳምጥ"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                </button>
              </div>

              {/* Receipt Content */}
              <div className="p-5 space-y-4 text-xs text-stone-800 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                {/* Meta header */}
                <div className="flex justify-between border-b border-stone-200 pb-2 font-mono text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[9px]">የደረሰኝ ቁጥር (Receipt No)</span>
                    <strong className="text-stone-900">{selectedReceipt.receiptNumber}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-400 block text-[9px]">የተከፈለበት ቀን</span>
                    <strong className="text-stone-900">{selectedReceipt.paidDate.split(' ')[0]}</strong>
                  </div>
                </div>

                {/* Taxpayer info */}
                <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between">
                    <span className="text-stone-500">ከፋይ አርሶ አደር፡</span>
                    <span className="font-bold text-stone-900">{selectedReceipt.taxpayerName}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-stone-500">ብሔራዊ ፋይዳ (ID)፡</span>
                    <span className="font-bold text-stone-900">{selectedReceipt.faydaId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">ቀበሌ / ጎጥ፡</span>
                    <span>{selectedReceipt.kebele}</span>
                  </div>
                </div>

                {/* Amount and breakdown */}
                <div className="space-y-2 pt-1 border-t border-stone-200">
                  <div className="flex justify-between">
                    <span className="text-stone-600">የገቢው ዓይነት፡</span>
                    <span className="font-bold text-stone-900 text-right">{selectedReceipt.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">የክፍያ ዘዴ፡</span>
                    <span className="font-bold text-emerald-800 uppercase">{selectedReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-stone-500">
                    <span>ማጣቀሻ (Ref No)፡</span>
                    <span>{selectedReceipt.transactionReference}</span>
                  </div>
                </div>

                {/* Total box */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between">
                  <span className="font-bold text-emerald-950">የተከፈለ ጠቅላላ ድምር፡</span>
                  <span className="text-xl font-black text-emerald-900">
                    {selectedReceipt.amount.toLocaleString()} ብር
                  </span>
                </div>

                <p className="text-[10px] text-stone-600 italic">
                  በፊደል፡ <strong>{selectedReceipt.amountInWords}</strong>
                </p>

                {/* Seal & QR Verification */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-[10px] text-stone-400">የገቢ ሰብሳቢ ኦፊሰር፡</p>
                    <p className="font-bold text-stone-800 text-[11px]">{selectedReceipt.verifierOfficer}</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      ህጋዊ ማህተም ተረጋግጧል ✓
                    </span>
                  </div>

                  <div className="p-1.5 bg-white border border-stone-300 rounded-lg flex-shrink-0">
                    <QrCode className="w-12 h-12 text-stone-900" />
                  </div>
                </div>
              </div>

              {/* Receipt Action Footer */}
              <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>ደረሰኝ አትም (Print)</span>
                </button>

                <button
                  onClick={() => {
                    audioService.playChime('success');
                    alert(`ደረሰኝ ${selectedReceipt.receiptNumber} በስልክዎ ላይ ተቀምጧል!`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>አውርድ (PDF)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 p-8 text-center text-stone-500 text-xs">
              ከግራ በኩል የተከፈለ ግብር መርጠው ደረሰኝ ይመልከቱ።
            </div>
          )}
        </div>
      </div>

      {/* Payment Processing Modal */}
      {isPayModalOpen && selectedTaxToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-300" />
                  <span>የግብር ክፍያ ማጠናቀቂያ</span>
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">{selectedTaxToPay.category}</p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompletePayment} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                <span className="text-stone-600 font-semibold">የክፍያ መጠን፡</span>
                <span className="text-xl font-black text-emerald-900">
                  {selectedTaxToPay.amount.toLocaleString()} ብር
                </span>
              </div>

              {/* Bank Selector */}
              <div>
                <label className="block font-bold text-stone-700 mb-2">
                  የመክፈያ ባንክ ወይም ዲጂታል ዋሌት ይምረጡ፡
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bankOptions.map((bank) => (
                    <button
                      type="button"
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedBank === bank.id
                          ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-600/40'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <p className="font-bold text-stone-900 text-xs">{bank.name.split('(')[0]}</p>
                      <span className="text-[10px] text-stone-500">{bank.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  የተመዘገበ የሞባይል ስልክ ቁጥር
                </label>
                <input
                  type="text"
                  required
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-stone-700 space-y-1 text-[11px]">
                <p className="font-bold text-amber-900">ማረጋገጫ፡</p>
                <p>ክፍያውን እንዳጠናቀቁ በስርዓቱ ወዲያውኑ ህጋዊ ማህተም ያለው የገቢዎች ደረሰኝ ይዘጋጅልዎታል።</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg font-bold text-stone-800"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-extrabold shadow-md flex items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>ክፍያው እየተረጋገጠ ነው...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>ክፍያውን ፈፅም ({selectedTaxToPay.amount.toLocaleString()} ብር)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Revenue Category Modal */}
      {isAddCustomTaxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-300" />
                <span>አዲስ የመንግስት/የቀበሌ ተሰብሳቢ አርዕስት (ገደብ የለሽ)</span>
              </h3>
              <button
                onClick={() => setIsAddCustomTaxOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomRevenue} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  የተሰብሳቢ ገቢ አርዕስት ስም (Title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ለምሳሌ፡ የጤና መድህን መዋጮ፣ የወረዳ ደን ልማት ፈንድ..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  የክፍያ መጠን (በብር)
                </label>
                <input
                  type="number"
                  min="10"
                  required
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  የመክፈያ የመጨረሻ ቀን
                </label>
                <input
                  type="text"
                  required
                  value={customDueDate}
                  onChange={(e) => setCustomDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddCustomTaxOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg font-bold text-stone-800"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  አርዕስቱን መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
