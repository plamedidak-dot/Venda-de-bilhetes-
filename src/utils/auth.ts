import { UserProfile, UserRole } from '../types';

const USERS_STORAGE_KEY = 'proglory_registered_users_v2';
const SESSION_STORAGE_KEY = 'proglory_active_session_v2';

interface StoredUserAccount extends UserProfile {
  passwordHash: string; // simulated password hash
}

const DEFAULT_USERS: StoredUserAccount[] = [
  {
    id: 'user-organizer-1',
    name: 'Comissão AEP-2 Proglory',
    email: 'admin@proglory.edu',
    phone: '923 456 789',
    studentNumber: 'ORG-AEP2-001',
    courseOrClass: 'Direção da Associação dos Estudantes',
    role: 'organizer',
    createdAt: '2026-11-01',
    avatarInitials: 'AEP',
    passwordHash: 'admin123',
  },
  {
    id: 'user-student-1',
    name: 'Manuel Gonçalves da Costa',
    email: 'manuel.costa@proglory.edu',
    phone: '931 889 120',
    studentNumber: 'CEPP-2026/0491',
    courseOrClass: '10ª Classe - Ciências Físicas e Biológicas',
    role: 'student',
    createdAt: '2026-11-04',
    avatarInitials: 'MC',
    passwordHash: 'caloiro123',
  },
  {
    id: 'user-student-2',
    name: 'Beatriz Teresa dos Santos',
    email: 'beatriz.santos@proglory.edu',
    phone: '945 112 334',
    studentNumber: 'CEPP-2025/1102',
    courseOrClass: '11ª Classe - Ciências Económicas e Jurídicas',
    role: 'student',
    createdAt: '2026-11-03',
    avatarInitials: 'BS',
    passwordHash: 'estudante123',
  }
];

export function getStoredUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      // By default, auto-login as demo student or organizer so the user can see profile immediately
      const defaultUser = DEFAULT_USERS[1];
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS[1];
  }
}

export function setCurrentUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Error saving session:', err);
  }
}

export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  phone: string;
  studentNumber?: string;
  courseOrClass?: string;
  role?: UserRole;
}): { success: boolean; user?: UserProfile; message?: string } {
  const users = getStoredUsers();
  const emailClean = params.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === emailClean);
  if (existing) {
    return { success: false, message: 'Já existe uma conta registada com este endereço de email.' };
  }

  const initials = params.name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const newUser: StoredUserAccount = {
    id: 'user-' + Date.now(),
    name: params.name.trim(),
    email: emailClean,
    phone: params.phone.trim(),
    studentNumber: params.studentNumber?.trim() || 'N/A',
    courseOrClass: params.courseOrClass?.trim() || 'Geral',
    role: params.role || 'student',
    createdAt: new Date().toISOString().slice(0, 10),
    avatarInitials: initials || 'AL',
    passwordHash: params.password,
  };

  users.push(newUser);
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving user registration', err);
  }

  // Auto sign in
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function loginUser(email: string, password: string): { success: boolean; user?: UserProfile; message?: string } {
  const users = getStoredUsers();
  const emailClean = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === emailClean);
  if (!user) {
    return { success: false, message: 'Nenhuma conta encontrada com este email.' };
  }

  if (user.passwordHash && user.passwordHash !== password) {
    return { success: false, message: 'Palavra-passe incorreta. Tente novamente.' };
  }

  setCurrentUser(user);
  return { success: true, user };
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const users = getStoredUsers();
  const updatedUser: UserProfile = { ...current, ...updates };

  const idx = users.findIndex((u) => u.id === current.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  setCurrentUser(updatedUser);
  return updatedUser;
}

export function logoutUser() {
  setCurrentUser(null);
}
