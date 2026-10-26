import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, PetPublication, AdminDonationRecord, VerificationStatus, PublicationStatus, ShelterProfile } from '../types';
import { dbService, DbUser, DbCreatorUser, AUTHORIZED_CREATOR_EMAILS } from '../services/db';

interface AuthContextType {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  publications: PetPublication[];
  adminDonations: AdminDonationRecord[];
  registeredShelters: ShelterProfile[];
  dbUsers: DbUser[];
  dbCreators: DbCreatorUser[];
  isAuthorizedCreator: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  loginCreator: (email: string, password?: string, secretKey?: string) => { success: boolean; error?: string };
  register: (
    profile: Omit<UserProfile, 'id' | 'verificationStatus' | 'isPhoneVerified'>,
    password?: string,
    creatorSecretKey?: string
  ) => { success: boolean; user?: UserProfile; error?: string };
  logout: () => void;
  verifyShelter: (id: string, newStatus: VerificationStatus) => void;
  toggleShelterVerification: (id: string) => void;
  addPublication: (pub: Omit<PetPublication, 'id' | 'status' | 'createdAt'>) => PetPublication;
  approvePublication: (id: string) => void;
  rejectPublication: (id: string, reason: string) => void;
  updatePublicationStatus: (id: string, status: PublicationStatus, reason?: string) => void;
  addDonation: (record: Omit<AdminDonationRecord, 'id' | 'date' | 'status'> & { status?: AdminDonationRecord['status'] }) => void;
  refreshDbUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return dbService.getActiveSession();
  });

  const [publications, setPublications] = useState<PetPublication[]>(() => {
    return dbService.getPublications();
  });

  const [adminDonations, setAdminDonations] = useState<AdminDonationRecord[]>(() => {
    return dbService.getDonations();
  });

  const [registeredShelters, setRegisteredShelters] = useState<ShelterProfile[]>(() => {
    return dbService.getShelters();
  });

  const [dbUsers, setDbUsers] = useState<DbUser[]>(() => {
    return dbService.getUsers();
  });

  const [dbCreators, setDbCreators] = useState<DbCreatorUser[]>(() => {
    return dbService.getCreators();
  });

  const refreshDbUsers = useCallback(() => {
    setDbUsers(dbService.getUsers());
    setDbCreators(dbService.getCreators());
  }, []);

  // Verificar si el usuario en sesión es efectivamente el creador/creadora
  const isAuthorizedCreator = Boolean(
    currentUser &&
    currentUser.role === 'admin' &&
    (currentUser.isCreator === true || dbService.isCreatorEmail(currentUser.email))
  );

  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const res = dbService.authenticateUser(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      refreshDbUsers();
      return { success: true };
    }
    return { success: false, error: res.error || 'Credenciales no válidas.' };
  };

  const loginCreator = (email: string, password?: string, secretKey?: string): { success: boolean; error?: string } => {
    const res = dbService.authenticateCreator(email, password, secretKey);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      refreshDbUsers();
      return { success: true };
    }
    return { success: false, error: res.error || 'Credenciales de creador no válidas.' };
  };

  const register = (
    profile: Omit<UserProfile, 'id' | 'verificationStatus' | 'isPhoneVerified'>,
    password?: string,
    creatorSecretKey?: string
  ): { success: boolean; user?: UserProfile; error?: string } => {
    const res = dbService.registerUser({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      role: profile.role === 'shelter' ? 'shelter' : 'natural',
      gender: profile.gender,
      shelterName: profile.shelterName,
      password,
      creatorSecretKey,
    });

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setRegisteredShelters(dbService.getShelters());
      refreshDbUsers();
      return { success: true, user: res.user };
    }

    return { success: false, error: res.error || 'Error al registrar la cuenta en la base de datos.' };
  };

  const logout = () => {
    dbService.clearSession();
    setCurrentUser(null);
  };

  const verifyShelter = (id: string, newStatus: VerificationStatus) => {
    setRegisteredShelters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus, verificationStatus: newStatus } : s))
    );
    if (currentUser && currentUser.role === 'shelter') {
      setCurrentUser((prev) => (prev ? { ...prev, verificationStatus: newStatus } : null));
    }
  };

  const toggleShelterVerification = (id: string) => {
    const updated = dbService.toggleShelterVerification(id);
    if (updated) {
      setRegisteredShelters(dbService.getShelters());
    }
  };

  const addPublication = (pub: Omit<PetPublication, 'id' | 'status' | 'createdAt'>): PetPublication => {
    const created = dbService.addPublication(pub);
    setPublications(dbService.getPublications());
    return created;
  };

  const approvePublication = (id: string) => {
    dbService.updatePublicationStatus(id, 'approved');
    setPublications(dbService.getPublications());
  };

  const rejectPublication = (id: string, reason: string) => {
    dbService.updatePublicationStatus(id, 'rejected', reason);
    setPublications(dbService.getPublications());
  };

  const updatePublicationStatus = (id: string, status: PublicationStatus, reason?: string) => {
    dbService.updatePublicationStatus(id, status, reason);
    setPublications(dbService.getPublications());
  };

  const addDonation = (record: Omit<AdminDonationRecord, 'id' | 'date' | 'status'> & { status?: AdminDonationRecord['status'] }) => {
    dbService.addDonation({
      caseId: record.caseId,
      caseTitle: record.caseTitle,
      donorName: record.donorName,
      donorEmail: record.donorEmail,
      amount: record.amount,
      paymentMethod: record.paymentMethod,
    });
    setAdminDonations(dbService.getDonations());
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        publications,
        adminDonations,
        registeredShelters,
        dbUsers,
        dbCreators,
        isAuthorizedCreator,
        login,
        loginCreator,
        register,
        logout,
        verifyShelter,
        toggleShelterVerification,
        addPublication,
        approvePublication,
        rejectPublication,
        updatePublicationStatus,
        addDonation,
        refreshDbUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
