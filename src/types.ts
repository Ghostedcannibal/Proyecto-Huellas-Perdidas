export type ActiveScreen = 
  | 'home'
  | 'search'
  | 'match'
  | 'report' 
  | 'chat' 
  | 'donations' 
  | 'adoption' 
  | 'auth' 
  | 'admin'
  | 'board';

export type UserRole = 'natural' | 'shelter' | 'admin';
export type UserGender = 'masculino' | 'femenino' | 'otro';
export type VerificationStatus = 'unverified' | 'verified';

export interface ShelterProfile {
  id: string;
  name: string;
  city: string;
  address?: string;
  status: VerificationStatus;
  verificationStatus?: VerificationStatus;
  contact: string;
  contactPerson?: string;
  phone?: string;
  registrationNumber?: string;
  animalCapacity?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  gender?: UserGender;
  shelterName?: string;
  city: string;
  verificationStatus: VerificationStatus;
  isPhoneVerified: boolean;
  isCreator?: boolean;
}

export type PublicationStatus = 'pending_approval' | 'approved' | 'rejected' | 'active' | 'resolved';
export type LocationType = 'home' | 'shelter';

export interface PetPublication {
  id: string;
  type: 'lost' | 'found';
  species: 'perro' | 'gato' | 'otro';
  petName?: string;
  breed: string;
  city: string;
  neighborhood: string;
  date: string;
  time: string;
  lastSeenOrFoundLocation: string;
  description: string;
  imageUrl: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  color: string;
  sex: 'Macho' | 'Hembra' | 'Desconocido';
  size: 'Pequeño' | 'Mediano' | 'Grande';
  reward?: string;
  // Found pets extra details:
  currentLocationType?: LocationType;
  shelterName?: string;
  shelterAddress?: string;
  mapCoordinates?: { lat: number; lng: number };
  // Moderation:
  status: PublicationStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface AdminDonationRecord {
  id: string;
  caseId?: string;
  caseTitle: string;
  donorName: string;
  donorEmail?: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: 'received_by_admin' | 'disbursed_to_vet' | 'approved' | 'pending';
}

export interface PetReport {
  id: string;
  name: string;
  status: 'lost' | 'found';
  species: 'perro' | 'gato';
  breed: string;
  age: string;
  sex: 'Macho' | 'Hembra';
  reward?: string;
  microchip: string;
  weight: string;
  ownerName: string;
  ownerVerified: boolean;
  lostDate: string;
  location: string;
  sector: string;
  imageUrl: string;
  description: string;
  particularFeatures: string[];
}

export interface BiometricMatchData {
  reportId: string;
  confidenceScore: number;
  facialScore: number;
  coatScore: number;
  proximityKm: number;
  rescuedDate: string;
  custodyEntity: string;
  vetReporter: string;
  physicalStatus: string;
  location: string;
  imageUrl: string;
  facialBoxes: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    confidence: string;
  }>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  verifiedPhotoUrl?: string;
  hasExifScrubbed?: boolean;
  videoPreviewUrl?: string;
  safeLocation?: {
    name: string;
    address: string;
    verified: boolean;
  };
}

export interface DonationCase {
  id: string;
  title: string;
  patientName: string;
  species: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  donorsCount: number;
  shelterName: string;
  urgency: 'Crítica' | 'Alta' | 'Media';
  breakdown: Array<{
    item: string;
    cost: number;
    status: 'Pendiente' | 'Pagado' | 'En proceso';
  }>;
  auditHash: string;
  vetSignatory: string;
}

export interface AdoptionPet {
  id: string;
  name: string;
  species: 'perro' | 'gato';
  breed: string;
  age: string;
  gender: 'Macho' | 'Hembra';
  size: 'Pequeño' | 'Mediano' | 'Grande';
  city: string;
  shelter: string;
  imageUrl: string;
  story: string;
  vaccinated: boolean;
  sterilized: boolean;
  microchipped: boolean;
  tags: string[];
}
