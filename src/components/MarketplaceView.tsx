import React, { useState } from 'react';
import { CropListing, MarketPriceItem, Language, FarmerProfile } from '../types';
import { initialMarketPrices } from '../data/mockData';
import { translations } from '../utils/translations';
import { audioService } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Plus,
  Phone,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Volume2,
  MapPin,
  Calendar,
  X,
  Check,
  PackageCheck,
  ShieldCheck,
  DollarSign,
  Heart,
  Share2,
} from 'lucide-react';

interface MarketplaceViewProps {
  crops: CropListing[];
  onAddCrop: (crop: CropListing) => void;
  onLikeCrop?: (cropId: string) => void;
  onShareCrop?: (crop: CropListing) => void;
  farmerProfile: FarmerProfile;
  currentLang: Language;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  crops,
  onAddCrop,
  onLikeCrop,
  onShareCrop,
  farmerProfile,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedListingForOrder, setSelectedListingForOrder] = useState<CropListing | null>(null);
  const [selectedListingForCall, setSelectedListingForCall] = useState<CropListing | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(5);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form state for new harvest listing
  const [newCropName, setNewCropName] = useState('');
  const [newCropCategory, setNewCropCategory] = useState<CropListing['category']>('እህል (Grains)');
  const [newQuantity, setNewQuantity] = useState<number>(20);
  const [newPrice, setNewPrice] = useState<number>(10000);
  const [newLocation, setNewLocation] = useState(farmerProfile.woreda);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  );
  const [isOrganic, setIsOrganic] = useState(true);

  // Filter listings
  const filteredCrops = crops.filter((crop) => {
    const matchesCategory =
      selectedCategory === 'all' || crop.category.includes(selectedCategory);
    const matchesSearch =
      crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSpeakProduce = (crop: CropListing) => {
    const speech = `የምርት ስም፡ ${crop.cropName}። ዋጋ፡ በአንድ ኩንታል ${crop.pricePerQuintal.toLocaleString()} ብር። የቀረበ መጠን፡ ${crop.quantityQuintals} ኩንታል በ${crop.location}። አምራች አርሶ አደር፡ ${crop.farmerName}። ስልክ፡ ${crop.farmerPhone}።`;
    audioService.speakText(speech);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) return;

    const newListing: CropListing = {
      id: `CROP-${Date.now().toString().slice(-4)}`,
      farmerId: farmerProfile.id,
      farmerName: farmerProfile.fullName,
      farmerPhone: farmerProfile.phone,
      cropName: newCropName.trim(),
      category: newCropCategory,
      quantityQuintals: Number(newQuantity) || 10,
      pricePerQuintal: Number(newPrice) || 8000,
      location: newLocation || `${farmerProfile.woreda}፣ ${farmerProfile.kebele}`,
      region: farmerProfile.region,
      harvestDate: 'የካቲት 2018 ዓ.ም',
      description: newDescription.trim() || 'በጥራት የተመረተ ምርጥ የሀገር ውስጥ ምርት።',
      imageUrl: newImageUrl,
      isOrganic,
      isVerifiedFarmer: true,
    };

    onAddCrop(newListing);
    audioService.playChime('success');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setIsPostModalOpen(false);
    setNewCropName('');
    setNewDescription('');
  };

  const handleConfirmOrder = () => {
    if (!selectedListingForOrder) return;
    audioService.playChime('success');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedListingForOrder(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-amber-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>ደላላን የሚያስቀር የቀጥታ ገበያ (Zero Brokerage Fee)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.directMarketTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
              {t.directMarketSub}
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-sm"
          >
            <Plus className="w-5 h-5 text-stone-950" />
            <span>{t.postProduce}</span>
          </button>
        </div>
      </div>

      {/* Real-time Commodity Market Ticker */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span>{t.todayMarketPrices}</span>
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">የካቲት 2018 ዓ.ም - ECX Live</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {initialMarketPrices.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1 hover:border-emerald-400 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 truncate">{item.cropName.split('(')[0]}</span>
                <span
                  className={`flex items-center font-bold text-[10px] ${
                    item.changeRate >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {item.changeRate >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {item.changeRate}%
                </span>
              </div>
              <p className="text-sm font-extrabold text-emerald-950">
                {item.averagePriceBirr.toLocaleString()} <span className="text-[10px] font-normal text-stone-500">ብር/ኩን</span>
              </p>
              <p className="text-[10px] text-stone-500 truncate">{item.majorMarket.split('/')[0]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="ሰብል፣ አካባቢ ወይም አርሶ አደር ስም ይፈልጉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'ሁሉም (All)' },
            { id: 'እህል', label: 'እህል (Grains)' },
            { id: 'ጥራጥሬ', label: 'ጥራጥሬ (Pulses)' },
            { id: 'ቅባት', label: 'የቅባት እህሎች' },
            { id: 'ቡና', label: 'ቡና' },
            { id: 'አትክልት', label: 'አትክልት' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition group"
          >
            {/* Image & Badges */}
            <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
              <img
                src={crop.imageUrl}
                alt={crop.cropName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-emerald-800/90 text-amber-300 font-bold text-[11px] backdrop-blur-sm shadow flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  የተረጋገጠ አርሶ አደር
                </span>
                {crop.isOrganic && (
                  <span className="px-2 py-0.5 rounded-full bg-green-600/90 text-white font-semibold text-[10px] backdrop-blur-sm">
                    ኦርጋኒክ
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => handleSpeakProduce(crop)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition shadow"
                  title="መረጃውን አዳምጥ"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Produce Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    {crop.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {crop.harvestDate}
                  </span>
                </div>

                <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-emerald-800 transition">
                  {crop.cropName}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                  {crop.description}
                </p>
              </div>

              {/* Price & Quantity Box */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 font-medium">የአንድ ኩንታል ዋጋ</span>
                  <p className="text-xl font-extrabold text-emerald-950">
                    {crop.pricePerQuintal.toLocaleString()} <span className="text-xs font-bold text-stone-600">ብር</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 font-medium">ያለው ክምችት</span>
                  <p className="text-base font-extrabold text-stone-900">
                    {crop.quantityQuintals} <span className="text-xs font-semibold text-stone-500">ኩንታል</span>
                  </p>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400">አምራች፡</span>{' '}
                  <span className="font-bold text-stone-800">{crop.farmerName}</span>
                </div>
                <span className="font-mono text-stone-600 font-semibold">{crop.farmerPhone}</span>
              </div>

              {/* Like and Share Monetization Row */}
              <div className="flex items-center justify-between py-1.5 px-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <button
                  onClick={() => {
                    if (onLikeCrop) onLikeCrop(crop.id);
                    audioService.playChime('click');
                  }}
                  className="flex items-center gap-1.5 text-stone-700 hover:text-rose-600 font-bold transition group"
                  title="ምርቱን ውደዱ (የፈጣሪ ገቢ +0.25 ብር)"
                >
                  <Heart className="w-4 h-4 text-rose-500 group-hover:scale-125 transition transform" />
                  <span>{crop.likesCount || 0} ላይክ</span>
                </button>

                <button
                  onClick={() => {
                    if (onShareCrop) onShareCrop(crop);
                    audioService.playChime('click');
                  }}
                  className="flex items-center gap-1.5 text-stone-700 hover:text-emerald-700 font-bold transition group"
                  title="ምርቱን ያጋሩ (የፈጣሪ ገቢ +1.00 ብር)"
                >
                  <Share2 className="w-4 h-4 text-emerald-600 group-hover:scale-125 transition transform" />
                  <span>{crop.sharesCount || 0} አጋራ</span>
                </button>
              </div>

              {/* Direct Actions: Call & Direct Order */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setSelectedListingForCall(crop)}
                  className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ደውል (Call)</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedListingForOrder(crop);
                    setOrderQuantity(Math.min(5, crop.quantityQuintals));
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.orderDirect}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Harvest Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-300" />
                <span>አዲስ ምርት ሽያጭ ይለጥፉ (ያለ ደላላ)</span>
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  የሰብል ስምና ዝርያ (Crop Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ለምሳሌ፡ ጤፍ ማኛ፣ ቦስ አዲሶ ስንዴ፣ ቀይ ሽንኩርት"
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">የምርት ምድብ</label>
                  <select
                    value={newCropCategory}
                    onChange={(e) => setNewCropCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="እህል (Grains)">እህል (Grains)</option>
                    <option value="ጥራጥሬ (Pulses)">ጥራጥሬ (Pulses)</option>
                    <option value="የቅባት እህሎች (Oilseeds)">የቅባት እህሎች (Oilseeds)</option>
                    <option value="ቡናና ቅመማቅመም (Coffee & Spices)">ቡናና ቅመማቅመም (Coffee)</option>
                    <option value="አትክልትና ፍራፍሬ (Vegetables)">አትክልትና ፍራፍሬ (Vegetables)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">የቀረበ መጠን (በኩንታል)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">የአንድ ኩንታል ዋጋ (በብር)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">የምርት መገኛ ቦታ</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">የምርት ፎቶ ማሳያ (Image URL)</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">ዝርዝር ማብራሪያ</label>
                <textarea
                  rows={2}
                  placeholder="የምርቱ ጥራት፣ እንዴት እንደተመረተ፣ የመጫኛ ሁኔታ..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organicCheck"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="organicCheck" className="text-stone-700 font-medium">
                  ያለ ሰው ሰራሽ ኬሚካል የተመረተ ተፈጥሮአዊ (Organic) ነው
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg font-bold text-stone-800"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-md"
                >
                  ምርቱን ለሽያጭ አውጣ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Order Modal */}
      {selectedListingForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-300" />
                  <span>ቀጥታ የምርት ትዕዛዝ (ያለ ደላላ)</span>
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  ከአርሶ አደር {selectedListingForOrder.farmerName} በቀጥታ መግዛት
                </p>
              </div>
              <button
                onClick={() => setSelectedListingForOrder(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                <img
                  src={selectedListingForOrder.imageUrl}
                  alt={selectedListingForOrder.cropName}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {selectedListingForOrder.cropName}
                  </h4>
                  <p className="text-emerald-800 font-extrabold text-xs">
                    {selectedListingForOrder.pricePerQuintal.toLocaleString()} ብር / ኩንታል
                  </p>
                  <p className="text-[11px] text-stone-500">
                    ቦታ፡ {selectedListingForOrder.location}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  የሚፈልጉት መጠን (በኩንታል)
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedListingForOrder.quantityQuintals}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-lg font-extrabold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  ከፍተኛ የቀረበ መጠን፡ {selectedListingForOrder.quantityQuintals} ኩንታል
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>የአንዱ ዋጋ፡</span>
                  <span>{selectedListingForOrder.pricePerQuintal.toLocaleString()} ብር</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>የደላላ ኮሚሽን ክፍያ፡</span>
                  <span className="text-emerald-700 font-bold">0.00 ብር (ነፃ)</span>
                </div>
                <div className="flex justify-between text-stone-900 font-extrabold text-base pt-2 border-t border-stone-200">
                  <span>ጠቅላላ የሚከፈል፡</span>
                  <span className="text-emerald-900">
                    {(selectedListingForOrder.pricePerQuintal * orderQuantity).toLocaleString()} ብር
                  </span>
                </div>
              </div>

              {orderSuccess ? (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-950 font-bold flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-700" />
                  <span>ትዕዛዝዎ ተመዝግቧል! ለአርሶ አደሩ የኤስኤምኤስ መልዕክት ተልኳል።</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleConfirmOrder}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <PackageCheck className="w-5 h-5 text-amber-300" />
                    <span>ትዕዛዙን አረጋግጥና ለአርሶ አደሩ ላክ</span>
                  </button>

                  <a
                    href={`tel:${selectedListingForOrder.farmerPhone}`}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>በቀጥታ በስልክ ተነጋገር ({selectedListingForOrder.farmerPhone})</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Direct Call Dialog */}
      {selectedListingForCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Phone className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">
                ለአርሶ አደሩ በቀጥታ ይደውሉ
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {selectedListingForCall.farmerName} • {selectedListingForCall.location}
              </p>
              <p className="font-mono text-2xl font-black text-emerald-900 mt-2">
                {selectedListingForCall.farmerPhone}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setSelectedListingForCall(null)}
                className="py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs"
              >
                ዝጋ
              </button>
              <a
                href={`tel:${selectedListingForCall.farmerPhone}`}
                className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Phone className="w-4 h-4" />
                <span>አሁን ደውል</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
