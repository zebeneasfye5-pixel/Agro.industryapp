import React, { useState } from 'react';
import { FertilizerQueue, Language, FarmerProfile } from '../types';
import { translations } from '../utils/translations';
import { audioService } from '../utils/audio';
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Volume2,
  PackageCheck,
  ShieldCheck,
  Ticket,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';

interface FertilizerQueueViewProps {
  queues: FertilizerQueue[];
  onUpdateQueue: (updated: FertilizerQueue[]) => void;
  farmerProfile: FarmerProfile;
  currentLang: Language;
}

export const FertilizerQueueView: React.FC<FertilizerQueueViewProps> = ({
  queues,
  onUpdateQueue,
  farmerProfile,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [selectedQueue, setSelectedQueue] = useState<FertilizerQueue>(queues[0] || null);

  const handleSpeakQueuePass = (q: FertilizerQueue) => {
    const text = `የማዳበሪያ መውሰጃ ተራ ማስታወሻ። አርሶ አደር፡ ${q.farmerName}። ተራ ቁጥር፡ ${q.tokenNumber}። የመውሰጃ ቀን፡ ${q.assignedDate}። ሰዓት፡ ${q.timeSlot}። ቦታ፡ ${q.distributionCenter}። የተፈቀደ ማዳበሪያ፡ ${q.dapBags} ኩንታል DAP፣ ${q.ureaBags} ኩንታል ዩሪያ፣ ${q.npsBags} ኩንታል NPS፣ እና ${q.improvedSeedBags} ኩንታል ምርጥ ዘር። እባክዎ በተጠቀሰው ሰዓት ብቻ በመገኘት እንግልትን ያስወግዱ።`;
    audioService.speakText(text);
  };

  const handleMarkCollected = (queueId: string) => {
    const updated = queues.map((q) =>
      q.id === queueId ? { ...q, status: 'collected' as const } : q
    );
    onUpdateQueue(updated);
    audioService.playChime('success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-1">
              <Ticket className="w-4 h-4" />
              <span>የተራና የእንግልት ማስቀሪያ ዲጂታል ሥርዓት</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.fertilizerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-teal-200/90 max-w-2xl">
              {t.fertilizerSub}
            </p>
          </div>

          {selectedQueue && (
            <button
              onClick={() => handleSpeakQueuePass(selectedQueue)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
            >
              <Volume2 className="w-5 h-5" />
              <span>ተራዎን በድምፅ አዳምጡ</span>
            </button>
          )}
        </div>
      </div>

      {selectedQueue && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Active Ticket (Takes 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-emerald-600 shadow-xl overflow-hidden flex flex-col justify-between">
            {/* Ticket Header */}
            <div className="bg-emerald-800 p-5 text-white flex flex-wrap items-center justify-between gap-3 border-b-4 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-black text-xl shadow">
                  🌾
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold block">
                    የግብርና ግብአት ማከፋፈያ ህጋዊ ማለፊያ
                  </span>
                  <h3 className="text-xl font-black text-white">
                    ተራ ቁጥር፡ <span className="text-amber-300 font-mono">{selectedQueue.tokenNumber}</span>
                  </h3>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {selectedQueue.status === 'ready_today' ? (
                  <span className="px-3 py-1.5 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-950"></span>
                    ዛሬ የእርስዎ ቀን ነው!
                  </span>
                ) : selectedQueue.status === 'collected' ? (
                  <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ተጠናቋል / ተወስዷል
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    በመጠባበቅ ላይ
                  </span>
                )}
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-6">
              {/* Farmer and Location info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 block font-medium">የአርሶ አደር ስም</span>
                  <p className="text-base font-extrabold text-stone-900 mt-0.5">
                    {selectedQueue.farmerName}
                  </p>
                  <p className="text-stone-500 font-mono mt-0.5">
                    መታወቂያ፡ {farmerProfile.kebeleIdNumber}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 block font-medium">የማከፋፈያ ማህበር ጣቢያ</span>
                  <p className="text-sm font-bold text-stone-800 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>{selectedQueue.distributionCenter}</span>
                  </p>
                </div>
              </div>

              {/* Date & Time Slot Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-400 text-stone-950 shadow">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-900 font-bold block">የመውሰጃ ቀን (Pickup Date)</span>
                    <p className="text-lg font-black text-stone-950">{selectedQueue.assignedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-700 text-white shadow">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-900 font-bold block">የተመደበልዎት ሰዓት</span>
                    <p className="text-lg font-black text-emerald-950">{selectedQueue.timeSlot}</p>
                  </div>
                </div>
              </div>

              {/* Allocated Quota Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  የተፈቀደ የማዳበሪያና ምርጥ ዘር ኮታ (Allocated Quota)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="text-xs text-stone-500 font-semibold">DAP ማዳበሪያ</span>
                    <p className="text-2xl font-black text-emerald-900 mt-1">
                      {selectedQueue.dapBags} <span className="text-xs font-medium text-stone-600">ኩንታል</span>
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="text-xs text-stone-500 font-semibold">Urea (ዩሪያ)</span>
                    <p className="text-2xl font-black text-emerald-900 mt-1">
                      {selectedQueue.ureaBags} <span className="text-xs font-medium text-stone-600">ኩንታል</span>
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="text-xs text-stone-500 font-semibold">NPS ማዳበሪያ</span>
                    <p className="text-2xl font-black text-emerald-900 mt-1">
                      {selectedQueue.npsBags} <span className="text-xs font-medium text-stone-600">ኩንታል</span>
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-xs text-amber-800 font-semibold">የተመረጠ ዘር</span>
                    <p className="text-2xl font-black text-amber-950 mt-1">
                      {selectedQueue.improvedSeedBags} <span className="text-xs font-medium text-stone-600">ኩንታል</span>
                    </p>
                    <span className="text-[10px] text-amber-700 block truncate">{selectedQueue.seedType.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Payment and barcode validation section */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">የክፍያ ሁኔታ፡</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      ተከፍሏል ✓ ({selectedQueue.totalPriceBirr.toLocaleString()} ብር)
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    በማከፋፈያው በር ላይ ይህንን QR ኮድ ወይም ተራ ቁጥር ያሳዩ
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Visual Barcode / QR Simulation */}
                  <div className="p-2 bg-stone-100 rounded-lg border border-stone-300 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-emerald-900" />
                  </div>
                  <div className="font-mono text-[10px] text-stone-400">
                    <p>VERIFIED PASS</p>
                    <p>SECURE-ID-9041</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Footer Actions */}
            <div className="bg-stone-50 p-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl transition"
              >
                <Printer className="w-4 h-4" />
                <span>ይህንን ማለፊያ አትም (Print Pass)</span>
              </button>

              {selectedQueue.status !== 'collected' && (
                <button
                  onClick={() => handleMarkCollected(selectedQueue.id)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>ማዳበሪያውን ተረክቤያለሁ (Mark Collected)</span>
                </button>
              )}
            </div>
          </div>

          {/* Side Panel: Queue guidelines & batch notices */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
              <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700" />
                <span>ለአርሶ አደሮች ጠቃሚ መመሪያ</span>
              </h4>
              <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside">
                <li>
                  የተመደበልዎትን <strong>ሰዓትና ቀን ጠብቀው</strong> መምጣትዎን ያረጋግጡ፤ ያለተራዎ ከመጡ መስተናገድ አይችሉም።
                </li>
                <li>
                  የቀበሌ ነዋሪነት መታወቂያዎን ወይም <strong>ብሔራዊ ፋይዳ መታወቂያዎን</strong> ይዘው መቅረብ አለብዎት።
                </li>
                <li>
                  የመጫኛ ከረጢትና የመጓጓዣ እንስሳት ወይም ተሽከርካሪ አስቀድመው ያዘጋጁ።
                </li>
                <li>
                  ያለ አግባብ ተጨማሪ ክፍያ የጠየቀ ካለ ወዲያውኑ ለቀበሌው አስተዳዳሪ ሪፖርት ያድርጉ።
                </li>
              </ul>
            </div>

            {/* Other queued farmers in the kebele */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
              <h4 className="font-extrabold text-stone-900 text-sm">የቀበሌው የተራ ተራ መዝገብ</h4>
              <div className="space-y-2">
                {queues.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQueue(q)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                      selectedQueue.id === q.id
                        ? 'bg-emerald-50 border-emerald-600'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-stone-900">{q.farmerName}</p>
                      <p className="text-[11px] text-stone-500 font-mono">{q.tokenNumber} • {q.assignedDate}</p>
                    </div>
                    <span className="text-xs text-emerald-800 font-bold">
                      {q.status === 'ready_today' ? 'ዛሬ' : q.status === 'collected' ? 'ተጠናቋል' : 'ተራ'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
