import { UserProfile, UserRole } from '../types';

const USERS_STORAGE_KEY = 'proglory_registered_users_v4';
const SESSION_STORAGE_KEY = 'proglory_active_session_v4';

interface StoredUserAccount extends UserProfile {
  passwordHash: string;
}

export function getStoredUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
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
    studentNumber: params.studentNumber?.trim() || '',
    courseOrClass: params.courseOrClass?.trim() || '',
    role: params.role || 'organizer',
    createdAt: new Date().toISOString().slice(0, 10),
    avatarInitials: initials || 'CP',
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
    return { success: false, message: 'Nenhuma conta encontrada com este email. Pode registar uma nova conta acima.' };
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

export function clearAllUsers() {
  localStorage.removeItem(USERS_STORAGE_KEY);
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
