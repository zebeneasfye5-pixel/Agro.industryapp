import React, { useState } from 'react';
import {
  FarmerProfile,
  FertilizerQueue,
  TaxItem,
  OfficialReceipt,
  FarmerInquiry,
  Language,
} from '../types';
import { audioService } from '../utils/audio';
import {
  Users,
  Building2,
  Ticket,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  Search,
  Sparkles,
  Volume2,
  Calendar,
  Check,
} from 'lucide-react';

interface AdminExtensionDashboardProps {
  farmerProfile: FarmerProfile;
  fertilizerQueues: FertilizerQueue[];
  onUpdateFertilizer: (queues: FertilizerQueue[]) => void;
  taxes: TaxItem[];
  receipts: OfficialReceipt[];
  inquiries: FarmerInquiry[];
  onUpdateInquiries: (inquiries: FarmerInquiry[]) => void;
  currentLang: Language;
}

export const AdminExtensionDashboard: React.FC<AdminExtensionDashboardProps> = ({
  farmerProfile,
  fertilizerQueues,
  onUpdateFertilizer,
  taxes,
  receipts,
  inquiries,
  onUpdateInquiries,
  currentLang,
}) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'fertilizer' | 'taxes' | 'broadcast'>('inquiries');
  const [selectedInquiry, setSelectedInquiry] = useState<FarmerInquiry | null>(inquiries[0] || null);
  const [replyText, setReplyText] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Stats
  const totalTaxRevenue = receipts.reduce((acc, r) => acc + r.amount, 0);
  const totalFertilizerBags = fertilizerQueues.reduce((acc, q) => acc + q.dapBags + q.ureaBags + q.npsBags, 0);
  const pendingInquiriesCount = inquiries.filter((i) => i.status !== 'resolved').length;

  const handleResolveInquiry = (inquiryId: string) => {
    if (!replyText.trim()) return;

    const updated = inquiries.map((i) =>
      i.id === inquiryId
        ? {
            ...i,
            status: 'resolved' as const,
            officialResponse: replyText.trim(),
          }
        : i
    );
    onUpdateInquiries(updated);
    audioService.playChime('success');
    setReplyText('');
    setSelectedInquiry(null);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    audioService.playChime('success');
    audioService.speakText(`የቀበሌው የግብርና ጽህፈት ቤት ማስታወቂያ፡ ${broadcastMessage}`);
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-1">
              <Building2 className="w-4 h-4" />
              <span>የቀበሌና የወረዳ ግብርና ልማት አስተዳደር ዳሽቦርድ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              የልማት ጣቢያ ባለሙያ (DA) እና አስተዳዳሪ ክፍል
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
              የአርሶ አደሮችን አቤቱታ በጂፒኤስ የመከታተል፣ የማዳበሪያ ተራ የማዘጋጀትና የመንግስት ገቢ ደረሰኝ ማረጋገጫ ማዕከል
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-700" />
            የተመዘገቡ አርሶ አደሮች
          </span>
          <p className="text-2xl font-black text-stone-900">4,820</p>
          <span className="text-[11px] text-emerald-600 font-bold">100% በፋይዳ መታወቂያ የተረጋገጡ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-amber-600" />
            የተሰራጨ ማዳበሪያ
          </span>
          <p className="text-2xl font-black text-amber-950">{totalFertilizerBags + 450} <span className="text-xs font-semibold text-stone-500">ኩንታል</span></p>
          <span className="text-[11px] text-amber-700 font-bold">በተራ የወሰዱ፡ 85%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-blue-600" />
            የተሰበሰበ ግብርና ገቢ
          </span>
          <p className="text-2xl font-black text-blue-950">{totalTaxRevenue.toLocaleString()} <span className="text-xs font-semibold text-stone-500">ብር</span></p>
          <span className="text-[11px] text-blue-700 font-bold">በቴሌብርና በባንኮች የተረጋገጠ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            ክፍት የአደጋ ጥሪዎች
          </span>
          <p className="text-2xl font-black text-rose-900">{pendingInquiriesCount}</p>
          <span className="text-[11px] text-rose-600 font-bold">ፈጣን ምላሽ የሚሹ</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-stone-200 gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          የአርሶ አደር የጂፒኤስ አቤቱታዎች ({inquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('fertilizer')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'fertilizer'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          የማዳበሪያ ተራ መቆጣጠሪያ ({fertilizerQueues.length})
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'broadcast'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          የቀበሌ ማስታወቂያ ማስተላለፊያ (Broadcast)
        </button>
      </div>

      {/* Tab 1: Inquiries Management */}
      {activeTab === 'inquiries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">የገቡ ጥያቄዎች ዝርዝር</h4>
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => setSelectedInquiry(inq)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
                  selectedInquiry?.id === inq.id
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-md ring-2 ring-emerald-600/30'
                    : 'border-stone-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-stone-900 text-sm">{inq.farmerName}</span>
                    <span className="text-[11px] text-stone-500 block font-mono">
                      📞 {inq.farmerPhone} • {inq.kebele}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inq.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {inq.status === 'resolved' ? 'ተፈትቷል' : 'ክፍት ጥያቄ'}
                  </span>
                </div>
                <p className="font-bold text-stone-800 mt-2">{inq.title}</p>
                <p className="text-stone-600 line-clamp-2 mt-0.5">{inq.description}</p>
              </div>
            ))}
          </div>

          {/* Inquiry Detail and Response panel */}
          <div className="lg:col-span-6">
            {selectedInquiry ? (
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 text-xs">
                <div className="border-b border-stone-100 pb-3">
                  <span className="text-[10px] text-stone-400 font-mono">{selectedInquiry.id}</span>
                  <h3 className="font-black text-stone-900 text-base">{selectedInquiry.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-stone-600">
                    <span className="font-bold">{selectedInquiry.farmerName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedInquiry.latitude}°, {selectedInquiry.longitude}°
                    </span>
                  </div>
                </div>

                {selectedInquiry.imageUrl && (
                  <div>
                    <span className="text-stone-500 block font-bold mb-1">የተያያዘ የምስል ማስረጃ፡</span>
                    <img
                      src={selectedInquiry.imageUrl}
                      alt="Evidence"
                      className="w-full h-44 object-cover rounded-xl border border-stone-200"
                    />
                  </div>
                )}

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">የአርሶ አደሩ ሙሉ ዝርዝር፡</span>
                  <p className="text-stone-800 leading-relaxed">{selectedInquiry.description}</p>
                </div>

                {selectedInquiry.officialResponse ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 block">የተሰጠው ምላሽ፡</span>
                    <p className="text-emerald-950">{selectedInquiry.officialResponse}</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <label className="block font-bold text-stone-800">
                      የባለሙያ ይፋዊ ምላሽና መመሪያ መላኪያ፡
                    </label>
                    <textarea
                      rows={3}
                      placeholder="ለምሳሌ፡ የመድኃኒት ርጭት መመሪያ ወይም የባለሙያ መምጫ ሰዓት ይጻፉ..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <button
                      onClick={() => handleResolveInquiry(selectedInquiry.id)}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>ምላሹን ለአርሶ አደሩ ላክና አቤቱታውን ዝጋ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 p-8 text-center text-stone-500 text-xs">
                ከግራ በኩል አቤቱታ መርጠው በዝርዝር ይመልከቱ።
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Fertilizer Queue Management */}
      {activeTab === 'fertilizer' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h4 className="font-bold text-stone-900 text-sm">የማዳበሪያ ማከፋፈያ ተራ ዝርዝር አስተዳደር</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">ተራ ቁጥር</th>
                  <th className="p-3">የአርሶ አደር ስም</th>
                  <th className="p-3">DAP / ዩሪያ</th>
                  <th className="p-3">የመውሰጃ ቀንና ሰዓት</th>
                  <th className="p-3">ጣቢያ</th>
                  <th className="p-3">ሁኔታ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {fertilizerQueues.map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-emerald-800">{q.tokenNumber}</td>
                    <td className="p-3 font-bold text-stone-900">{q.farmerName}</td>
                    <td className="p-3">{q.dapBags} DAP / {q.ureaBags} Urea</td>
                    <td className="p-3">{q.assignedDate} • {q.timeSlot}</td>
                    <td className="p-3 text-stone-600">{q.distributionCenter.split('-')[0]}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {q.status === 'ready_today' ? 'ዛሬ ቀን ነው' : q.status === 'collected' ? 'ተወስዷል' : 'ተመድቧል'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Broadcast SMS / Voice Announcement */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 max-w-xl text-xs">
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              ለቀበሌው አርሶ አደሮች አስቸኳይ የድምፅና የጽሁፍ ማስታወቂያ
            </h4>
            <p className="text-stone-500 text-xs">
              የአየር ጠባይ ማስጠንቀቂያ፣ የማዳበሪያ ጭነት መድረሱን ወይም የክትባት ጥሪ ለሁሉም ያስተላልፉ
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <textarea
              rows={4}
              required
              placeholder="ለምሳሌ፡ ነገ ጠዋት ከ2፡00 ሰዓት ጀምሮ የDAP ማዳበሪያ ስርጭት በጣቢያ 1 ስለሚጀመር ተራ ቁጥር 1 እስከ 50 ያላችሁ በሰዓቱ ተገኙ..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />

            {broadcastSent ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>ማስታወቂያው በድምፅና በኤስኤምኤስ ለቀበሌው አርሶ አደሮች ተሰራጭቷል!</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>ማስታወቂያውን በድምፅና በፅሁፍ ለሁሉም አሰራጭ</span>
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
