import React, { useState } from 'react';
import { X, Calculator, Sprout, Layers, ArrowRightLeft, Check, Sparkles } from 'lucide-react';
import { audioService } from '../utils/audio';

interface LandCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHectares?: number;
  initialResidenceSqM?: number;
  onApplyToProfile?: (landData: {
    totalHectares: number;
    qada: number;
    timad: number;
    squareMeters: number;
    residenceAreaSqM: number;
  }) => void;
}

export const LandCalculatorModal: React.FC<LandCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialHectares = 2.5,
  initialResidenceSqM = 400,
  onApplyToProfile,
}) => {
  // Input mode: 'hectare' | 'qada' | 'timad' | 'sqm' | 'dimensions'
  const [activeUnit, setActiveUnit] = useState<'hectare' | 'qada' | 'timad' | 'sqm' | 'dimensions'>('hectare');
  const [inputValue, setInputValue] = useState<number>(initialHectares);
  const [lengthM, setLengthM] = useState<number>(100);
  const [widthM, setWidthM] = useState<number>(250);
  const [residenceSqM, setResidenceSqM] = useState<number>(initialResidenceSqM);
  const [selectedCrop, setSelectedCrop] = useState<'teff' | 'wheat' | 'maize' | 'barley' | 'chickpea'>('teff');
  const [appliedNotification, setAppliedNotification] = useState(false);

  if (!isOpen) return null;

  // Calculate base square meters
  let totalSqM = 0;
  if (activeUnit === 'hectare') {
    totalSqM = (inputValue || 0) * 10000;
  } else if (activeUnit === 'qada') {
    totalSqM = (inputValue || 0) * 2500;
  } else if (activeUnit === 'timad') {
    totalSqM = (inputValue || 0) * 2500;
  } else if (activeUnit === 'sqm') {
    totalSqM = inputValue || 0;
  } else if (activeUnit === 'dimensions') {
    totalSqM = (lengthM || 0) * (widthM || 0);
  }

  const hectares = totalSqM / 10000;
  const qada = totalSqM / 2500;
  const timad = totalSqM / 2500;
  const boye = totalSqM / 625;

  // Agricultural agronomy calculations per hectare
  const agronomyData = {
    teff: {
      name: 'ጤፍ (Teff)',
      seedPerHa: 25, // kg
      npsBagsPerHa: 2, // 100kg
      ureaBagsPerHa: 1.5, // 75kg
      expectedYieldQtlPerHa: 22, // quintals
    },
    wheat: {
      name: 'ስንዴ (Wheat)',
      seedPerHa: 125, // kg
      npsBagsPerHa: 2, // 100kg
      ureaBagsPerHa: 2, // 100kg
      expectedYieldQtlPerHa: 38,
    },
    maize: {
      name: 'በቆሎ (Maize)',
      seedPerHa: 25, // kg
      npsBagsPerHa: 2,
      ureaBagsPerHa: 2.5,
      expectedYieldQtlPerHa: 50,
    },
    barley: {
      name: 'ገብስ (Barley)',
      seedPerHa: 120, // kg
      npsBagsPerHa: 1.5,
      ureaBagsPerHa: 1.5,
      expectedYieldQtlPerHa: 30,
    },
    chickpea: {
      name: 'ሽምብራ (Chickpea)',
      seedPerHa: 90, // kg
      npsBagsPerHa: 1,
      ureaBagsPerHa: 0.5,
      expectedYieldQtlPerHa: 20,
    },
  };

  const crop = agronomyData[selectedCrop];
  const totalSeedKg = Math.round(crop.seedPerHa * hectares);
  const totalNpsBags = Math.round(crop.npsBagsPerHa * hectares * 10) / 10;
  const totalUreaBags = Math.round(crop.ureaBagsPerHa * hectares * 10) / 10;
  const totalExpectedYieldQtl = Math.round(crop.expectedYieldQtlPerHa * hectares);

  // Land tax estimation (Estimated at ~500 Birr per hectare base + residence surcharge)
  const estimatedTaxBirr = Math.round(hectares * 500 + residenceSqM * 0.4);

  const handleApply = () => {
    audioService.playChime('success');
    if (onApplyToProfile) {
      onApplyToProfile({
        totalHectares: Math.round(hectares * 100) / 100,
        qada: Math.round(qada * 10) / 10,
        timad: Math.round(timad * 10) / 10,
        squareMeters: Math.round(totalSqM),
        residenceAreaSqM: residenceSqM,
      });
      setAppliedNotification(true);
      setTimeout(() => {
        setAppliedNotification(false);
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-stone-900 shadow">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">የመሬትና የመኖሪያ ይዞታ አሀዳዊ ስሌት</h2>
              <p className="text-xs text-emerald-200">
                ሄክታር፣ ቃዳ፣ ጢማድ፣ ካሬ ሜትርና የግብአት ፍላጎት መተመኛ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Unit selector buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700">የመለኪያ አሀድ ይምረጡ፡</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'hectare', label: 'ሄክታር (Hectare)' },
                { id: 'qada', label: 'ቃዳ / ገመድ (Qada)' },
                { id: 'timad', label: 'ጢማድ (Timad)' },
                { id: 'sqm', label: 'ካሬ ሜትር (m²)' },
                { id: 'dimensions', label: 'ርዝመት x ወርድ' },
              ].map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => {
                    setActiveUnit(unit.id as any);
                    if (unit.id === 'hectare') setInputValue(hectares);
                    else if (unit.id === 'qada') setInputValue(qada);
                    else if (unit.id === 'timad') setInputValue(timad);
                    else if (unit.id === 'sqm') setInputValue(totalSqM);
                  }}
                  className={`py-2 px-2.5 text-xs font-bold rounded-lg border transition text-center ${
                    activeUnit === unit.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input field based on unit */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            {activeUnit === 'dimensions' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    የማሳው ርዝመት (በሜትር)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={lengthM}
                    onChange={(e) => setLengthM(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    የማሳው ወርድ (በሜትር)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={widthM}
                    onChange={(e) => setWidthM(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  የመሬት መጠን ያስገቡ ({activeUnit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-lg font-extrabold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-stone-500 uppercase">
                    {activeUnit}
                  </span>
                </div>
              </div>
            )}

            {/* Residence area */}
            <div className="mt-3 pt-3 border-t border-stone-200">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                የመኖሪያ ይዞታ ስፋት (በካሬ ሜትር)
              </label>
              <input
                type="number"
                min="0"
                value={residenceSqM}
                onChange={(e) => setResidenceSqM(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Unit Comparison Matrix */}
          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-700" />
              <span>የተሰላ የመሬት ስፋት በሁሉም አሀዶች</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs text-emerald-700 font-medium">ሄክታር (Hectare)</span>
                <p className="text-xl font-extrabold text-emerald-950 mt-0.5">
                  {(Math.round(hectares * 100) / 100).toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-600">10,000 m²</span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <span className="text-xs text-amber-700 font-medium">ቃዳ / ገመድ (Qada)</span>
                <p className="text-xl font-extrabold text-amber-950 mt-0.5">
                  {(Math.round(qada * 10) / 10).toLocaleString()}
                </p>
                <span className="text-[10px] text-amber-700">~2,500 m²</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs text-emerald-700 font-medium">ጢማድ (Timad)</span>
                <p className="text-xl font-extrabold text-emerald-950 mt-0.5">
                  {(Math.round(timad * 10) / 10).toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-600">የበሬ ጥንድ ማረሻ</span>
              </div>

              <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl text-center">
                <span className="text-xs text-stone-600 font-medium">ካሬ ሜትር (m²)</span>
                <p className="text-xl font-extrabold text-stone-900 mt-0.5">
                  {Math.round(totalSqM).toLocaleString()}
                </p>
                <span className="text-[10px] text-stone-500">ካሬ</span>
              </div>
            </div>
          </div>

          {/* Seed and Input Requirements estimation */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-700" />
                <span>የዘርና የማዳበሪያ ግብአት ፍላጎት ስሌት</span>
              </h4>
              <div className="flex items-center gap-1">
                {(['teff', 'wheat', 'maize', 'barley', 'chickpea'] as const).map((cKey) => (
                  <button
                    key={cKey}
                    onClick={() => setSelectedCrop(cKey)}
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      selectedCrop === cKey
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    {cKey === 'teff' ? 'ጤፍ' : cKey === 'wheat' ? 'ስንዴ' : cKey === 'maize' ? 'በቆሎ' : cKey === 'barley' ? 'ገብስ' : 'ሽምብራ'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500">የሚያስፈልግ ዘር</span>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{totalSeedKg} ኪ.ግ</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500">NPS/DAP ማዳበሪያ</span>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{totalNpsBags} ኩንታል</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500">ዩሪያ ማዳበሪያ</span>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{totalUreaBags} ኩንታል</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500">የሚጠበቅ ምርት</span>
                <p className="text-sm font-bold text-emerald-800 mt-0.5">{totalExpectedYieldQtl} ኩንታል</p>
              </div>
            </div>

            <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-medium">የተገመተ ዓመታዊ የመሬት መጠቀሚያ ግብር፡</span>
              <span className="font-extrabold text-amber-950 text-sm">{estimatedTaxBirr.toLocaleString()} ብር</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition"
          >
            ዝጋ
          </button>

          {onApplyToProfile && (
            <button
              onClick={handleApply}
              disabled={appliedNotification}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-md transition"
            >
              {appliedNotification ? (
                <>
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>ወደ አርሶ አደር መዝገብ ተቀምጧል!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>ወደ አርሶ አደር መዝገብ ይጫኑ</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
