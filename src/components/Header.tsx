import React, { useState } from 'react';
import { Language, UserRole } from '../types';
import { translations } from '../utils/translations';
import { audioService } from '../utils/audio';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import {
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Download,
  Smartphone,
  Globe,
  UserCheck,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenPlayStoreModal: () => void;
  onOpenLiveShareModal: () => void;
  creatorBalance?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  currentRole,
  onRoleChange,
  onOpenPlayStoreModal,
  onOpenLiveShareModal,
  creatorBalance,
}) => {
  const t = translations[currentLang];
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleVoiceWelcome = () => {
    if (isPlayingVoice) {
      audioService.stopSpeaking();
      setIsPlayingVoice(false);
      return;
    }

    const message =
      currentLang === 'am'
        ? 'እንኳን ወደ ሀገር በቀል አርሶ አደር ዲጂታል መድረክ በደህና መጡ። እዚህ ያለ ደላላ ምርትዎን መሸጥ፣ የማዳበሪያ መውሰጃ ተራዎን ማወቅ፣ የመሬት ግብር መክፈልና በድምፅ አቤቱታዎን ለባለሙያ ማስተላለፍ ይችላሉ።'
        : currentLang === 'om'
        ? 'Baga nagaan gara waltajjii qonnaan bulaa dijitaalaa dhuftan. Asitti oomisha keessan dallaalaa malee gurguruu fi dabare xaa\'oo beekuu dandeessu.'
        : currentLang === 'ti'
        ? 'እንቋዕ ብደሓን መፃእኹም። ኣብዚ ብዘይ ደላሊ ፍርያትኩም ክትሸጡን ተራ መዳበርያ ክትፈልጡን ትኽእሉ ኢኹም።'
        : 'Welcome to Hager Bekel Ethiopian Farmer Portal. Direct marketplace without brokers, fertilizer queues, land taxes, and voice inquiries.';

    setIsPlayingVoice(true);
    audioService.speakText(message, () => setIsPlayingVoice(false));
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b-4 border-amber-500">
      {/* Top micro bar for Ethiopian agricultural theme & status */}
      <div className="bg-emerald-950 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-200">የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ የግብርና ሚኒስቴር</span>
          </div>
          <span className="text-emerald-700 hidden sm:inline">|</span>
          <span className="text-stone-300 hidden md:inline">የገጠር አርሶ አደር ዲጂታል አገልግሎት</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Online/Offline Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium ${
              isOnline
                ? 'bg-emerald-800/80 text-emerald-200'
                : 'bg-amber-600 text-amber-50 animate-bounce'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.onlineBadge}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-200" />
                <span>{t.offlineBadge}</span>
              </>
            )}
          </div>

          {/* Voice Prompt Button */}
          <button
            onClick={handleVoiceWelcome}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition ${
              isPlayingVoice
                ? 'bg-amber-500 text-stone-900'
                : 'bg-emerald-800 hover:bg-emerald-700 text-amber-300'
            }`}
            title="ድምፅ አሰማ"
          >
            {isPlayingVoice ? (
              <>
                <VolumeX className="w-3.5 h-3.5 animate-spin" />
                <span>{t.stopVoice}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t.listenVoice}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Titles */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center p-1.5 shadow-inner shadow-amber-300/40 ring-2 ring-amber-300/60">
            <img src="/icon.svg" alt="አርሶ አደር Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                {t.appTitle}
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono">
                  v2.0
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium line-clamp-1">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls: Role switcher, Language, PWA / APK install */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Role selector dropdown */}
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="appearance-none bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 pr-7 rounded-lg border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-sm"
            >
              <option value="farmer">👨‍🌾 {t.roleFarmer}</option>
              <option value="admin">🏛️ {t.roleAdmin}</option>
              <option value="buyer">🛒 {t.roleBuyer}</option>
              <option value="creator">💰 {t.roleCreator || 'ገንቢ / ፈጣሪ'}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-emerald-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Language selector */}
          <div className="relative">
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="appearance-none bg-emerald-800/90 hover:bg-emerald-700 text-amber-200 text-xs font-bold px-3 py-2 pr-7 rounded-lg border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-sm"
            >
              <option value="am">አማርኛ (Amharic)</option>
              <option value="om">Afaan Oromoo</option>
              <option value="ti">ትግርኛ (Tigrinya)</option>
              <option value="en">English</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-200">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Live Public Share Button */}
          <button
            onClick={onOpenLiveShareModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-black px-3 py-2 rounded-lg shadow transition transform hover:-translate-y-0.5"
            title="የቀጥታ ድህረገጽ ሊንክ አጋራ"
          >
            <Globe className="w-3.5 h-3.5 text-stone-950 animate-spin" />
            <span>{t.btnShareLive || 'ቀጥታ አጋራ'}</span>
          </button>

          {/* PWA Install Button if available */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition transform hover:-translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.installApp}</span>
            </button>
          )}

          {/* Free Android APK & Play Store Package Modal trigger */}
          <button
            onClick={onOpenPlayStoreModal}
            className="flex items-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 text-xs font-medium px-3 py-2 rounded-lg border border-emerald-500/50 shadow-sm transition"
            title="ነፃ አንድሮይድ አፕ አውርድ"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.playStoreDownload}</span>
            <span className="sm:hidden">APK</span>
          </button>
        </div>
      </div>
    </header>
  );
};
