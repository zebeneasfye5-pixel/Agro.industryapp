import React, { useState } from 'react';
import { InstitutionNode, Language } from '../types';
import { audioService } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Building2,
  Network,
  Share2,
  CheckCircle2,
  Send,
  Phone,
  Mail,
  ShieldCheck,
  Radio,
  AlertTriangle,
  Layers,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface InstitutionalNetworkViewProps {
  institutions: InstitutionNode[];
  currentLang: Language;
}

export const InstitutionalNetworkView: React.FC<InstitutionalNetworkViewProps> = ({
  institutions,
  currentLang,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<InstitutionNode>(institutions[0]);
  const [urgentMessage, setUrgentMessage] = useState('');
  const [escalationSent, setEscalationSent] = useState(false);

  const filteredNodes = institutions.filter(
    (n) => selectedLevel === 'all' || n.level === selectedLevel
  );

  const levelBadge = (level: InstitutionNode['level']) => {
    switch (level) {
      case 'federal':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-extrabold text-[10px]">ፌዴራል (Federal)</span>;
      case 'region':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-[10px]">ክልል (Regional)</span>;
      case 'zone':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">ዞን (Zonal)</span>;
      case 'woreda':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">ወረዳ (Woreda)</span>;
      case 'kebele':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-extrabold text-[10px]">ቀበሌ / DA (Grassroots)</span>;
    }
  };

  const handleSendEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urgentMessage.trim()) return;

    audioService.playChime('success');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setEscalationSent(true);
    setTimeout(() => {
      setEscalationSent(false);
      setUrgentMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-1">
              <Network className="w-4 h-4" />
              <span>ከታች እስከ ላይ የተሳሰረ የመንግስትና የተቋማት መረብ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              የተቋማት ቀጥታ ትስስርና የቅንጅት መድረክ
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
              ከቀበሌ ልማት ጣቢያ (DA) ጀምሮ እስከ ወረዳ፣ ዞን፣ ክልል እና ፌዴራል ግብርና ሚኒስቴር ድረስ የተዘረጋ ፈጣን የትብብርና የመረጃ ልውውጥ ሥርዓት
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 text-center">
              <span className="text-[10px] text-amber-300 block">የተሳሰሩ ተቋማት</span>
              <p className="text-xl font-black text-white">{institutions.length} ተቋማት</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter by Level */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'all', label: 'ሁሉም ተቋማት (All)' },
          { id: 'federal', label: 'ፌዴራል ደረጃ (Federal)' },
          { id: 'region', label: 'ክልል ቢሮዎች (Regional)' },
          { id: 'zone', label: 'የዞን መምሪያዎች (Zonal)' },
          { id: 'woreda', label: 'የወረዳ ጽ/ቤቶች (Woreda)' },
          { id: 'kebele', label: 'የቀበሌ DA ጣቢያዎች (Kebele)' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSelectedLevel(btn.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedLevel === btn.id
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Main Hierarchy Grid & Node Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Nodes (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => {
                setSelectedNode(node);
                audioService.playChime('click');
              }}
              className={`p-4 rounded-2xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                selectedNode.id === node.id
                  ? 'border-emerald-700 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/30'
                  : 'border-stone-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {levelBadge(node.level)}
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      ቀጥታ የተገናኘ (Live Connected)
                    </span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-sm">{node.name}</h4>
                  <p className="text-stone-600 line-clamp-1">{node.role}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0 mt-2" />
              </div>

              <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-stone-500 font-mono text-[11px]">
                <span>ኃላፊ፡ {node.contactPerson.split('(')[0]}</span>
                <span>📞 {node.phone}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail & Direct Cross-Agency Escalator (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 text-xs">
            <div className="border-b border-stone-100 pb-3 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {levelBadge(selectedNode.level)}
                  <span className="font-mono text-[10px] text-stone-400">{selectedNode.id}</span>
                </div>
                <h3 className="font-black text-stone-900 text-base">{selectedNode.name}</h3>
                <p className="text-stone-500 mt-0.5">{selectedNode.role}</p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* Official Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-medium block">ተጠሪ ኃላፊ (Contact Official)</span>
                <p className="font-bold text-stone-900 text-sm mt-0.5">{selectedNode.contactPerson}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-medium block">የስልክ አድራሻ (Phone)</span>
                <p className="font-mono font-bold text-stone-900 text-sm mt-0.5">{selectedNode.phone}</p>
              </div>
            </div>

            {/* Connected Systems Integration Stack */}
            <div>
              <span className="text-stone-500 font-bold block mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>የተጣመሩ ዲጂታል የመረጃ ቋቶች (Integrated Systems)</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.connectedSystems.map((sys, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-[11px]"
                  >
                    ✓ {sys}
                  </span>
                ))}
              </div>
            </div>

            {/* Urgent Inter-Agency Dispatch Form */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <div className="flex items-center gap-1.5 text-stone-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>ቀጥታ አስቸኳይ ትዕዛዝ ወይም አቤቱታ አስተላልፍ (Inter-Agency Dispatch)</span>
              </div>
              <p className="text-stone-500 text-[11px]">
                ለምሳሌ፡ የአንበጣ መንጋ ወረርሽኝ ወይም የማዳበሪያ ጭነት እጥረት በቀጥታ ከቀበሌ ወደ ወረዳና ፌዴራል ለማሳወቅ
              </p>

              <form onSubmit={handleSendEscalation} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder={`ወደ ${selectedNode.name} የሚተላለፍ አስቸኳይ የመረጃ መልዕክት ይጻፉ...`}
                  value={urgentMessage}
                  onChange={(e) => setUrgentMessage(e.target.value)}
                  className="w-full p-3 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />

                {escalationSent ? (
                  <div className="p-3 bg-emerald-100 text-emerald-950 font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>መልዕክቱ በደህንነት ኮድ ወደ ተቋሙ ተልኮ ተመዝግቧል!</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>ወደ {selectedNode.name.split('(')[0]} ላክ</span>
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
