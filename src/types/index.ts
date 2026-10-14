export type Language = 'am' | 'om' | 'ti' | 'en';

export type UserRole = 'farmer' | 'admin' | 'buyer' | 'creator';

export interface FamilyMember {
  id: string;
  fullName: string;
  relation: 'ባለቤት' | 'ልጅ' | 'ወላጅ' | 'ወንድም/እህት' | 'ዘመድ';
  age: number;
  gender: 'ወንድ' | 'ሴት';
  roleInFarm: string;
  photoUrl?: string;
}

export interface LandHolding {
  totalHectares: number;
  qada: number; // ቃዳ / ገመድ (1 hectare = ~4 qada)
  timad: number; // ጢማድ (1 hectare = ~4 timad)
  squareMeters: number;
  soilType: 'ደለል አፈር (Alluvial)' | 'ቀይ አፈር (Nitisol)' | 'ጥቁር አፈር / ኮትቻ (Vertisol)' | 'አሸዋማ አፈር (Sandy)';
  irrigationType: 'በዝናብ ብቻ (Rain-fed)' | 'በመስኖ (Irrigated)' | 'በከፊል መስኖ (Partial)';
  mainCrops: string[];
  parcelNumber: string;
  residenceAreaSqM: number;
}

export interface FarmerProfile {
  id: string;
  fullName: string;
  phone: string;
  gender: 'ወንድ' | 'ሴት';
  age: number;
  healthStatus: 'ጥሩ ጤንነት' | 'ተጓዳኝ ህመም ያለበት' | 'የህክምና ክትትል ላይ ያለ';
  kebeleIdNumber: string;
  nationalFaydaId: string;
  nationality: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  got: string; // ጎጥ
  photoUrl: string;
  familyMembers: FamilyMember[];
  land: LandHolding;
  cooperativeName: string;
}

export interface FertilizerQueue {
  id: string;
  tokenNumber: string;
  farmerId: string;
  farmerName: string;
  dapBags: number; // ኩንታል
  ureaBags: number;
  npsBags: number;
  improvedSeedBags: number;
  seedType: string;
  distributionCenter: string;
  assignedDate: string; // e.g., "የካቲት 28 ቀን 2018 ዓ.ም"
  timeSlot: string; // e.g., "2:30 - 4:30 ጠዋት"
  status: 'scheduled' | 'ready_today' | 'collected' | 'delayed';
  totalPriceBirr: number;
  paymentStatus: 'paid' | 'pending' | 'subsidized';
  qrCodeToken: string;
}

export interface TaxItem {
  id: string;
  category: string;
  amount: number;
  fiscalYear: string;
  dueDate: string;
  status: 'paid' | 'pending';
  receiptId?: string;
  paidDate?: string;
  paymentMethod?: string;
}

export interface OfficialReceipt {
  receiptNumber: string;
  taxpayerName: string;
  kebeleId: string;
  faydaId: string;
  region: string;
  woreda: string;
  kebele: string;
  category: string;
  amount: number;
  amountInWords: string;
  paidDate: string;
  paymentMethod: 'telebirr' | 'cbe_birr' | 'awash' | 'dashen' | 'abyssinia' | 'coop_oromia';
  transactionReference: string;
  verifierOfficer: string;
  status: 'verified';
  qrCodeValue: string;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropName: string; // e.g., ጤፍ ማኛ, ቀይ ስንዴ, በቆሎ
  category: 'እህል (Grains)' | 'ጥራጥሬ (Pulses)' | 'የቅባት እህሎች (Oilseeds)' | 'ቡናና ቅመማቅመም (Coffee & Spices)' | 'አትክልትና ፍራፍሬ (Vegetables)';
  quantityQuintals: number;
  pricePerQuintal: number;
  location: string;
  region: string;
  harvestDate: string;
  description: string;
  imageUrl: string;
  isOrganic: boolean;
  isVerifiedFarmer: boolean;
  likesCount?: number;
  sharesCount?: number;
}

export interface FarmerInquiry {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  title: string;
  description: string;
  audioRecordingUrl?: string;
  imageUrl?: string;
  category: 'የተምችና አደጋ መከላከል (Pest/Locust)' | 'የማዳበሪያ እጥረት (Fertilizer)' | 'የመስኖ ውሃ ችግር (Irrigation)' | 'የሰብል በሽታ (Crop Disease)' | 'የመሬት ይዞታ ክርክር (Land Dispute)' | 'ሌላ (Other)';
  status: 'pending' | 'in_review' | 'resolved';
  latitude: number;
  longitude: number;
  kebele: string;
  createdAt: string;
  officialResponse?: string;
  responseAudioUrl?: string;
}

export interface MarketPriceItem {
  cropName: string;
  category: string;
  averagePriceBirr: number;
  changeRate: number; // positive or negative percent
  highPrice: number;
  lowPrice: number;
  majorMarket: string;
  unit: string;
  lastUpdated: string;
}

// Creator Continuous Revenue & Multi-Bank Payout types
export interface WithdrawalTransaction {
  id: string;
  amount: number;
  method: 'telebirr' | 'cbe_birr' | 'awash' | 'dashen' | 'abyssinia' | 'coop_oromia';
  accountNumber: string;
  accountName: string;
  status: 'completed' | 'processing';
  date: string;
  reference: string;
}

export interface CreatorWallet {
  balanceBirr: number;
  totalEarnedBirr: number;
  telecomRevenueBirr: number; // Ethio Telecom & Safaricom 5% revenue sharing
  institutionalSponsorshipBirr: number; // Ministry of Agriculture & ECX API licensing
  engagementRevenueBirr: number; // Likes, Shares, Pageviews, Orders royalty
  totalLikes: number;
  totalShares: number;
  totalServiceTransactions: number;
  withdrawHistory: WithdrawalTransaction[];
}

// Multi-Tier Institutional Network
export interface InstitutionNode {
  id: string;
  name: string;
  level: 'federal' | 'region' | 'zone' | 'woreda' | 'kebele';
  role: string;
  contactPerson: string;
  phone: string;
  email?: string;
  status: 'online' | 'active_duty';
  connectedSystems: string[];
  pendingDispatches: number;
}
