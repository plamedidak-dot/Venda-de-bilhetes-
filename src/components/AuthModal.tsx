import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { registerUser, loginUser } from '../utils/auth';
import { X, User, Lock, Mail, Phone, BookOpen, GraduationCap, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('923 000 000');
  const [studentNumber, setStudentNumber] = useState('');
  const [courseOrClass, setCourseOrClass] = useState('10ª Classe - Ciências');
  const [role, setRole] = useState<UserRole>('student');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMessage('Por favor preencha todos os campos obrigatórios.');
        return;
      }
      const res = registerUser({
        name,
        email,
        password,
        phone,
        studentNumber,
        courseOrClass,
        role
      });
      if (!res.success || !res.user) {
        setErrorMessage(res.message || 'Erro ao criar conta.');
        return;
      }
      onAuthSuccess(res.user);
      onClose();
    } else {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Introduza o email e palavra-passe.');
        return;
      }
      const res = loginUser(email, password);
      if (!res.success || !res.user) {
        setErrorMessage(res.message || 'Credenciais inválidas.');
        return;
      }
      onAuthSuccess(res.user);
      onClose();
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setErrorMessage(null);
    const res = loginUser(demoEmail, demoPass);
    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* School & Association Header with Logos */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <img
            src="/assets/aistudio/PEQUENO_87357065.png"
            alt="Complexo Escolar Privado Proglory"
            className="w-11 h-11 object-contain bg-white rounded p-0.5 border border-amber-400/30"
          />
          <img
            src="/assets/aistudio/LOGOTSHERT_010ed54a.png"
            alt="Associação dos Estudantes AEP-2"
            className="w-11 h-11 object-contain bg-white rounded p-0.5 border border-amber-400/30"
          />
          <div className="text-left">
            <h3 className="text-sm font-bold text-white leading-tight">
              Complexo Escolar Privado Proglory
            </h3>
            <p className="text-[11px] text-amber-400 font-medium">
              Associação dos Estudantes (AEP-2)
            </p>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex rounded-lg bg-slate-950 p-1 mb-5 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 font-semibold rounded-md transition-all ${
              mode === 'login' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sessão
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 font-semibold rounded-md transition-all ${
              mode === 'register' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Registar Nova Conta
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Completo *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Miguel de Jesus"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Institucional ou Pessoal *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="estudante@proglory.edu"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Palavra-passe *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Telemóvel *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="923 000 000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nº de Aluno / C.E.P.P.</label>
                  <input
                    type="text"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="CEPP-2026/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Classe / Curso / Turma</label>
                <input
                  type="text"
                  value={courseOrClass}
                  onChange={(e) => setCourseOrClass(e.target.value)}
                  placeholder="Ex: 10ª Classe - Físicas e Biológicas"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tipo de Utilizador</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex-1 py-1.5 px-2 rounded border text-center transition-all ${
                      role === 'student'
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Estudante / Caloiro
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`flex-1 py-1.5 px-2 rounded border text-center transition-all ${
                      role === 'organizer'
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Organizador AEP-2
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            <span>{mode === 'login' ? 'Entrar na Conta' : 'Criar Perfil e Continuar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins for Fast Evaluation */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2.5">
            Acesso Rápido para Demonstração:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('manuel.costa@proglory.edu', 'caloiro123')}
              className="flex-1 py-1.5 px-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300 transition-colors"
            >
              🎓 Manuel Costa (Estudante)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@proglory.edu', 'admin123')}
              className="flex-1 py-1.5 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded text-[11px] text-amber-300 font-medium transition-colors"
            >
              ⚡ Comissão AEP-2 (Admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
