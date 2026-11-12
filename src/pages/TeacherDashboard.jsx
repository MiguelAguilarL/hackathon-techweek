import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  Download,
  UserPlus,
  Search,
  Eye,
  Menu,
  X,
  LogOut,
  Brain,
  GraduationCap,
  LayoutDashboard,
  Filter,
  Bot
} from 'lucide-react';
import ConnectivityBanner from '../components/ConnectivityBanner';
import { MOCK_TEACHER, MOCK_STUDENTS_LIST } from '../data/diagnosticData';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [teacher, setTeacher] = useState(MOCK_TEACHER);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Todos los niveles');
  const [sortBy, setSortBy] = useState('Calificación');

  useEffect(() => {
    const raw = localStorage.getItem('currentTeacher');
    if (raw) {
      try {
        setTeacher(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentTeacher');
    navigate('/login');
  };

  // Filtrado y búsqueda
  const filteredStudents = MOCK_STUDENTS_LIST.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === 'Todos los niveles' || student.level.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesLevel;
  }).sort((a, b) => {
    if (sortBy === 'Calificación') {
      return b.average - a.average;
    }
    if (sortBy === 'Nombre (A-Z)') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5fbf5] text-[#171d19] antialiased selection:bg-emerald-500 selection:text-white">
      {/* Banner de Conectividad */}
      <ConnectivityBanner />

      {/* Header Principal */}
      <header className="bg-white border-b border-[#bccac0]/30 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#006948] flex items-center justify-center text-white font-bold text-xl shadow-md">
              AJ
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#006948] to-[#00855d] bg-clip-text text-transparent">
              Aprender a la jarocha
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1.5 text-sm font-medium text-[#3d4a42]">
              <span>Docente:</span>
              <span className="font-bold text-[#171d19]">{teacher.name}</span>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-emerald-800 uppercase">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenedor con Sidebar y Main */}
      <div className="flex-grow flex relative">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 bottom-0 left-0 w-64 bg-[#eff5ef] border-r border-[#bccac0]/30 z-20 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => alert('Vista de Inicio general')}
              className="w-full flex items-center px-4 py-2.5 rounded-xl text-[#3d4a42] hover:bg-[#dee4de] transition-colors text-sm font-medium text-left cursor-pointer min-h-[44px]"
            >
              <LayoutDashboard className="w-4 h-4 mr-3 text-slate-500" />
              <span>Inicio</span>
            </button>
            <Link
              to="/evaluacion"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-[#3d4a42] hover:bg-[#dee4de] transition-colors text-sm font-medium min-h-[44px]"
            >
              <Award className="w-4 h-4 mr-3 text-slate-500" />
              <span>Evaluación Diagnóstica</span>
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-[#3d4a42] hover:bg-[#dee4de] transition-colors text-sm font-medium min-h-[44px]"
            >
              <GraduationCap className="w-4 h-4 mr-3 text-slate-500" />
              <span>Vista Alumno</span>
            </Link>
            <Link
              to="/docente"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl transition-colors bg-[#006948] text-white font-semibold text-sm shadow-xs min-h-[44px]"
            >
              <Users className="w-4 h-4 mr-3" />
              <span>Gestión de Grupos</span>
            </Link>
          </nav>

          <div className="space-y-3">
            <div className="p-3.5 bg-[#e9efe9] rounded-2xl border border-[#bccac0]/30">
              <p className="text-xs text-[#3d4a42]">Rol de usuario:</p>
              <p className="text-xs font-bold text-[#171d19] mt-0.5">Docente Titular</p>
              <p className="text-[11px] text-[#3d4a42] mt-1">{teacher.school}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 rounded-xl text-red-700 hover:bg-red-50 transition-colors text-xs font-semibold cursor-pointer min-h-[44px]"
            >
              <LogOut className="w-4 h-4 mr-3 text-red-600" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Backdrop móvil */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-10 lg:hidden"
          />
        )}

        {/* Contenido Principal */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
          <div className="flex flex-col w-full">
            
            {/* Header del contenido y acciones */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="px-3 py-0.5 bg-[#00855d] text-white text-xs font-bold rounded-full">
                    {teacher.group}
                  </span>
                  <span className="text-xs text-[#3d4a42]">Ciclo Escolar 2024-2025</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171d19]">
                  Gestión de Alumnos y Grupos
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => alert('Generando y exportando reporte de diagnóstico del grupo...')}
                  className="min-h-[44px] px-4 py-2 bg-white text-[#171d19] hover:bg-slate-100 transition-colors rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs border border-slate-200 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Reporte</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('Formulario para inscribir un nuevo alumno al grupo')}
                  className="min-h-[44px] px-4 py-2 bg-[#006948] hover:bg-[#00855d] text-white transition-colors rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Agregar Alumno</span>
                </button>
              </div>
            </div>

            {/* Parrilla de Estadísticas (Stats Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3d4a42] font-semibold">Total de Alumnos</span>
                  <div className="w-10 h-10 rounded-xl bg-[#eff5ef] flex items-center justify-center text-[#006948]">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-[#171d19]">28</span>
                  <span className="text-xs text-[#006c49] font-bold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2 este mes
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3d4a42] font-semibold">Promedio General</span>
                  <div className="w-10 h-10 rounded-xl bg-[#eff5ef] flex items-center justify-center text-[#006948]">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-[#171d19]">8.4</span>
                  <span className="text-xs text-[#3d4a42]">/ 10.0</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3d4a42] font-semibold">Evaluaciones Completadas</span>
                  <div className="w-10 h-10 rounded-xl bg-[#eff5ef] flex items-center justify-center text-[#006948]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-[#171d19]">26/28</span>
                  <span className="text-xs text-[#006c49] font-bold">92.8%</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#3d4a42] font-semibold">Nivel Predominante</span>
                  <div className="w-10 h-10 rounded-xl bg-[#eff5ef] flex items-center justify-center text-[#006948]">
                    <Brain className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-[#171d19]">Intermedio</span>
                </div>
              </div>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-grow md:w-80">
                  <span className="absolute left-3.5 top-2.5 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por alumno o correo..."
                    className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm text-[#171d19] focus:outline-hidden focus:ring-2 focus:ring-[#006948]/20 border-transparent placeholder:text-slate-400"
                  />
                </div>

                {/* Filtro de Nivel */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="min-h-[44px] px-3 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm text-[#171d19] border-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="Todos los niveles">Todos los niveles</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Básico">Básico</option>
                </select>

                {/* Ordenamiento */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="min-h-[44px] px-3 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm text-[#171d19] border-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="Calificación">Ordenar por: Calificación</option>
                  <option value="Nombre (A-Z)">Nombre (A-Z)</option>
                </select>
              </div>

              <div className="text-xs text-[#3d4a42]">
                Mostrando <strong className="text-[#171d19]">{filteredStudents.length}</strong> de <strong className="text-[#171d19]">28</strong> estudiantes
              </div>
            </div>

            {/* Tabla de Alumnos */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#eff5ef] text-[#3d4a42] text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Alumno</th>
                      <th className="py-3.5 px-4">Nivel</th>
                      <th className="py-3.5 px-4 text-center">Promedio</th>
                      <th className="py-3.5 px-4 text-center">Álgebra</th>
                      <th className="py-3.5 px-4 text-center">Geometría</th>
                      <th className="py-3.5 px-4 text-center">Ecuaciones</th>
                      <th className="py-3.5 px-4 text-center">Trigonometría</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eff5ef] text-sm text-[#171d19]">
                    {filteredStudents.map((st) => {
                      let badgeColor = 'bg-slate-100 text-slate-700';
                      if (st.level === 'Avanzado') badgeColor = 'bg-emerald-100 text-[#006948]';
                      if (st.level === 'Intermedio') badgeColor = 'bg-teal-100 text-teal-800';
                      if (st.level === 'Básico') badgeColor = 'bg-amber-100 text-amber-900';

                      return (
                        <tr key={st.id} className="hover:bg-[#f5fbf5] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {st.initials}
                              </div>
                              <div>
                                <div className="font-semibold text-[#171d19] text-xs sm:text-sm">{st.name}</div>
                                <div className="text-[11px] text-[#3d4a42]">{st.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
                              {st.level}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="font-bold text-[#006948]">{st.average}</span>
                          </td>

                          {/* Álgebra */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`w-2.5 h-2.5 rounded-full mb-1 ${
                                  st.algebra.status === 'success' ? 'bg-[#006c49]' : 'bg-red-500'
                                }`}
                              />
                              <span className="text-[11px] text-[#3d4a42]">{st.algebra.attempts}</span>
                            </div>
                          </td>

                          {/* Geometría */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`w-2.5 h-2.5 rounded-full mb-1 ${
                                  st.geometria.status === 'success'
                                    ? 'bg-[#006c49]'
                                    : st.geometria.status === 'error'
                                    ? 'bg-red-500'
                                    : 'bg-slate-300'
                                }`}
                              />
                              <span
                                className={`text-[11px] ${
                                  st.geometria.status === 'error' ? 'text-red-600 font-bold' : 'text-[#3d4a42]'
                                }`}
                              >
                                {st.geometria.attempts}
                              </span>
                            </div>
                          </td>

                          {/* Ecuaciones */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`w-2.5 h-2.5 rounded-full mb-1 ${
                                  st.ecuaciones.status === 'success' ? 'bg-[#006c49]' : 'bg-slate-300'
                                }`}
                              />
                              <span className="text-[11px] text-[#3d4a42]">{st.ecuaciones.attempts}</span>
                            </div>
                          </td>

                          {/* Trigonometría */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`w-2.5 h-2.5 rounded-full mb-1 ${
                                  st.trigonometria.status === 'success' ? 'bg-[#006c49]' : 'bg-slate-300'
                                }`}
                              />
                              <span className="text-[11px] text-[#3d4a42]">{st.trigonometria.attempts}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => alert(`Visualizando detalles y reporte individual de ${st.name}`)}
                              className="p-2 text-[#3d4a42] hover:text-[#006948] transition-colors rounded-lg hover:bg-slate-100 cursor-pointer min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
                              title="Ver detalle"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="p-4 bg-[#eff5ef] flex items-center justify-between border-t border-slate-100 text-xs text-[#3d4a42]">
                <span>Mostrando 1-{filteredStudents.length} de 28 alumnos</span>
                <div className="flex items-center space-x-1">
                  <button
                    disabled
                    className="px-3 py-1.5 bg-white text-slate-400 rounded-lg shadow-2xs border border-slate-200 cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button className="px-3 py-1.5 bg-[#006948] text-white rounded-lg shadow-2xs font-bold">
                    1
                  </button>
                  <button
                    onClick={() => alert('Página 2')}
                    className="px-3 py-1.5 bg-white text-[#171d19] rounded-lg shadow-2xs border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    onClick={() => alert('Página 3')}
                    className="px-3 py-1.5 bg-white text-[#171d19] rounded-lg shadow-2xs border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    3
                  </button>
                  <button
                    onClick={() => alert('Siguiente página')}
                    className="px-3 py-1.5 bg-white text-[#171d19] rounded-lg shadow-2xs border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Widget flotante de Soporte IA */}
      <aside className="fixed bottom-6 right-6 z-40">
        <div
          onClick={() => alert('Asistente docente: Consulta analítica sobre el rendimiento y temas con mayor rezago del grupo.')}
          className="bg-white rounded-2xl border border-[#bccac0]/30 shadow-xl p-3.5 sm:p-4 flex items-center space-x-3 hover:shadow-2xl transition-all cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006948] flex items-center justify-center font-bold group-hover:bg-[#006948] group-hover:text-white transition-colors">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] text-[#3d4a42] font-medium">¿Tienes dudas?</span>
            <span className="text-sm font-bold text-[#171d19] group-hover:text-[#006948] transition-colors">
              Chat IA apoyo
            </span>
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 bg-white border-t border-slate-100">
        <p>&copy; {new Date().getFullYear()} Aprender a la jarocha &bull; Panel Docente para seguimiento escolar en Veracruz</p>
      </footer>
    </div>
  );
}
