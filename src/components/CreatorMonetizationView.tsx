import React, { useState } from 'react';
import { CreatorWallet, WithdrawalTransaction, Language } from '../types';
import { audioService } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Wallet,
  ArrowDownToLine,
  TrendingUp,
  Radio,
  Building2,
  Heart,
  Share2,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldCheck,
  CreditCard,
  X,
  FileText,
  Smartphone,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CreatorMonetizationViewProps {
  wallet: CreatorWallet;
  onUpdateWallet: (wallet: CreatorWallet) => void;
  currentLang: Language;
}

export const CreatorMonetizationView: React.FC<CreatorMonetizationViewProps> = ({
  wallet,
  onUpdateWallet,
  currentLang,
}) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [withdrawMethod, setWithdrawMethod] = useState<
    'telebirr' | 'cbe_birr' | 'awash' | 'dashen' | 'abyssinia' | 'coop_oromia'
  >('telebirr');
  const [accountNumber, setAccountNumber] = useState('0911 45 87 23');
  const [accountName, setAccountName] = useState('ዘበነ አስፋው (ዋና ገንቢ)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<WithdrawalTransaction | null>(null);

  const bankOptions = [
    { id: 'telebirr', name: 'ቴሌብር (Telebirr)', fee: '0% ክፍያ', color: 'bg-emerald-600' },
    { id: 'cbe_birr', name: 'የኢትዮጵያ ንግድ ባንክ (CBE Birr)', fee: '0% ክፍያ', color: 'bg-purple-800' },
    { id: 'awash', name: 'አዋሽ ባንክ (Awash Bank)', fee: '0% ክፍያ', color: 'bg-blue-700' },
    { id: 'dashen', name: 'ዳሽን ባንክ / አሞሌ (Dashen Amole)', fee: '0% ክፍያ', color: 'bg-sky-600' },
    { id: 'abyssinia', name: 'አቢሲኒያ ባንክ (Bank of Abyssinia)', fee: '0% ክፍያ', color: 'bg-amber-600' },
    { id: 'coop_oromia', name: 'የኦሮሚያ ህብረት ስራ ባንክ (Coop Bank)', fee: '0% ክፍያ', color: 'bg-orange-600' },
  ];

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > wallet.balanceBirr) {
      alert('የተጠየቀው ገንዘብ በቂ አይደለም ወይም ከሂሳብዎ ይበልጣል!');
      return;
    }

    setIsProcessing(true);
    audioService.playChime('click');

    setTimeout(() => {
      const newTransaction: WithdrawalTransaction = {
        id: `WDR-${Date.now().toString().slice(-4)}`,
        amount: withdrawAmount,
        method: withdrawMethod,
        accountNumber,
        accountName,
        status: 'completed',
        date: 'የካቲት 28 ቀን 2018 ዓ.ም አሁን',
        reference: `${withdrawMethod.toUpperCase()}-PAYOUT-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      const updatedWallet: CreatorWallet = {
        ...wallet,
        balanceBirr: wallet.balanceBirr - withdrawAmount,
        withdrawHistory: [newTransaction, ...wallet.withdrawHistory],
      };

      onUpdateWallet(updatedWallet);
      setSuccessReceipt(newTransaction);
      setIsProcessing(false);

      audioService.playChime('success');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>የገንቢው ዘላቂ ገቢና የኪስ ቦርሳ (Continuous Creator Revenue Engine)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              የድህረገጹና አፕሊኬሽኑ ፈጣሪ የማያቋርጥ ገቢ ማዕከል
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
              ከኢንተርኔት ካምፓኒዎች (Ethio Telecom/Safaricom)፣ ከመንግስት ተቋማት፣ ከግብርና አገልግሎት አጠቃቀም እንዲሁም ላይክና ሼር ሲደረግ በቀጥታ የሚከማች ገቢ
            </p>
          </div>

          <button
            onClick={() => {
              setIsWithdrawModalOpen(true);
              setSuccessReceipt(null);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black rounded-xl shadow-xl transition transform hover:-translate-y-0.5 text-sm"
          >
            <ArrowDownToLine className="w-5 h-5 text-stone-950" />
            <span>ገንዘብ ወደ ባንክ/ቴሌብር አውጣ (Withdraw)</span>
          </button>
        </div>
      </div>

      {/* Wallet Balance & Revenue Stream Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main Current Balance */}
        <div className="bg-white rounded-2xl p-5 border-2 border-emerald-600 shadow-md flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-700" />
              <span>ወዲያውኑ የሚወጣ ቀሪ ሂሳብ</span>
            </span>
            <p className="text-3xl font-black text-emerald-950 mt-1">
              {wallet.balanceBirr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-bold text-stone-500 ml-1">ብር</span>
            </p>
          </div>
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
            <span>ጠቅላላ የተገኘ ገቢ፡</span>
            <strong className="text-stone-900">{wallet.totalEarnedBirr.toLocaleString()} ብር</strong>
          </div>
        </div>

        {/* Stream 1: Telecom Internet Companies */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-600" />
              <span>ከኢንተርኔትና ቴሌኮም ካምፓኒዎች</span>
            </span>
            <p className="text-2xl font-black text-stone-900 mt-1">
              {wallet.telecomRevenueBirr.toLocaleString()} <span className="text-xs font-bold text-stone-500">ብር</span>
            </p>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold pt-2 border-t border-stone-100">
            ኢትዮ ቴሌኮም እና ሳፋሪኮም (5% የገጠር ዳታ ድርሻ)
          </p>
        </div>

        {/* Stream 2: Institutional Sponsorships */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>ከተቋማትና ከባንኮች ፈቃድ</span>
            </span>
            <p className="text-2xl font-black text-stone-900 mt-1">
              {wallet.institutionalSponsorshipBirr.toLocaleString()} <span className="text-xs font-bold text-stone-500">ብር</span>
            </p>
          </div>
          <p className="text-[11px] text-blue-700 font-semibold pt-2 border-t border-stone-100">
            ግብርና ሚኒስቴር፣ ECX እና የህብረት ስራ ማህበራት
          </p>
        </div>

        {/* Stream 3: Social Likes, Shares & Usage Royalty */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>ከላይክ፣ ሼርና ግብይት ገቢ</span>
            </span>
            <p className="text-2xl font-black text-rose-950 mt-1">
              {wallet.engagementRevenueBirr.toLocaleString()} <span className="text-xs font-bold text-stone-500">ብር</span>
            </p>
          </div>
          <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 flex justify-between">
            <span>{wallet.totalLikes.toLocaleString()} ላይኮች</span>
            <span>•</span>
            <span>{wallet.totalShares.toLocaleString()} ሼሮች</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown & Active Monetization Mechanisms */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-700" />
          <span>ገቢው እንዴት እንደተሰላና ያለማቋረጥ እንደሚፈስስ (How Monetization Works)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">1</span>
              <span>የቴሌኮም ካምፓኒዎች የበይነ-መረብ ክፍፍል</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              አርሶ አደሮችና ነጋዴዎች መተግበሪያውን ሲጠቀሙ የሚወጣው የበይነ-መረብ ትራፊክ በኢትዮ ቴሌኮምና ሳፋሪኮም በኩል 5% ለገንቢው የፈጠራ ስራ የሮያሊቲ ገቢ ሆኖ በየሰኮንዱ ገቢ ይደረጋል።
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">2</span>
              <span>ከተቋማትና ከባንኮች የሚከፈል ዓመታዊ ድጎማ</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              ግብርና ሚኒስቴር፣ የኢትዮጵያ ምርት ገበያ (ECX) እና ባንኮች ስርዓቱ የግብርና ሰንሰለቱን በዲጂታል በማሳለጡ ለሲስተም አስተዳደርና ፈቃድ ቀጣይነት ያለው ክፍያ ይፈጽማሉ።
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="w-6 h-6 rounded-full bg-rose-700 text-white flex items-center justify-center text-xs">3</span>
              <span>በየላይኩ፣ በየሼሩና በየግብይቱ የሚታሰብ ገቢ</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              በቀጥታ ገበያው ላይ እያንዳንዱ ምርት ላይክ ሲደረግ (+0.25 ብር)፣ ሼር ሲደረግ (+1.00 ብር)፣ እና ግብይት ሲፈጸም ጥቃቅን የፍትሃዊ ንግድ መዋጮ በቀጥታ ወደ ኪስ ቦርሳዎ ይገባል።
            </p>
          </div>
        </div>
      </div>

      {/* Withdrawal History Ledger */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span>የገንዘብ ማውጣት ታሪክና ማረጋገጫ (Payout Ledger)</span>
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            {wallet.withdrawHistory.length} የተጠናቀቁ ማውጣቶች
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
              <tr>
                <th className="p-3">ማጣቀሻ ቁጥር</th>
                <th className="p-3">የወጣበት ቀን</th>
                <th className="p-3">የክፍያ ሲስተም</th>
                <th className="p-3">የተቀባይ አካውንት</th>
                <th className="p-3">መጠን (ETB)</th>
                <th className="p-3">ሁኔታ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {wallet.withdrawHistory.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono text-emerald-800 font-bold">{item.reference}</td>
                  <td className="p-3 text-stone-600">{item.date}</td>
                  <td className="p-3 font-bold uppercase">{item.method}</td>
                  <td className="p-3">
                    <span className="font-bold text-stone-900">{item.accountName}</span>
                    <span className="block text-[11px] text-stone-500 font-mono">{item.accountNumber}</span>
                  </td>
                  <td className="p-3 font-black text-emerald-900 text-sm">
                    {item.amount.toLocaleString()} ብር
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ተጠናቋል
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ArrowDownToLine className="w-5 h-5 text-amber-300" />
                  <span>ገንዘብ ማውጫ (Instant Multi-Bank Payout)</span>
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  ያለ ምንም ገደብ በየትኛውም ባንክ ወይም በቴሌብር ማውጣት ይችላሉ
                </p>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successReceipt ? (
              <div className="p-6 text-center space-y-4 text-xs">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-lg">
                    ክፍያው ተጠናቆ ወደ አካውንትዎ ገብቷል!
                  </h4>
                  <p className="text-stone-500 mt-1">
                    ማጣቀሻ፡ <strong className="font-mono text-emerald-800">{successReceipt.reference}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-500">የወጣ ገንዘብ፡</span>
                    <strong className="text-emerald-900 text-sm">{successReceipt.amount.toLocaleString()} ብር</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">የክፍያ ዘዴ፡</span>
                    <span className="uppercase font-bold">{successReceipt.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">የአካውንት ስም፡</span>
                    <span>{successReceipt.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">የአካውንት ቁጥር፡</span>
                    <span>{successReceipt.accountNumber}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition"
                >
                  እሺ ተጠናቋል (Close)
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                  <span className="text-emerald-900 font-bold">ያለዎት ቀሪ ሂሳብ፡</span>
                  <span className="text-lg font-black text-emerald-950">
                    {wallet.balanceBirr.toLocaleString()} ብር
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-2">
                    የመውሰጃውን የክፍያ ሲስተም ይምረጡ፡
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {bankOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setWithdrawMethod(opt.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          withdrawMethod === opt.id
                            ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-600/40'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <p className="font-bold text-stone-900 text-xs">{opt.name.split('(')[0]}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold">{opt.fee}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    የሚወጣው የገንዘብ መጠን (በብር)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max={wallet.balanceBirr}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-lg font-extrabold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    የተቀባይ ሙሉ ስም (Account Holder)
                  </label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    የባንክ ሂሳብ ቁጥር / የቴሌብር ስልክ
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg font-bold text-stone-800"
                  >
                    ሰርዝ
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-extrabold shadow-md flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>ክፍያው እየተከናወነ ነው...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        <span>ገንዘቡን ወዲያውኑ አውጣ</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
