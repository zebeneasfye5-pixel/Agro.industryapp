import React, { useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  FarmerProfile,
  FertilizerQueue,
  TaxItem,
  OfficialReceipt,
  CropListing,
  FarmerInquiry,
  CreatorWallet,
  InstitutionNode,
} from './types';
import { translations } from './utils/translations';
import {
  getStoredProfile,
  saveProfile,
  getStoredFertilizer,
  saveFertilizer,
  getStoredTaxes,
  saveTaxes,
  getStoredReceipts,
  saveReceipts,
  getStoredCrops,
  saveCrops,
  getStoredInquiries,
  saveInquiries,
  getStoredCreatorWallet,
  saveCreatorWallet,
  getStoredInstitutions,
  saveInstitutions,
} from './utils/storage';
import { Header } from './components/Header';
import { MarketplaceView } from './components/MarketplaceView';
import { FertilizerQueueView } from './components/FertilizerQueueView';
import { TaxesAndReceiptsView } from './components/TaxesAndReceiptsView';
import { VoiceGPSInquiryView } from './components/VoiceGPSInquiryView';
import { FarmerProfileView } from './components/FarmerProfileView';
import { AdminExtensionDashboard } from './components/AdminExtensionDashboard';
import { CreatorMonetizationView } from './components/CreatorMonetizationView';
import { InstitutionalNetworkView } from './components/InstitutionalNetworkView';
import { LivePublicShareModal } from './components/LivePublicShareModal';
import { PlayStoreModal } from './components/PlayStoreModal';
import { useOnlineStatus } from './hooks/usePWAInstall';
import { audioService } from './utils/audio';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Ticket,
  Receipt,
  Mic,
  UserCheck,
  Building2,
  WifiOff,
  Sparkles,
  Smartphone,
  PhoneCall,
  Volume2,
  Wallet,
  Network,
  Globe,
  Share2,
} from 'lucide-react';

export default function App() {
  const publicAppUrl = 'https://ais-pre-ielin6jgj7xjgutdzn4su3-125744783365.europe-west1.run.app';

  const [currentLang, setCurrentLang] = useState<Language>('am');
  const [currentRole, setCurrentRole] = useState<UserRole>('farmer');
  const [activeTab, setActiveTab] = useState<
    'market' | 'fertilizer' | 'taxes' | 'inquiries' | 'institutions' | 'creator' | 'profile' | 'admin'
  >('market');
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  const [isLiveShareModalOpen, setIsLiveShareModalOpen] = useState(false);

  // App state with local persistence
  const [profile, setProfile] = useState<FarmerProfile>(getStoredProfile);
  const [fertilizerQueues, setFertilizerQueues] = useState<FertilizerQueue[]>(getStoredFertilizer);
  const [taxes, setTaxes] = useState<TaxItem[]>(getStoredTaxes);
  const [receipts, setReceipts] = useState<OfficialReceipt[]>(getStoredReceipts);
  const [crops, setCrops] = useState<CropListing[]>(getStoredCrops);
  const [inquiries, setInquiries] = useState<FarmerInquiry[]>(getStoredInquiries);
  const [creatorWallet, setCreatorWallet] = useState<CreatorWallet>(getStoredCreatorWallet);
  const [institutions, setInstitutions] = useState<InstitutionNode[]>(getStoredInstitutions);

  const isOnline = useOnlineStatus();
  const t = translations[currentLang];

  // Save changes to localStorage
  const handleUpdateProfile = (newProfile: FarmerProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleUpdateFertilizer = (newQueues: FertilizerQueue[]) => {
    setFertilizerQueues(newQueues);
    saveFertilizer(newQueues);
  };

  const handleUpdateTaxesAndReceipts = (newTaxes: TaxItem[], newReceipts: OfficialReceipt[]) => {
    setTaxes(newTaxes);
    setReceipts(newReceipts);
    saveTaxes(newTaxes);
    saveReceipts(newReceipts);

    // Whenever tax is paid, creator earns 0.5% digital processing fee
    const updatedWallet: CreatorWallet = {
      ...creatorWallet,
      balanceBirr: creatorWallet.balanceBirr + 25.0,
      totalEarnedBirr: creatorWallet.totalEarnedBirr + 25.0,
      engagementRevenueBirr: creatorWallet.engagementRevenueBirr + 25.0,
      totalServiceTransactions: creatorWallet.totalServiceTransactions + 1,
    };
    setCreatorWallet(updatedWallet);
    saveCreatorWallet(updatedWallet);
  };

  const handleAddCrop = (newCrop: CropListing) => {
    const updated = [newCrop, ...crops];
    setCrops(updated);
    saveCrops(updated);
  };

  const handleAddInquiry = (newInquiry: FarmerInquiry) => {
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    saveInquiries(updated);
  };

  const handleUpdateCreatorWallet = (newWallet: CreatorWallet) => {
    setCreatorWallet(newWallet);
    saveCreatorWallet(newWallet);
  };

  // Like Crop Engagement monetization: +0.25 ETB royalty to creator
  const handleLikeCrop = (cropId: string) => {
    const updatedCrops = crops.map((c) =>
      c.id === cropId ? { ...c, likesCount: (c.likesCount || 0) + 1 } : c
    );
    setCrops(updatedCrops);
    saveCrops(updatedCrops);

    const updatedWallet: CreatorWallet = {
      ...creatorWallet,
      balanceBirr: creatorWallet.balanceBirr + 0.25,
      totalEarnedBirr: creatorWallet.totalEarnedBirr + 0.25,
      engagementRevenueBirr: creatorWallet.engagementRevenueBirr + 0.25,
      totalLikes: creatorWallet.totalLikes + 1,
    };
    setCreatorWallet(updatedWallet);
    saveCreatorWallet(updatedWallet);
  };

  // Share Crop Engagement monetization: +1.00 ETB royalty to creator
  const handleShareCrop = (crop: CropListing) => {
    const updatedCrops = crops.map((c) =>
      c.id === crop.id ? { ...c, sharesCount: (c.sharesCount || 0) + 1 } : c
    );
    setCrops(updatedCrops);
    saveCrops(updatedCrops);

    const updatedWallet: CreatorWallet = {
      ...creatorWallet,
      balanceBirr: creatorWallet.balanceBirr + 1.0,
      totalEarnedBirr: creatorWallet.totalEarnedBirr + 1.0,
      engagementRevenueBirr: creatorWallet.engagementRevenueBirr + 1.0,
      totalShares: creatorWallet.totalShares + 1,
    };
    setCreatorWallet(updatedWallet);
    saveCreatorWallet(updatedWallet);

    setIsLiveShareModalOpen(true);
  };

  const handleTabChange = (tab: typeof activeTab) => {
    audioService.playChime('click');
    setActiveTab(tab);
  };

  // Handle role change navigation
  useEffect(() => {
    if (currentRole === 'admin' && activeTab !== 'admin') {
      setActiveTab('admin');
    } else if (currentRole === 'creator' && activeTab !== 'creator') {
      setActiveTab('creator');
    } else if (currentRole === 'farmer' && (activeTab === 'admin' || activeTab === 'creator')) {
      setActiveTab('market');
    }
  }, [currentRole]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Top Main Navigation Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)}
        onOpenLiveShareModal={() => setIsLiveShareModalOpen(true)}
        creatorBalance={creatorWallet.balanceBirr}
      />

      {/* Offline Alert Strip when disconnected */}
      {!isOnline && (
        <div className="bg-amber-600 text-stone-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-inner border-b border-amber-700">
          <WifiOff className="w-4 h-4 text-stone-950 animate-bounce" />
          <span>
            ማስጠንቀቂያ፡ ኢንተርኔት አልተገናኘም። መተግበሪያው ሙሉ በሙሉ ከመስመር ውጭ (Offline) እየሰራ ነው፤ መረጃዎችዎ በስልክዎ ላይ ተቀምጠዋል!
          </span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <nav className="bg-white border-b border-stone-200 sticky top-[92px] sm:top-[98px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center overflow-x-auto no-scrollbar gap-1 sm:gap-2 py-2">
          {/* Market Tab */}
          <button
            onClick={() => handleTabChange('market')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
              activeTab === 'market'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>{t.tabMarket}</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/30 text-amber-200 font-mono">
              {crops.length}
            </span>
          </button>

          {/* Fertilizer Queue Tab */}
          <button
            onClick={() => handleTabChange('fertilizer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
              activeTab === 'fertilizer'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>{t.tabFertilizer}</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 font-bold">
              ዛሬ
            </span>
          </button>

          {/* Taxes & Receipts Tab */}
          <button
            onClick={() => handleTabChange('taxes')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
              activeTab === 'taxes'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>{t.tabTaxes}</span>
          </button>

          {/* Voice & GPS Inquiries Tab */}
          <button
            onClick={() => handleTabChange('inquiries')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
              activeTab === 'inquiries'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Mic className="w-4 h-4 text-amber-400" />
            <span>{t.tabInquiries}</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono">
              {inquiries.length}
            </span>
          </button>

          {/* Institutional Network Tab */}
          <button
            onClick={() => handleTabChange('institutions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
              activeTab === 'institutions'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Network className="w-4 h-4 text-amber-400" />
            <span>{t.tabInstitutions || 'የተቋማት ትስስር'}</span>
          </button>

          {/* Creator Royalties & Monetization Tab */}
          <button
            onClick={() => handleTabChange('creator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
              activeTab === 'creator'
                ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-800" />
            <span>{t.tabCreatorRevenue || 'የፈጣሪ ገቢና ወጪ'}</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-800 text-white font-mono">
              {creatorWallet.balanceBirr.toLocaleString()} ብር
            </span>
          </button>

          {/* Farmer & Family Profile Tab */}
          <button
            onClick={() => handleTabChange('profile')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
              activeTab === 'profile'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>{t.tabProfile}</span>
          </button>

          {/* Admin / Extension Worker Tab */}
          {currentRole === 'admin' && (
            <button
              onClick={() => handleTabChange('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
                activeTab === 'admin'
                  ? 'bg-stone-900 text-amber-400 shadow-md ring-2 ring-amber-400'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.tabAdmin}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 flex-1 w-full">
        {activeTab === 'market' && (
          <MarketplaceView
            crops={crops}
            onAddCrop={handleAddCrop}
            onLikeCrop={handleLikeCrop}
            onShareCrop={handleShareCrop}
            farmerProfile={profile}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'fertilizer' && (
          <FertilizerQueueView
            queues={fertilizerQueues}
            onUpdateQueue={handleUpdateFertilizer}
            farmerProfile={profile}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'taxes' && (
          <TaxesAndReceiptsView
            taxes={taxes}
            receipts={receipts}
            onUpdateTaxes={handleUpdateTaxesAndReceipts}
            farmerProfile={profile}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'inquiries' && (
          <VoiceGPSInquiryView
            inquiries={inquiries}
            onAddInquiry={handleAddInquiry}
            farmerProfile={profile}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'institutions' && (
          <InstitutionalNetworkView
            institutions={institutions}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'creator' && (
          <CreatorMonetizationView
            wallet={creatorWallet}
            onUpdateWallet={handleUpdateCreatorWallet}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'profile' && (
          <FarmerProfileView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'admin' && (
          <AdminExtensionDashboard
            farmerProfile={profile}
            fertilizerQueues={fertilizerQueues}
            onUpdateFertilizer={handleUpdateFertilizer}
            taxes={taxes}
            receipts={receipts}
            inquiries={inquiries}
            onUpdateInquiries={setInquiries}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Bottom Footer with Ethiopian agricultural branding */}
      <footer className="bg-emerald-950 text-white border-t border-emerald-900 mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-emerald-300/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 p-1 shadow">
              <img src="/icon.svg" alt="አርሶ አደር Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">
                ሀገር በቀል አርሶ አደር - Ethiopian Digital Farmer Hub
              </p>
              <p className="text-[11px] text-emerald-400">
                የኢፌዴሪ ግብርና ሚኒስቴር እና የገጠር ልማት ተነሳሽነት ፕሮግራም
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setIsLiveShareModalOpen(true)}
              className="text-amber-300 hover:underline font-bold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ይፋዊ የቀጥታ ሊንክ (Live Web Link)</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPlayStoreModalOpen(true)}
              className="text-amber-300 hover:underline font-bold flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ነፃ ሞባይል አፕሊኬሽን (APK) አውርድ</span>
            </button>
            <span>•</span>
            <span>ያለ ደላላ የቀጥታ ጥቅም</span>
            <span>•</span>
            <span>የቴሌብርና የባንክ ክፍያዎች</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[11px] text-stone-400">
              © 2018 ዓ.ም (2026 G.C) የኢትዮጵያ አርሶ አደሮች ዲጂታል ፖርታል
            </p>
          </div>
        </div>
      </footer>

      {/* Free Play Store & APK Download Modal */}
      <PlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
        currentLang={currentLang}
      />

      {/* Live Public Share Modal */}
      <LivePublicShareModal
        isOpen={isLiveShareModalOpen}
        onClose={() => setIsLiveShareModalOpen(false)}
        publicAppUrl={publicAppUrl}
        currentLang={currentLang}
      />
    </div>
  );
}
