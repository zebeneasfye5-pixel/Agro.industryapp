import React, { useState } from 'react';
import { Language } from '../types';
import { audioService } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Globe,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Users,
  Printer,
  Sparkles,
} from 'lucide-react';

interface LivePublicShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicAppUrl: string;
  currentLang: Language;
}

export const LivePublicShareModal: React.FC<LivePublicShareModalProps> = ({
  isOpen,
  onClose,
  publicAppUrl,
  currentLang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicAppUrl);
    setCopied(true);
    audioService.playChime('success');
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(
    '🌱 እንኳን ወደ ሀገር በቀል አርሶ አደር ዲጂታል መድረክ በደህና መጡ! ያለ ደላላ የቀጥታ ምርት መሸጫ፣ የማዳበሪያ ተራና የመሬት ግብር ደረሰኝ በቀጥታ በስልክዎ ይጠቀሙ፡ ' +
      publicAppUrl
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-stone-900 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 p-1.5 shadow-lg flex items-center justify-center text-stone-950">
              <Globe className="w-7 h-7 text-stone-900 animate-pulse" />
            </div>
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-700 text-amber-300 font-bold">
                ቀጥታ በኢንተርኔት ላይ ተጭኗል (Live Online)
              </span>
              <h3 className="text-xl font-black mt-1">አሁንኑ ለማንኛውም ሰው ያጋሩ!</h3>
              <p className="text-xs text-emerald-200">
                የትኛውም ሰው ያለምንም ክፍያ በቀጥታ በዚህ ሊንክ መጠቀም ይችላል
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Public Link Box with One-Click Copy */}
          <div className="space-y-2">
            <label className="block font-bold text-stone-700">
              ይፋዊ የቀጥታ ድህረገጽ ሊንክ (Public Live Web & App URL)
            </label>
            <div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-300 rounded-xl">
              <input
                type="text"
                readOnly
                value={publicAppUrl}
                className="w-full bg-transparent font-mono text-xs text-emerald-900 font-bold focus:outline-none px-2 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>ኮፒ ተደረገ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-300" />
                    <span>ሊንኩን ኮፒ አድርግ</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code and Mobile Access Section */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-white rounded-xl border border-stone-300 shadow-sm flex items-center justify-center flex-shrink-0">
              <QrCode className="w-24 h-24 text-emerald-950" />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="font-bold text-stone-900 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>በስልክ ካሜራ ስካን ያድርጉ</span>
              </h4>
              <p className="text-stone-600 text-xs">
                ማንኛውም አርሶ አደር ወይም ነጋዴ ይህንን QR ኮድ በስማርት ስልኩ ካሜራ ስካን በማድረግ በቀጥታ መተግበሪያውን መክፈት ይችላል።
              </p>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold hover:underline"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>የቀበሌ ማስታወቂያ ሰሌዳ ፖስተር አትም</span>
              </button>
            </div>
          </div>

          {/* Social Share One-Click Buttons */}
          <div className="space-y-2">
            <span className="block font-bold text-stone-700">
              በማህበራዊ ሚዲያዎችና በኤስኤምኤስ ወዲያውኑ አሰራጭ፡
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(publicAppUrl)}&text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <span>Telegram</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicAppUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <span>Facebook</span>
              </a>

              <a
                href={`sms:?body=${shareText}`}
                className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <span>SMS መልዕክት</span>
              </a>
            </div>
          </div>

          {/* Live System Traffic Badge */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
              <span className="font-bold text-emerald-950">አሁን በመስመር ላይ ያሉ ተጠቃሚዎች፡</span>
            </div>
            <strong className="text-emerald-900 font-mono text-sm">3,490+ አርሶ አደሮች</strong>
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
