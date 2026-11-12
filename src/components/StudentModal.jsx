import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function StudentModal({ isOpen, onClose, onSave, studentToEdit = null }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isEditMode = Boolean(studentToEdit);

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name || '');
      setEmail(studentToEdit.email || '');
      setPassword(studentToEdit.password || '');
    } else {
      setName('');
      setEmail('');
      setPassword('');
    }
    setErrorMessage('');
  }, [studentToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Por favor ingresa el nombre completo del estudiante.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!password.trim() || password.length < 3) {
      setErrorMessage('La contraseña debe tener al menos 3 caracteres.');
      return;
    }

    onSave({
      id: studentToEdit?.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="bg-[#006948] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
              <UserPlus className="w-5 h-5 text-[#85f8c4]" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isEditMode ? 'Editar Estudiante' : 'Registrar Nuevo Estudiante'}
              </h3>
              <p className="text-[11px] text-emerald-100">
                {isEditMode
                  ? 'Modifica los datos y credenciales del alumno'
                  : 'Asigna las credenciales para que el alumno acceda'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Nombre Completo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Carlos Mendoza Sánchez"
                required
                className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm text-[#171d19] border-transparent focus:bg-white focus:ring-2 focus:ring-[#006948]/20 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Correo */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos.mendoza@jarocha.edu.mx"
                required
                className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm text-[#171d19] border-transparent focus:bg-white focus:ring-2 focus:ring-[#006948]/20 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña del estudiante"
                required
                className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm text-[#171d19] border-transparent focus:bg-white focus:ring-2 focus:ring-[#006948]/20 focus:outline-hidden font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Esta es la contraseña que el estudiante usará para entrar en la pantalla de Login.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'Guardar Cambios' : 'Registrar Estudiante'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
