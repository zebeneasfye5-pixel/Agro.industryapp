import React, { useState } from 'react';
import { FarmerProfile, FamilyMember, Language } from '../types';
import { translations } from '../utils/translations';
import { audioService } from '../utils/audio';
import { LandCalculatorModal } from './LandCalculatorModal';
import {
  User,
  Users,
  ShieldCheck,
  MapPin,
  HeartPulse,
  Plus,
  Landmark,
  Calculator,
  QrCode,
  Volume2,
  Trash2,
  CheckCircle2,
  Home,
  Check,
} from 'lucide-react';

interface FarmerProfileViewProps {
  profile: FarmerProfile;
  onUpdateProfile: (updated: FarmerProfile) => void;
  currentLang: Language;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  profile,
  onUpdateProfile,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [isLandCalcOpen, setIsLandCalcOpen] = useState(false);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);

  // New family member form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState<FamilyMember['relation']>('ልጅ');
  const [newMemberAge, setNewMemberAge] = useState<number>(18);
  const [newMemberGender, setNewMemberGender] = useState<'ወንድ' | 'ሴት'>('ወንድ');
  const [newMemberRole, setNewMemberRole] = useState('የእርሻ ስራ ድጋፍ');
  const [newMemberPhoto, setNewMemberPhoto] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  );

  const handleSpeakProfile = () => {
    const summary = `የአርሶ አደር መረጃ፡ ${profile.fullName}። እድሜ፡ ${profile.age} ዓመት። የቀበሌ መታወቂያ፡ ${profile.kebeleIdNumber}። የብሔራዊ ፋይዳ መታወቂያ፡ ${profile.nationalFaydaId}። ክልል፡ ${profile.region}፣ ወረዳ፡ ${profile.woreda}፣ ቀበሌ፡ ${profile.kebele}፣ ጎጥ፡ ${profile.got}። የይዞታ መጠን፡ ${profile.land.totalHectares} ሄክታር ወይም ${profile.land.qada} ቃዳ። የተመዘገቡ የቤተሰብ አባላት፡ ${profile.familyMembers.length}።`;
    audioService.speakText(summary);
  };

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: FamilyMember = {
      id: `FM-${Date.now().toString().slice(-4)}`,
      fullName: newMemberName.trim(),
      relation: newMemberRelation,
      age: Number(newMemberAge) || 18,
      gender: newMemberGender,
      roleInFarm: newMemberRole.trim() || 'የእርሻ ድጋፍ',
      photoUrl: newMemberPhoto,
    };

    const updated = {
      ...profile,
      familyMembers: [...profile.familyMembers, newMember],
    };

    onUpdateProfile(updated);
    audioService.playChime('success');
    setIsAddFamilyOpen(false);
    setNewMemberName('');
  };

  const handleRemoveFamilyMember = (id: string) => {
    const updated = {
      ...profile,
      familyMembers: profile.familyMembers.filter((m) => m.id !== id),
    };
    onUpdateProfile(updated);
    audioService.playChime('click');
  };

  const handleApplyCalculatedLand = (landData: {
    totalHectares: number;
    qada: number;
    timad: number;
    squareMeters: number;
    residenceAreaSqM: number;
  }) => {
    const updated = {
      ...profile,
      land: {
        ...profile.land,
        ...landData,
      },
    };
    onUpdateProfile(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-stone-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Background decorative crops watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <img src="/icon.svg" alt="watermark" className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow" title="ህጋዊ የተረጋገጠ አርሶ አደር">
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-semibold">
                  መታወቂያ ተረጋግጧል (Verified Farmer)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-700/80 text-emerald-200">
                  {profile.nationality}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {profile.fullName}
              </h2>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-emerald-200">
                <span className="flex items-center gap-1 font-mono">
                  📞 {profile.phone}
                </span>
                <span>•</span>
                <span>ፆታ፡ {profile.gender}</span>
                <span>•</span>
                <span>እድሜ፡ {profile.age} ዓመት</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  {profile.healthStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Voice / Readout button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakProfile}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
            >
              <Volume2 className="w-4 h-4 text-stone-900" />
              <span>መረጃውን በድምፅ አዳምጥ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Official IDs & Location Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* National Fayda ID & Kebele ID Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">ብሔራዊና የቀበሌ መታወቂያ</h3>
                <p className="text-xs text-stone-500">ህጋዊ ዲጂታል መለያዎች</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <QrCode className="w-5 h-5 text-emerald-800" />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* National Fayda ID */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-stone-500 font-medium">የብሔራዊ ፋይዳ መታወቂያ (National Fayda ID)</span>
                <p className="font-mono font-bold text-base text-stone-900 mt-0.5 tracking-wider">
                  {profile.nationalFaydaId}
                </p>
              </div>
              <span className="text-[10px] px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                ተረጋግጧል ✓
              </span>
            </div>

            {/* Kebele ID */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-stone-500 font-medium">የቀበሌ ነዋሪነት መታወቂያ</span>
                <p className="font-mono font-bold text-base text-stone-900 mt-0.5">
                  {profile.kebeleIdNumber}
                </p>
              </div>
              <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-800 font-bold rounded-md">
                ደብረ ብርሃን
              </span>
            </div>

            {/* Cooperative membership */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-amber-800 font-semibold">የአርሶ አደር ህብረት ሥራ ማህበር፡</span>
              <p className="font-bold text-amber-950 mt-0.5">{profile.cooperativeName}</p>
            </div>
          </div>
        </div>

        {/* Administrative Location & Residence Hierarchy */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">አስተዳደራዊ አድራሻና ይዞታ</h3>
                <p className="text-xs text-stone-500">ከክልል እስከ ጎጥ ድረስ</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-1 bg-stone-100 rounded text-stone-600">
              {profile.land.parcelNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500">ክልል (Region)</span>
              <p className="font-bold text-stone-900 text-sm mt-0.5">{profile.region}</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500">ዞን (Zone)</span>
              <p className="font-bold text-stone-900 text-sm mt-0.5">{profile.zone}</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500">ወረዳ (Woreda)</span>
              <p className="font-bold text-stone-900 text-sm mt-0.5">{profile.woreda}</p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-500">ቀበሌ (Kebele)</span>
              <p className="font-bold text-stone-900 text-sm mt-0.5">{profile.kebele}</p>
            </div>
            <div className="col-span-2 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-emerald-800">ጎጥ / መንደር (Got / Village)</span>
              <p className="font-bold text-emerald-950 text-sm mt-0.5">{profile.got}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Land Holdings & Plot Measurement Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">የመሬትና የመኖሪያ ይዞታ ዝርዝር</h3>
              <p className="text-xs text-stone-500">
                የማሳ ስፋት፣ የአፈር አይነት፣ የመስኖ ሁኔታና የመኖሪያ ቦታ
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLandCalcOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Calculator className="w-4 h-4 text-amber-300" />
            <span>የይዞታ ስሌት አስላ (Calculator)</span>
          </button>
        </div>

        {/* Land stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl">
            <span className="text-xs text-emerald-700 font-medium">ሄክታር (Hectare)</span>
            <p className="text-2xl font-extrabold text-emerald-950 mt-0.5">
              {profile.land.totalHectares}
            </p>
            <span className="text-[10px] text-emerald-600">ዋና የእርሻ ይዞታ</span>
          </div>

          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl">
            <span className="text-xs text-amber-700 font-medium">ቃዳ / ገመድ (Qada)</span>
            <p className="text-2xl font-extrabold text-amber-950 mt-0.5">
              {profile.land.qada}
            </p>
            <span className="text-[10px] text-amber-700">በባህላዊ ልኬት</span>
          </div>

          <div className="p-3.5 bg-stone-100 border border-stone-200 rounded-xl">
            <span className="text-xs text-stone-600 font-medium">ካሬ ሜትር (m²)</span>
            <p className="text-xl font-extrabold text-stone-900 mt-0.5">
              {profile.land.squareMeters.toLocaleString()}
            </p>
            <span className="text-[10px] text-stone-500">ጠቅላላ ስፋት</span>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-xs text-blue-700 font-medium flex items-center justify-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>የመኖሪያ ይዞታ</span>
            </span>
            <p className="text-xl font-extrabold text-blue-950 mt-0.5">
              {profile.land.residenceAreaSqM} m²
            </p>
            <span className="text-[10px] text-blue-600">ቤትና ግቢ</span>
          </div>
        </div>

        {/* Additional Land Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">የአፈር አይነት</span>
            <p className="font-bold text-stone-800 mt-0.5">{profile.land.soilType}</p>
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">የውሃና የመስኖ አቅርቦት</span>
            <p className="font-bold text-stone-800 mt-0.5">{profile.land.irrigationType}</p>
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">ዋና ዋና ሰብሎች</span>
            <p className="font-bold text-emerald-800 mt-0.5">
              {profile.land.mainCrops.join('፣ ')}
            </p>
          </div>
        </div>
      </div>

      {/* Family Members Registry */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                የቤተሰብ አባላት መዝገብ ({profile.familyMembers.length} አባላት)
              </h3>
              <p className="text-xs text-stone-500">
                የቤተሰብ አባላት ስም፣ ፎቶ፣ ዝምድና እና የእርሻ ስራ ድርሻ
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddFamilyOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>አዲስ የቤተሰብ አባል መዝግብ</span>
          </button>
        </div>

        {/* Family Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.familyMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between hover:shadow-md transition relative group"
            >
              <button
                onClick={() => handleRemoveFamilyMember(member.id)}
                className="absolute top-3 right-3 p-1 rounded-full bg-stone-200 text-stone-600 hover:bg-rose-100 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition"
                title="አስወግድ"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600 shadow"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1">
                      {member.fullName}
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold inline-block mt-0.5">
                      {member.relation} ({member.gender})
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-stone-600">
                  <p>
                    <span className="text-stone-400">እድሜ፡</span> <strong>{member.age} ዓመት</strong>
                  </p>
                  <p className="line-clamp-2">
                    <span className="text-stone-400">የስራ ድርሻ፡</span> {member.roleInFarm}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Family Member Modal */}
      {isAddFamilyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-800/20 my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-300" />
                <span>አዲስ የቤተሰብ አባል መዝግብ</span>
              </h3>
              <button
                onClick={() => setIsAddFamilyOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFamilyMember} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">ሙሉ ስም (Full Name)</label>
                <input
                  type="text"
                  required
                  placeholder="ለምሳሌ፡ ታደሰ በቀለ ደስታ"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ዝምድና (Relation)</label>
                  <select
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="ባለቤት">ባለቤት (Spouse)</option>
                    <option value="ልጅ">ልጅ (Child)</option>
                    <option value="ወላጅ">ወላጅ (Parent)</option>
                    <option value="ወንድም/እህት">ወንድም/እህት (Sibling)</option>
                    <option value="ዘመድ">ዘመድ (Relative)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">ፆታ (Gender)</label>
                  <select
                    value={newMemberGender}
                    onChange={(e) => setNewMemberGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="ወንድ">ወንድ (Male)</option>
                    <option value="ሴት">ሴት (Female)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">እድሜ (Age)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newMemberAge}
                    onChange={(e) => setNewMemberAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">ፎቶ ምሳሌ (Photo URL)</label>
                  <input
                    type="text"
                    value={newMemberPhoto}
                    onChange={(e) => setNewMemberPhoto(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">የስራ ድርሻ በእርሻ ላይ</label>
                <input
                  type="text"
                  placeholder="ለምሳሌ፡ ማረስ፣ ማጨድ፣ እንስሳት መንከባከብ"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddFamilyOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-bold text-stone-800"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 rounded-lg text-xs font-bold text-white shadow"
                >
                  አባል መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Land Calculator Modal */}
      <LandCalculatorModal
        isOpen={isLandCalcOpen}
        onClose={() => setIsLandCalcOpen(false)}
        initialHectares={profile.land.totalHectares}
        initialResidenceSqM={profile.land.residenceAreaSqM}
        onApplyToProfile={handleApplyCalculatedLand}
      />
    </div>
  );
};
