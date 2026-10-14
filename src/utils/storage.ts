import {
  FarmerProfile,
  FertilizerQueue,
  TaxItem,
  OfficialReceipt,
  CropListing,
  FarmerInquiry,
  CreatorWallet,
  InstitutionNode,
} from '../types';
import {
  initialFarmerProfile,
  initialFertilizerQueues,
  initialTaxes,
  initialOfficialReceipts,
  initialCropListings,
  initialFarmerInquiries,
  initialCreatorWallet,
  initialInstitutionNodes,
} from '../data/mockData';

const STORAGE_KEYS = {
  PROFILE: 'arso_ader_profile_v1',
  FERTILIZER: 'arso_ader_fertilizer_v1',
  TAXES: 'arso_ader_taxes_v1',
  RECEIPTS: 'arso_ader_receipts_v1',
  CROPS: 'arso_ader_crops_v1',
  INQUIRIES: 'arso_ader_inquiries_v1',
  CREATOR_WALLET: 'arso_ader_creator_wallet_v1',
  INSTITUTIONS: 'arso_ader_institutions_v1',
  LANGUAGE: 'arso_ader_lang_v1',
  ROLE: 'arso_ader_role_v1',
};

export function getStoredProfile(): FarmerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return initialFarmerProfile;
}

export function saveProfile(profile: FarmerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredFertilizer(): FertilizerQueue[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FERTILIZER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load fertilizer', e);
  }
  return initialFertilizerQueues;
}

export function saveFertilizer(queues: FertilizerQueue[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FERTILIZER, JSON.stringify(queues));
  } catch (e) {
    console.error('Failed to save fertilizer', e);
  }
}

export function getStoredTaxes(): TaxItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TAXES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load taxes', e);
  }
  return initialTaxes;
}

export function saveTaxes(taxes: TaxItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TAXES, JSON.stringify(taxes));
  } catch (e) {
    console.error('Failed to save taxes', e);
  }
}

export function getStoredReceipts(): OfficialReceipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load receipts', e);
  }
  return initialOfficialReceipts;
}

export function saveReceipts(receipts: OfficialReceipt[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
  } catch (e) {
    console.error('Failed to save receipts', e);
  }
}

export function getStoredCrops(): CropListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CROPS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load crops', e);
  }
  return initialCropListings;
}

export function saveCrops(crops: CropListing[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
  } catch (e) {
    console.error('Failed to save crops', e);
  }
}

export function getStoredInquiries(): FarmerInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load inquiries', e);
  }
  return initialFarmerInquiries;
}

export function saveInquiries(inquiries: FarmerInquiry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save inquiries', e);
  }
}

export function getStoredCreatorWallet(): CreatorWallet {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREATOR_WALLET);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load creator wallet', e);
  }
  return initialCreatorWallet as CreatorWallet;
}

export function saveCreatorWallet(wallet: CreatorWallet): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CREATOR_WALLET, JSON.stringify(wallet));
  } catch (e) {
    console.error('Failed to save creator wallet', e);
  }
}

export function getStoredInstitutions(): InstitutionNode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load institutions', e);
  }
  return initialInstitutionNodes as InstitutionNode[];
}

export function saveInstitutions(institutions: InstitutionNode[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(institutions));
  } catch (e) {
    console.error('Failed to save institutions', e);
  }
}
