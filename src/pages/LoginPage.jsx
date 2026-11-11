import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen } from 'lucide-react';
import ConnectivityBanner from '../components/ConnectivityBanner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState('student'); // 'student' | 'teacher'

  const handleSubmit = (e) => {
    e.preventDefault();
    // Manejo de autenticación local o remota
    console.log('Login attempt:', { email, role, rememberMe });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Banner de Conectividad (Requerimiento de baja conexión) */}
      <ConnectivityBanner />

      {/* Header Superior */}
      <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              AJ
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Aprender a la jarocha
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
          {/* Destellos decorativos de fondo sutiles */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-100/60 rounded-full blur-2xl pointer-events-none" />

          {/* Encabezado del Formulario */}
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xl shadow-md mb-1">
              AJ
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Aprender a la jarocha
            </h2>
            <p className="text-sm text-slate-500">
              Bienvenido, inicia sesión para continuar
            </p>
          </div>

          {/* Selector de Rol: Estudiante / Docente */}
          <div className="relative z-10 grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
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
              onClick={() => setRole('teacher')}
              className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'teacher'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Docente</span>
            </button>
          </div>

          {/* Formulario */}
          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            {/* Campo Correo */}
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

            {/* Campo Contraseña */}
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
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 min-w-[44px] justify-center transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Recordar datos */}
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

            {/* Botón de Enviar (mínimo 44px de alto para uso móvil fácil) */}
            <button
              type="submit"
              className="w-full min-h-[48px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-medium rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2 cursor-pointer text-sm"
            >
              <span>Iniciar sesión</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Pie de pantalla y aviso sin conexión */}
          <div className="pt-2 border-t border-slate-100 text-center relative z-10">
            <p className="text-xs text-slate-400">
              {role === 'student'
                ? 'Acceso para estudiantes de secundaria y bachillerato'
                : 'Panel de seguimiento y diagnóstico para docentes'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Aprender a la jarocha &bull; Educación accesible sin conexión</p>
      </footer>
    </div>
  );
}
