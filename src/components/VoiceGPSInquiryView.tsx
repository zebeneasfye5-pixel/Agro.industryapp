import React, { useState, useRef, useEffect } from 'react';
import { FarmerInquiry, Language, FarmerProfile } from '../types';
import { translations } from '../utils/translations';
import { audioService } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Mic,
  Square,
  Play,
  Pause,
  MapPin,
  Camera,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Volume2,
  Image as ImageIcon,
  Sparkles,
  ShieldAlert,
  X,
} from 'lucide-react';

interface VoiceGPSInquiryViewProps {
  inquiries: FarmerInquiry[];
  onAddInquiry: (inquiry: FarmerInquiry) => void;
  farmerProfile: FarmerProfile;
  currentLang: Language;
}

export const VoiceGPSInquiryView: React.FC<VoiceGPSInquiryViewProps> = ({
  inquiries,
  onAddInquiry,
  farmerProfile,
  currentLang,
}) => {
  const t = translations[currentLang];

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // GPS state
  const [isLocating, setIsLocating] = useState(false);
  const [latitude, setLatitude] = useState<number>(9.6841);
  const [longitude, setLongitude] = useState<number>(39.5312);
  const [accuracy, setAccuracy] = useState<number | null>(12);
  const [gpsCaptured, setGpsCaptured] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FarmerInquiry['category']>('የሰብል በሽታ (Crop Disease)');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80'
  );
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState<FarmerInquiry | null>(null);

  // Real-time GPS capture
  const handleGetLocation = () => {
    setIsLocating(true);
    audioService.playChime('click');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(5)));
          setLongitude(Number(pos.coords.longitude.toFixed(5)));
          setAccuracy(pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 10);
          setGpsCaptured(true);
          setIsLocating(false);
          audioService.playChime('success');
        },
        (err) => {
          console.warn('Geolocation denied or failed, using simulated field coordinates', err);
          // Fallback to high-accuracy Ethiopian field coordinates
          setLatitude(9.6865);
          setLongitude(39.5342);
          setAccuracy(15);
          setGpsCaptured(true);
          setIsLocating(false);
          audioService.playChime('alert');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setLatitude(9.6865);
      setLongitude(39.5342);
      setGpsCaptured(true);
      setIsLocating(false);
    }
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      audioService.playChime('alert');

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission not granted or unsupported; creating simulated voice note', err);
      // Fallback: simulate audio recording
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      // simulated voice note blob
      setRecordedAudioUrl('simulated-voice-note-url');
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    audioService.playChime('success');
  };

  const togglePlayAudio = () => {
    if (!audioElementRef.current) return;
    if (isPlayingRecorded) {
      audioElementRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newInquiry: FarmerInquiry = {
      id: `INQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      farmerId: farmerProfile.id,
      farmerName: farmerProfile.fullName,
      farmerPhone: farmerProfile.phone,
      title: title.trim(),
      description: description.trim() || 'የቀረበ የድምፅና ምስል አቤቱታ።',
      audioRecordingUrl: recordedAudioUrl || undefined,
      imageUrl: imageUrl || undefined,
      category,
      status: 'pending',
      latitude,
      longitude,
      kebele: farmerProfile.kebele,
      createdAt: 'የካቲት 28 ቀን 2018 ዓ.ም አሁን',
      officialResponse: 'አቤቱታዎ ለቀበሌው የግብርና ልማት ጣቢያ (DA) ተልኳል፤ በቅርቡ ክትትል ይደረጋል።',
    };

    onAddInquiry(newInquiry);
    audioService.playChime('success');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

    // Reset fields
    setTitle('');
    setDescription('');
    setRecordedAudioUrl(null);
  };

  const handleSpeakInquiry = (inq: FarmerInquiry) => {
    const text = `የአቤቱታ ርዕስ፡ ${inq.title}። ምድብ፡ ${inq.category}። ሁኔታ፡ ${
      inq.status === 'resolved' ? 'በባለሙያ ተፈትቷል' : inq.status === 'in_review' ? 'በምርመራ ላይ' : 'በመጠባበቅ ላይ'
    }። የቀረበበት ቀን፡ ${inq.createdAt}። የባለሙያ ምላሽ፡ ${inq.officialResponse || 'ምላሽ በመጠባበቅ ላይ'}`;
    audioService.speakText(text);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-rose-950 to-stone-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>የቀጥታ የአደጋና የግብርና ድጋፍ ጥሪ (Direct Extension Line)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.inquiryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200/90 max-w-2xl">
              {t.inquirySub}
            </p>
          </div>

          <button
            onClick={() => {
              const text =
                'የድምፅና የጂፒኤስ አቤቱታ መላኪያ። የአንበጣ ወረርሽኝ፣ የሰብል በሽታ ወይም የማዳበሪያ መዘግየት ካጋጠመዎት ድምፅዎን ቀርፀው ወይም ፎቶ አንስተው በጂፒኤስ በቀጥታ ለቀበሌው ባለሙያ መላክ ይችላሉ።';
              audioService.speakText(text);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
          >
            <Volume2 className="w-5 h-5" />
            <span>መመሪያውን በድምፅ አዳምጡ</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Voice + GPS + Photo submission (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Mic className="w-5 h-5 text-emerald-700" />
              <span>አዲስ አቤቱታ ወይም አደጋ ሪፖርት ማድረጊያ</span>
            </h3>
            <p className="text-xs text-stone-500">
              ለማንበብና ለመጻፍ ባይመችዎት እንኳን በድምፅ ብቻ መላክ ይችላሉ
            </p>
          </div>

          <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
            {/* 1. Voice Note Recording Module */}
            <div className="p-4 rounded-2xl bg-stone-50 border-2 border-dashed border-emerald-600/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-emerald-700" />
                  <span>1. ድምፅዎን ይቅረጹ (Voice Note)</span>
                </span>
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-rose-600 font-bold animate-pulse text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    እየተቀረጸ ነው ({recordingSeconds} ሰከንድ)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow transition"
                  >
                    <Mic className="w-4 h-4" />
                    <span>ድምፅ መቅረጽ ጀምር</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl shadow transition animate-bounce"
                  >
                    <Square className="w-4 h-4 text-rose-400" />
                    <span>ቅጂውን ጨርስ (Stop)</span>
                  </button>
                )}

                {recordedAudioUrl && !isRecording && (
                  <div className="flex items-center gap-2 p-2 bg-emerald-100 rounded-xl border border-emerald-300">
                    <span className="text-[11px] font-bold text-emerald-900">
                      የድምፅ ቅጂ ዝግጁ ነው ({recordingSeconds || 8}s)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        audioService.speakText('የተቀረጸው የድምፅ ቅጂ ማረጋገጫ ድምፅ።');
                      }}
                      className="p-1 rounded-full bg-emerald-800 text-white"
                      title="አጫውት"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. GPS Location Capture Module */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>2. የማሳው መገኛ ቦታ በጂፒኤስ (GPS Coordinates)</span>
                </span>
                {gpsCaptured && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ቦታው ተይዟል ✓
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="font-mono text-xs text-stone-700 bg-white px-3 py-2 rounded-xl border border-stone-200">
                  <span className="text-stone-400">Lat:</span> {latitude}°,{' '}
                  <span className="text-stone-400">Lng:</span> {longitude}°{' '}
                  {accuracy && <span className="text-stone-400 text-[10px]">(+/-{accuracy}m)</span>}
                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition"
                >
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span>{isLocating ? 'ቦታውን በመፈለግ ላይ...' : 'አሁን ያለሁበትን ቦታ ያዝ'}</span>
                </button>
              </div>
            </div>

            {/* 3. Category & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">የአቤቱታው ዓይነት (Category)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="የተምችና አደጋ መከላከል (Pest/Locust)">የተምችና አንበጣ አደጋ (Pest/Locust)</option>
                  <option value="የሰብል በሽታ (Crop Disease)">የሰብል በሽታ (Crop Disease)</option>
                  <option value="የማዳበሪያ እጥረት (Fertilizer)">የማዳበሪያ እጥረት (Fertilizer)</option>
                  <option value="የመስኖ ውሃ ችግር (Irrigation)">የመስኖ ውሃ ችግር (Irrigation)</option>
                  <option value="የመሬት ይዞታ ክርክር (Land Dispute)">የመሬት ይዞታ ክርክር (Land Dispute)</option>
                  <option value="ሌላ (Other)">ሌላ (Other)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">የአቤቱታው አጭር ርዕስ</label>
                <input
                  type="text"
                  required
                  placeholder="ለምሳሌ፡ በስንዴ ላይ የተከሰተ ዋግ..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Photo Evidence and Description */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                የጉዳቱ / የተባዩ ፎቶ (Image URL ወይም ናሙና)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80');
                  }}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-800 font-bold text-xs"
                >
                  የተባይ ፎቶ
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">ዝርዝር ማብራሪያ (በፅሁፍ)</label>
              <textarea
                rows={2}
                placeholder="ችግሩ መቼ ተከሰተ? በማሳው በየትኛው አቅጣጫ ነው?..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>አቤቱታውን በጂፒኤስና በድምፅ ወደ ቀበሌው ላክ</span>
            </button>
          </form>
        </div>

        {/* Right List: History & Status Tracker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <span>የቀረቡ አቤቱታዎች ክትትል</span>
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              {inquiries.length} ጥያቄዎች
            </span>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3 hover:border-emerald-500 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono block">{inq.id} • {inq.createdAt}</span>
                    <h4 className="font-bold text-stone-900 text-sm mt-0.5 line-clamp-1">{inq.title}</h4>
                    <span className="text-[11px] text-emerald-800 font-semibold">{inq.category}</span>
                  </div>

                  {inq.status === 'resolved' ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ተፈትቷል
                    </span>
                  ) : inq.status === 'in_review' ? (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      በምርመራ ላይ
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                      በመጠባበቅ ላይ
                    </span>
                  )}
                </div>

                {/* Evidence Thumbnail & GPS */}
                <div className="flex items-center gap-3 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  {inq.imageUrl && (
                    <img
                      src={inq.imageUrl}
                      alt="Crop evidence"
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-stone-600 line-clamp-1">{inq.description}</p>
                    <p className="font-mono text-[10px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {inq.latitude}°N, {inq.longitude}°E ({inq.kebele})
                    </p>
                  </div>
                </div>

                {/* Official Response if available */}
                {inq.officialResponse && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-900 block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      የቀበሌው ግብርና ባለሙያ (DA) ምላሽ፡
                    </span>
                    <p className="text-emerald-950 font-medium">{inq.officialResponse}</p>
                  </div>
                )}

                {/* Voice Readout of ticket */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100">
                  <button
                    onClick={() => handleSpeakInquiry(inq)}
                    className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ምላሹን በድምፅ አዳምጥ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
