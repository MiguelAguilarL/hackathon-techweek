import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import ConnectivityBanner from '../components/ConnectivityBanner';
import { MOCK_USER, MOCK_TEACHER } from '../data/diagnosticData';
import { validateStudentCredentials } from '../services/studentService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (role === 'teacher') {
      // Acceso docente
      if (
        (email.trim().toLowerCase() === MOCK_TEACHER.email.toLowerCase() && password === MOCK_TEACHER.password) ||
        (email.trim().length > 0 && password.length >= 3)
      ) {
        const teacherData = {
          name: email.trim().toLowerCase() === MOCK_TEACHER.email.toLowerCase() ? MOCK_TEACHER.name : 'Profesor Jarocho',
          email: email.trim(),
          role: 'teacher',
          initials: email.trim().toLowerCase() === MOCK_TEACHER.email.toLowerCase() ? MOCK_TEACHER.initials : 'PJ',
          school: MOCK_TEACHER.school,
          group: MOCK_TEACHER.group
        };
        localStorage.setItem('currentTeacher', JSON.stringify(teacherData));
        navigate('/docente');
        return;
      } else {
        setErrorMsg('Credenciales inválidas para docente.');
        return;
      }
    }

    // Acceso alumno (validación dinámica contra alumnos registrados por el docente o María)
    try {
      const validStudent = await validateStudentCredentials(email, password);
      if (validStudent) {
        const userData = {
          name: validStudent.name,
          email: validStudent.email,
          role: 'student',
          initials: validStudent.initials,
          grade: validStudent.grade || MOCK_USER.grade,
          subject: validStudent.subject || MOCK_USER.subject,
          firstTime: true
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        navigate('/evaluacion');
        return;
      }

      // Fallback genérico si el docente dio una contraseña cualquiera de prueba
      if (email.trim().length > 0 && password.length >= 3) {
        const userData = {
          name: email.trim().toLowerCase() === MOCK_USER.email.toLowerCase() ? MOCK_USER.name : 'Estudiante Jarocho',
          email: email.trim(),
          role: 'student',
          initials: email.trim().toLowerCase() === MOCK_USER.email.toLowerCase() ? MOCK_USER.initials : 'EJ',
          grade: MOCK_USER.grade,
          subject: MOCK_USER.subject,
          firstTime: true
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        navigate('/evaluacion');
        return;
      }

      setErrorMsg('Credenciales inválidas. Verifica tu correo y contraseña.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al verificar las credenciales.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Banner de Conectividad */}
      <ConnectivityBanner />

      {/* Header Superior */}
      <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              JA
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Jarocha AI
              </h1>
              <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
                Tutor Socrático de Veracruz
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Destellos decorativos */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-100/60 rounded-full blur-2xl pointer-events-none" />

          {/* Encabezado */}
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xl shadow-md mb-1">
              JA
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Jarocha AI
            </h2>
            <p className="text-sm text-slate-500">
              Bienvenido, inicia sesión como {role === 'student' ? 'estudiante' : 'docente'}
            </p>
          </div>

          {/* Selector de Rol */}
          <div className="relative z-10 grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Estudiante</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'teacher'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Docente</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Formulario */}
          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  required
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                htmlFor="password"
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full min-h-[44px] pl-10 pr-11 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-sm placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 min-w-[44px] justify-center transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-slate-600">Recordar datos en este dispositivo</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-medium rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2 cursor-pointer text-sm"
            >
              <span>{role === 'student' ? 'Iniciar sesión (Alumno)' : 'Entrar al Panel Docente'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center relative z-10">
            <p className="text-xs text-slate-400">
              {role === 'student'
                ? 'Acceso para estudiantes de secundaria y bachillerato'
                : 'Panel de seguimiento grupal y diagnóstico para profesores'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Jarocha AI &bull; Educación accesible sin conexión</p>
      </footer>
    </div>
  );
}
