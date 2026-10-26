import { UserProfile, PetPublication, ShelterProfile, AdminDonationRecord, ChatMessage } from '../types';

export interface DbUser extends UserProfile {
  passwordHash?: string;
  isCreator?: boolean;
  createdAt: string;
}

export interface DbCreatorUser extends DbUser {
  creatorSecurityKeyHash?: string;
  sourceDatabase: 'creators_db';
}

export interface GeneralDatabaseState {
  version: number;
  users: DbUser[];
  publications: PetPublication[];
  shelters: ShelterProfile[];
  donations: AdminDonationRecord[];
  chatMessages: ChatMessage[];
  activeSessionEmail: string | null;
}

export interface CreatorsDatabaseState {
  version: number;
  creators: DbCreatorUser[];
  activeCreatorSessionEmail: string | null;
}

// Dos bases de datos completamente separadas e independientes en el almacenamiento local
export const GENERAL_USERS_DB_KEY = 'huellas_perdidas_general_users_v5';
export const CREATORS_DB_KEY = 'huellas_perdidas_creators_vault_v5';

// Lista de correos oficiales reservados para el Creador y la Creadora
export const AUTHORIZED_CREATOR_EMAILS = [
  'manuelaby.r73@gmail.com', // Correo oficial del usuario creador
  'creador@huellasperdidas.org',
  'creadora@huellasperdidas.org',
];

// Clave secreta maestra de autorización de creadores
export const CREATOR_MASTER_SECRET_KEY = 'CREADOR-HUELLAS-2026';

class DatabaseEngine {
  private generalState: GeneralDatabaseState;
  private creatorsState: CreatorsDatabaseState;

  constructor() {
    this.generalState = this.loadGeneralFromStorage();
    this.creatorsState = this.loadCreatorsFromStorage();
  }

  // --- 1. Base de Datos General (Usuarios Comunitarios y Refugios) ---
  private loadGeneralFromStorage(): GeneralDatabaseState {
    if (typeof window === 'undefined') {
      return this.getCleanGeneralState();
    }
    try {
      const data = localStorage.getItem(GENERAL_USERS_DB_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && Array.isArray(parsed.users)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error cargando base de datos general:', e);
    }
    const clean = this.getCleanGeneralState();
    this.saveGeneralToStorage(clean);
    return clean;
  }

  private getCleanGeneralState(): GeneralDatabaseState {
    return {
      version: 5,
      users: [],
      publications: [],
      shelters: [],
      donations: [],
      chatMessages: [],
      activeSessionEmail: null,
    };
  }

  private saveGeneralToStorage(stateToSave?: GeneralDatabaseState) {
    if (typeof window === 'undefined') return;
    try {
      const s = stateToSave || this.generalState;
      localStorage.setItem(GENERAL_USERS_DB_KEY, JSON.stringify(s));
    } catch (e) {
      console.error('Error guardando en base de datos general:', e);
    }
  }

  // --- 2. Base de Datos Aparte Exclusiva (Creador y Creadora) ---
  private loadCreatorsFromStorage(): CreatorsDatabaseState {
    if (typeof window === 'undefined') {
      return this.getCleanCreatorsState();
    }
    try {
      const data = localStorage.getItem(CREATORS_DB_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && Array.isArray(parsed.creators)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error cargando base de datos de creadores:', e);
    }
    const clean = this.getCleanCreatorsState();
    this.saveCreatorsToStorage(clean);
    return clean;
  }

  private getCleanCreatorsState(): CreatorsDatabaseState {
    return {
      version: 5,
      creators: [],
      activeCreatorSessionEmail: null,
    };
  }

  private saveCreatorsToStorage(stateToSave?: CreatorsDatabaseState) {
    if (typeof window === 'undefined') return;
    try {
      const s = stateToSave || this.creatorsState;
      localStorage.setItem(CREATORS_DB_KEY, JSON.stringify(s));
    } catch (e) {
      console.error('Error guardando en base de datos de creadores:', e);
    }
  }

  // Comprobar si un correo corresponde al creador o creadora
  public isCreatorEmail(email: string): boolean {
    const normalized = (email || '').trim().toLowerCase();
    return AUTHORIZED_CREATOR_EMAILS.some(c => c.toLowerCase() === normalized);
  }

  // Validar si el usuario actual tiene permisos estrictos de Creador/Administrador en la base de datos de creadores
  public isAuthorizedCreator(user: UserProfile | null): boolean {
    if (!user) return false;
    if (user.role !== 'admin') return false;

    // Verificar en la Base de Datos Exclusiva de Creadores
    const creator = this.creatorsState.creators.find(
      c => c.email.toLowerCase() === user.email.toLowerCase()
    );
    if (creator && creator.role === 'admin') {
      return true;
    }

    // O si coincide con los correos de creador autorizados
    return user.isCreator === true || this.isCreatorEmail(user.email);
  }

  // Obtener usuarios de la base de datos general
  public getUsers(): DbUser[] {
    return this.generalState.users;
  }

  // Obtener creadores de la base de datos aparte
  public getCreators(): DbCreatorUser[] {
    return this.creatorsState.creators;
  }

  // --- Registro en Base de Datos de Creadores ---
  public registerCreatorUser(params: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    gender?: 'masculino' | 'femenino' | 'otro';
    password?: string;
    creatorSecretKey?: string;
  }): { success: boolean; user?: DbCreatorUser; error?: string } {
    const normalizedEmail = params.email.trim().toLowerCase();

    // Validar autorización: debe ser correo autorizado o tener la clave maestra
    const isExplicitEmail = this.isCreatorEmail(normalizedEmail);
    const hasValidKey = params.creatorSecretKey?.trim() === CREATOR_MASTER_SECRET_KEY;

    if (!isExplicitEmail && !hasValidKey) {
      return {
        success: false,
        error: 'Para registrarte en la Base de Datos de Creadores se requiere un correo autorizado o la clave maestra de autorización.',
      };
    }

    // Verificar si ya existe en la base de datos de creadores
    const existing = this.creatorsState.creators.find(c => c.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: 'Ya existe una cuenta registrada en la Base de Datos de Creadores con este correo.' };
    }

    const newCreator: DbCreatorUser = {
      id: `creator-${Date.now()}`,
      fullName: params.fullName.trim(),
      email: normalizedEmail,
      phone: params.phone.trim(),
      city: params.city.trim(),
      role: 'admin',
      gender: params.gender || 'otro',
      verificationStatus: 'verified',
      isPhoneVerified: true,
      isCreator: true,
      sourceDatabase: 'creators_db',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      passwordHash: params.password ? btoa(params.password) : undefined,
      creatorSecurityKeyHash: params.creatorSecretKey ? btoa(params.creatorSecretKey) : undefined,
    };

    this.creatorsState.creators.push(newCreator);
    this.creatorsState.activeCreatorSessionEmail = newCreator.email;
    this.generalState.activeSessionEmail = null; // Desactivar cualquier sesión general previa
    this.saveCreatorsToStorage();
    this.saveGeneralToStorage();

    return { success: true, user: newCreator };
  }

  // --- Registro en Base de Datos General (Usuarios y Refugios) ---
  public registerUser(params: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    role: 'natural' | 'shelter';
    gender?: 'masculino' | 'femenino' | 'otro';
    shelterName?: string;
    password?: string;
    creatorSecretKey?: string;
  }): { success: boolean; user?: DbUser; error?: string } {
    const normalizedEmail = params.email.trim().toLowerCase();

    // Si viene con clave de creador o correo de creador, se redirige a la base de datos aparte de creadores
    const isExplicitCreatorEmail = this.isCreatorEmail(normalizedEmail);
    const hasValidCreatorSecret = params.creatorSecretKey?.trim() === CREATOR_MASTER_SECRET_KEY;

    if (isExplicitCreatorEmail || hasValidCreatorSecret) {
      const creatorRes = this.registerCreatorUser({
        fullName: params.fullName,
        email: params.email,
        phone: params.phone,
        city: params.city,
        gender: params.gender,
        password: params.password,
        creatorSecretKey: params.creatorSecretKey,
      });
      return creatorRes;
    }

    // Comprobar si el correo ya existe en la base de datos general
    const existing = this.generalState.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: 'Ya existe una cuenta registrada con este correo en la Base de Datos de Usuarios.' };
    }

    const newUser: DbUser = {
      id: `u-${Date.now()}`,
      fullName: params.fullName.trim(),
      email: normalizedEmail,
      phone: params.phone.trim(),
      city: params.city.trim(),
      role: params.role === 'shelter' ? 'shelter' : 'natural',
      gender: params.gender || 'otro',
      shelterName: params.role === 'shelter' ? params.shelterName?.trim() : undefined,
      verificationStatus: params.role === 'natural' ? 'verified' : 'unverified',
      isPhoneVerified: true,
      isCreator: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      passwordHash: params.password ? btoa(params.password) : undefined,
    };

    this.generalState.users.push(newUser);

    if (newUser.role === 'shelter' && params.shelterName) {
      const newShelter: ShelterProfile = {
        id: `sh-${Date.now()}`,
        name: params.shelterName.trim(),
        city: params.city.trim(),
        address: 'Sede registrada en proceso de verificación comunitaria',
        status: 'unverified',
        verificationStatus: 'unverified',
        contact: params.phone.trim(),
        phone: params.phone.trim(),
        contactPerson: params.fullName.trim(),
        registrationNumber: 'En proceso de auditoría documental',
        animalCapacity: 25,
      };
      this.generalState.shelters.unshift(newShelter);
    }

    this.generalState.activeSessionEmail = newUser.email;
    this.creatorsState.activeCreatorSessionEmail = null;
    this.saveGeneralToStorage();
    this.saveCreatorsToStorage();
    return { success: true, user: newUser };
  }

  // --- Inicio de Sesión en la Base de Datos Aparte de Creador y Creadora ---
  public authenticateCreator(
    email: string,
    password?: string,
    secretKey?: string
  ): { success: boolean; user?: DbCreatorUser; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar en la Base de Datos Exclusiva de Creadores
    let creator = this.creatorsState.creators.find(c => c.email.toLowerCase() === normalizedEmail);

    // Si aún no está creado pero es un correo de creador oficial autorizado con contraseña válida o clave maestra:
    if (!creator && this.isCreatorEmail(normalizedEmail)) {
      if (secretKey?.trim() === CREATOR_MASTER_SECRET_KEY || password) {
        // Auto-inicializar en la base de datos de creadores
        const autoCreator: DbCreatorUser = {
          id: `creator-${Date.now()}`,
          fullName: normalizedEmail === 'creadora@huellasperdidas.org' ? 'Creadora Oficial' : 'Manuel Rodríguez (Creador)',
          email: normalizedEmail,
          phone: '3109998877',
          city: 'Bogotá',
          role: 'admin',
          gender: normalizedEmail === 'creadora@huellasperdidas.org' ? 'femenino' : 'masculino',
          verificationStatus: 'verified',
          isPhoneVerified: true,
          isCreator: true,
          sourceDatabase: 'creators_db',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          passwordHash: password ? btoa(password) : undefined,
        };
        this.creatorsState.creators.push(autoCreator);
        this.saveCreatorsToStorage();
        creator = autoCreator;
      }
    }

    if (!creator) {
      return {
        success: false,
        error: 'Esta cuenta no se encuentra en la Base de Datos Exclusiva de Creador y Creadora. Primero debes crear tu cuenta de creador con el correo autorizado o la clave maestra.',
      };
    }

    // Validar contraseña o clave secreta
    if (secretKey && secretKey.trim() === CREATOR_MASTER_SECRET_KEY) {
      // Clave maestra válida
    } else if (creator.passwordHash && password) {
      if (btoa(password) !== creator.passwordHash) {
        return { success: false, error: 'Contraseña de creador incorrecta. Por favor inténtalo de nuevo.' };
      }
    } else if (creator.passwordHash && !password) {
      return { success: false, error: 'Por favor ingresa tu contraseña o la clave de autorización de creador.' };
    }

    this.creatorsState.activeCreatorSessionEmail = creator.email;
    this.generalState.activeSessionEmail = null;
    this.saveCreatorsToStorage();
    this.saveGeneralToStorage();
    return { success: true, user: creator };
  }

  // --- Inicio de Sesión en la Base de Datos General de Usuarios ---
  public authenticateUser(email: string, password?: string): { success: boolean; user?: DbUser; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();

    // Comprobar si pertenece a la base de datos de creadores
    const existsInCreators = this.creatorsState.creators.find(c => c.email.toLowerCase() === normalizedEmail);
    if (existsInCreators) {
      return {
        success: false,
        error: 'Esta cuenta está registrada en la Base de Datos Exclusiva de Creador y Creadora. Por favor utiliza la pestaña "Iniciar Sesión Creador/a".',
      };
    }

    const user = this.generalState.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return {
        success: false,
        error: 'Esta cuenta no existe en la Base de Datos de Usuarios. Para iniciar sesión, es indispensable que crees tu cuenta primero en la pestaña "Crear Cuenta".',
      };
    }

    if (user.passwordHash && password) {
      if (btoa(password) !== user.passwordHash) {
        return { success: false, error: 'Contraseña incorrecta. Por favor inténtalo de nuevo.' };
      }
    }

    this.generalState.activeSessionEmail = user.email;
    this.creatorsState.activeCreatorSessionEmail = null;
    this.saveGeneralToStorage();
    this.saveCreatorsToStorage();
    return { success: true, user };
  }

  // Obtener la sesión activa actual (Creador o Usuario general)
  public getActiveSession(): DbUser | null {
    // 1. Revisar si hay sesión activa de creador
    if (this.creatorsState.activeCreatorSessionEmail) {
      const creator = this.creatorsState.creators.find(
        c => c.email.toLowerCase() === this.creatorsState.activeCreatorSessionEmail?.toLowerCase()
      );
      if (creator) return creator;
    }

    // 2. Revisar si hay sesión activa de usuario general
    if (this.generalState.activeSessionEmail) {
      const user = this.generalState.users.find(
        u => u.email.toLowerCase() === this.generalState.activeSessionEmail?.toLowerCase()
      );
      if (user) return user;
    }

    return null;
  }

  public clearSession(): void {
    this.generalState.activeSessionEmail = null;
    this.creatorsState.activeCreatorSessionEmail = null;
    this.saveGeneralToStorage();
    this.saveCreatorsToStorage();
  }

  // Publicaciones
  public getPublications(): PetPublication[] {
    return this.generalState.publications;
  }

  public addPublication(pub: Omit<PetPublication, 'id' | 'status' | 'createdAt'>): PetPublication {
    const newPub: PetPublication = {
      ...pub,
      id: `pub-${Date.now()}`,
      status: 'pending_approval',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    this.generalState.publications.unshift(newPub);
    this.saveGeneralToStorage();
    return newPub;
  }

  public updatePublicationStatus(id: string, status: PetPublication['status'], rejectionReason?: string): void {
    this.generalState.publications = this.generalState.publications.map(p =>
      p.id === id ? { ...p, status, rejectionReason } : p
    );
    this.saveGeneralToStorage();
  }

  // Refugios
  public getShelters(): ShelterProfile[] {
    return this.generalState.shelters;
  }

  public toggleShelterVerification(id: string): ShelterProfile | null {
    let updated: ShelterProfile | null = null;
    this.generalState.shelters = this.generalState.shelters.map(s => {
      if (s.id === id) {
        const nextStatus = (s.status === 'verified' || s.verificationStatus === 'verified') ? 'unverified' : 'verified';
        updated = { ...s, status: nextStatus, verificationStatus: nextStatus };
        return updated;
      }
      return s;
    });
    this.saveGeneralToStorage();
    return updated;
  }

  // Donaciones
  public getDonations(): AdminDonationRecord[] {
    return this.generalState.donations;
  }

  public addDonation(donation: Omit<AdminDonationRecord, 'id' | 'date' | 'status'>): AdminDonationRecord {
    const newDonation: AdminDonationRecord = {
      ...donation,
      id: `don-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 10),
      status: 'received_by_admin',
    };
    this.generalState.donations.unshift(newDonation);
    this.saveGeneralToStorage();
    return newDonation;
  }

  // Mensajes de chat
  public getChatMessages(): ChatMessage[] {
    return this.generalState.chatMessages;
  }

  public addChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };
    this.generalState.chatMessages.push(newMsg);
    this.saveGeneralToStorage();
    return newMsg;
  }
}

export const dbService = new DatabaseEngine();
