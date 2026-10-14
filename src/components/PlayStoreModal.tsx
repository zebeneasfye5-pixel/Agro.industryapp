import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import {
  X,
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  WifiOff,
  QrCode,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { audioService } from '../utils/audio';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const t = translations[currentLang];

  if (!isOpen) return null;

  const handleSimulateApkDownload = () => {
    audioService.playChime('click');
    setDownloadProgress(0);
    setDownloadComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setDownloadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setDownloadComplete(true);
        audioService.playChime('success');
      }
    }, 280);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
        {/* Banner with Ethiopian agricultural artwork styling */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 p-2 shadow-lg ring-4 ring-amber-300/30 flex-shrink-0">
              <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-amber-300 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% ነፃ የገጠር አፕሊኬሽን</span>
              </div>
              <h2 className="text-xl font-bold">ሀገር በቀል አርሶ አደር ሞባይል አፕ</h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                ያለ ኢንተርኔት በየትኛውም የኢትዮጵያ ገጠር በቀጥታ የሚሰራ
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
              <WifiOff className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">ኔትወርክ በሌለበት ይሰራል</p>
                <p className="text-emerald-700 mt-0.5">መረጃዎ በስልክዎ ላይ ተቀምጦ ኔትወርክ ሲያገኝ በራሱ ይገናኛል</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/80">
              <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">ያለ ደላላ የቀጥታ ጥቅም</p>
                <p className="text-amber-700 mt-0.5">ያለምንም ክፍያ በቀጥታ ለነጋዴና ሸማች መሸጫ</p>
              </div>
            </div>
          </div>

          {/* Download APK Box */}
          <div className="p-4 rounded-xl border-2 border-dashed border-emerald-600 bg-stone-50 text-center space-y-3">
            <h3 className="text-sm font-bold text-stone-900">
              የአንድሮይድ መጫኛ ፓኬጅ (Standalone Android APK)
            </h3>
            <p className="text-xs text-stone-600">
              ፋይል መጠን፡ 6.4 MB | ስሪት፡ 2.0 (ከአንድሮይድ 6.0 ጀምሮ ይሰራል)
            </p>

            {downloadProgress !== null && !downloadComplete && (
              <div className="space-y-1.5">
                <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs font-semibold text-emerald-800">
                  እየወረደ ነው... {downloadProgress}%
                </p>
              </div>
            )}

            {downloadComplete ? (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-semibold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>አፕሊኬሽኑ ወርዷል! በስልክዎ ፋይል ማናጀር ላይ ይጫኑት።</span>
              </div>
            ) : (
              <button
                onClick={handleSimulateApkDownload}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>አፑን በነፃ አውርድ (Direct APK Download)</span>
              </button>
            )}
          </div>

          {/* Quick Install on Chrome/Android & iOS */}
          <div className="space-y-3 text-xs text-stone-700 bg-stone-100 p-4 rounded-xl">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>በቀጥታ በስልክ ስክሪን ላይ ለመጨመር (PWA)፡</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-600 pl-1">
              <li>በስልክዎ Chrome ወይም Safari ብሮውዘር ይክፈቱ</li>
              <li>የብሮውዘሩን <strong>⋮ (ሶስት ነጥብ)</strong> ወይም <strong>Share (አጋራ)</strong> ይጫኑ</li>
              <li><strong>"ወደ ስልክ ስክሪን ጨምር (Add to Home Screen)"</strong> የሚለውን ይምረጡ</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition"
          >
            ዝጋ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
