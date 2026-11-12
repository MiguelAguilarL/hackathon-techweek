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
  Bot,
  Edit3,
  PlusCircle,
  FileText,
  Calendar,
  Layers,
  Trash2,
  Lock,
  KeyRound,
  AlertTriangle
} from 'lucide-react';
import ConnectivityBanner from '../components/ConnectivityBanner';
import DiagnosticEditorModal from '../components/DiagnosticEditorModal';
import StudentModal from '../components/StudentModal';
import { MOCK_TEACHER } from '../data/diagnosticData';
import { getActiveDiagnostic, saveDiagnosticExam } from '../services/diagnosticService';
import {
  getAllStudentsWithProgress,
  createStudent,
  updateStudent,
  deleteStudent
} from '../services/studentService';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' | 'diagnostic'
  const [teacher, setTeacher] = useState(MOCK_TEACHER);

  // Estados de estudiantes reales
  const [studentsList, setStudentsList] = useState([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  // Estados de la evaluación diagnóstica
  const [currentExam, setCurrentExam] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewExamMode, setIsNewExamMode] = useState(false);

  // Filtros y orden
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Todos los niveles');
  const [sortBy, setSortBy] = useState('Calificación');

  const loadStudents = async () => {
    const list = await getAllStudentsWithProgress();
    setStudentsList(list);
  };

  useEffect(() => {
    const raw = localStorage.getItem('currentTeacher');
    if (raw) {
      try {
        setTeacher(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }

    loadStudents();
    getActiveDiagnostic().then((exam) => setCurrentExam(exam));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentTeacher');
    navigate('/login');
  };

  // Guardar nuevo estudiante o editar
  const handleSaveStudent = async (studentData) => {
    if (studentData.id) {
      await updateStudent(studentData.id, studentData);
    } else {
      await createStudent(studentData);
    }
    await loadStudents();
  };

  // Eliminar estudiante
  const handleDeleteStudent = async (student) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al estudiante "${student.name}" (${student.email})? Esta acción no se puede deshacer.`
    );
    if (confirmDelete) {
      await deleteStudent(student.id, student.email);
      await loadStudents();
      if (selectedStudentDetail?.id === student.id) {
        setSelectedStudentDetail(null);
      }
    }
  };

  // Guardar evaluación diagnóstica
  const handleSaveExam = async (examData) => {
    const saved = await saveDiagnosticExam(examData);
    setCurrentExam(saved);
    alert('¡Evaluación diagnóstica guardada y activada con éxito para todos los alumnos!');
  };

  // Métricas reales calculadas
  const totalStudentsCount = studentsList.length;
  const completedEvaluations = studentsList.filter((s) => s.hasCompletedDiagnostic);
  const completedCount = completedEvaluations.length;
  const completionPercentage =
    totalStudentsCount > 0 ? Math.round((completedCount / totalStudentsCount) * 100) : 0;

  const averageSum = completedEvaluations.reduce((acc, s) => acc + (s.average || 0), 0);
  const realAverage = completedCount > 0 ? (averageSum / completedCount).toFixed(1) : '0.0';

  // Nivel predominante real
  const levelCounts = completedEvaluations.reduce((acc, s) => {
    acc[s.level] = (acc[s.level] || 0) + 1;
    return acc;
  }, {});
  let predominantLevel = 'Sin evaluaciones';
  let maxCount = 0;
  for (const [lvl, count] of Object.entries(levelCounts)) {
    if (count > maxCount) {
      maxCount = count;
      predominantLevel = lvl;
    }
  }

  // Filtrado y búsqueda
  const filteredStudents = studentsList
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel =
        selectedLevel === 'Todos los niveles' || student.level.toLowerCase() === selectedLevel.toLowerCase();

      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'Aciertos') {
        return (b.latestResult?.score || 0) - (a.latestResult?.score || 0);
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
              onClick={() => {
                setActiveTab('groups');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-colors text-sm font-medium text-left cursor-pointer min-h-[44px] ${
                activeTab === 'groups'
                  ? 'bg-[#006948] text-white font-semibold shadow-xs'
                  : 'text-[#3d4a42] hover:bg-[#dee4de]'
              }`}
            >
              <Users className="w-4 h-4 mr-3" />
              <span>Gestión de Grupos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('diagnostic');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-colors text-sm font-medium text-left cursor-pointer min-h-[44px] ${
                activeTab === 'diagnostic'
                  ? 'bg-[#006948] text-white font-semibold shadow-xs'
                  : 'text-[#3d4a42] hover:bg-[#dee4de]'
              }`}
            >
              <Award className="w-4 h-4 mr-3" />
              <span>Evaluación Diagnóstica</span>
            </button>

            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-[#3d4a42] hover:bg-[#dee4de] transition-colors text-sm font-medium min-h-[44px]"
            >
              <GraduationCap className="w-4 h-4 mr-3 text-slate-500" />
              <span>Vista Alumno</span>
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
          {/* TAB 1: GESTIÓN DE GRUPOS (ALUMNOS REALES) */}
          {activeTab === 'groups' && (
            <div className="flex flex-col w-full">
              {/* Header */}
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
                    onClick={() => {
                      setStudentToEdit(null);
                      setIsStudentModalOpen(true);
                    }}
                    className="min-h-[44px] px-5 py-2.5 bg-[#006948] hover:bg-[#00855d] text-white transition-colors rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Agregar Alumno</span>
                  </button>
                </div>
              </div>

              {/* Parrilla de Estadísticas Reales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#3d4a42] font-semibold">Total de Alumnos</span>
                    <div className="w-10 h-10 rounded-xl bg-[#eff5ef] flex items-center justify-center text-[#006948]">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-[#171d19]">
                      {totalStudentsCount}
                    </span>
                    <span className="text-xs text-[#006c49] font-bold flex items-center">
                      Registrados
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#3d4a42] font-semibold">Promedio General</span>
                    <div className="w-10 h-10 rounded-xl bg-[#eff5ef] flex items-center justify-center text-[#006948]">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-[#171d19]">{realAverage}</span>
                    <span className="text-xs text-[#3d4a42]">/ 10.0</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#3d4a42] font-semibold">Evaluaciones Completadas</span>
                    <div className="w-10 h-10 rounded-xl bg-[#eff5ef] flex items-center justify-center text-[#006948]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-[#171d19]">
                      {completedCount}/{totalStudentsCount}
                    </span>
                    <span className="text-xs text-[#006c49] font-bold">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#3d4a42] font-semibold">Nivel Predominante</span>
                    <div className="w-10 h-10 rounded-xl bg-[#eff5ef] flex items-center justify-center text-[#006948]">
                      <Brain className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#171d19]">
                      {predominantLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barra de Búsqueda y Filtros */}
              <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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

                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="min-h-[44px] px-3 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm text-[#171d19] border-transparent focus:outline-hidden cursor-pointer"
                  >
                    <option value="Todos los niveles">Todos los niveles</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Básico">Básico</option>
                    <option value="Sin evaluación">Sin evaluación</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="min-h-[44px] px-3 py-2 bg-[#eff5ef] rounded-xl text-xs sm:text-sm text-[#171d19] border-transparent focus:outline-hidden cursor-pointer"
                  >
                    <option value="Nombre (A-Z)">Ordenar por: Nombre (A-Z)</option>
                    <option value="Aciertos">Más Aciertos</option>
                  </select>
                </div>

                <div className="text-xs text-[#3d4a42]">
                  Mostrando <strong className="text-[#171d19]">{filteredStudents.length}</strong> de <strong className="text-[#171d19]">{totalStudentsCount}</strong> estudiantes
                </div>
              </div>

              {/* Tabla de Alumnos Reales */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#eff5ef] text-[#3d4a42] text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-3.5 px-4">Alumno</th>
                        <th className="py-3.5 px-4">Nivel Detectado</th>
                        <th className="py-3.5 px-4 text-center">Aciertos Reales</th>
                        <th className="py-3.5 px-4 text-center">Diagnóstico</th>
                        <th className="py-3.5 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eff5ef] text-sm text-[#171d19]">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                            No se encontraron estudiantes con los filtros seleccionados.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((st) => {
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
                                    <div className="font-semibold text-[#171d19] text-xs sm:text-sm">
                                      {st.name}
                                    </div>
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
                                <span className="text-xs font-semibold text-slate-700">
                                  {st.scoreRatio ? `${st.scoreRatio} aciertos` : 'Sin intentos'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                    st.hasCompletedDiagnostic
                                      ? 'bg-emerald-50 text-emerald-800'
                                      : 'bg-amber-50 text-amber-800'
                                  }`}
                                >
                                  {st.hasCompletedDiagnostic ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Completada</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Pendiente</span>
                                    </>
                                  )}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1 justify-end">
                                  {/* Ver detalle */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedStudentDetail(st)}
                                    className="p-2 text-[#3d4a42] hover:text-[#006948] transition-colors rounded-lg hover:bg-slate-100 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title="Ver progreso y respuestas del alumno"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Modificar / Editar */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setStudentToEdit(st);
                                      setIsStudentModalOpen(true);
                                    }}
                                    className="p-2 text-slate-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title="Modificar alumno y contraseña"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>

                                  {/* Borrar */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStudent(st)}
                                    className="p-2 text-slate-400 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title="Eliminar estudiante"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-[#eff5ef] flex items-center justify-between border-t border-slate-100 text-xs text-[#3d4a42]">
                  <span>Total en este grupo: {totalStudentsCount} alumno(s)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentToEdit(null);
                      setIsStudentModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#006948] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Registrar otro alumno</span>
                  </button>
                </div>
              </div>

              {/* Panel de Detalle del Alumno Seleccionado */}
              {selectedStudentDetail && (
                <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-sm">
                        {selectedStudentDetail.initials}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#171d19]">
                          Historial de Actividades: {selectedStudentDetail.name}
                        </h4>
                        <p className="text-xs text-[#3d4a42]">{selectedStudentDetail.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedStudentDetail(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {selectedStudentDetail.latestResult ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <div className="bg-[#eff5ef] p-4 rounded-xl">
                        <span className="text-xs text-slate-500 block">Puntaje Obtenido</span>
                        <span className="text-xl font-bold text-[#006948]">
                          {selectedStudentDetail.latestResult.score} /{' '}
                          {selectedStudentDetail.latestResult.total} aciertos
                        </span>
                      </div>
                      <div className="bg-[#eff5ef] p-4 rounded-xl">
                        <span className="text-xs text-slate-500 block">Nivel Asignado</span>
                        <span className="text-xl font-bold text-[#006948]">
                          {selectedStudentDetail.level}
                        </span>
                      </div>
                      <div className="bg-[#eff5ef] p-4 rounded-xl">
                        <span className="text-xs text-slate-500 block">Fecha de Realización</span>
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(
                            selectedStudentDetail.latestResult.completedAt || selectedStudentDetail.latestResult.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Este estudiante aún no ha completado su evaluación diagnóstica. Cuando inicie sesión con su correo y contraseña, sus resultados se sincronizarán aquí automáticamente.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GESTIÓN DE EVALUACIÓN DIAGNÓSTICA */}
          {activeTab === 'diagnostic' && currentExam && (
            <div className="flex flex-col w-full space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="px-3 py-0.5 bg-[#00855d] text-white text-xs font-bold rounded-full">
                      Evaluación Activa
                    </span>
                    <span className="text-xs text-[#3d4a42]">
                      Materia: {currentExam.subject || 'Matemáticas'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171d19]">
                    {currentExam.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewExamMode(false);
                      setIsEditorOpen(true);
                    }}
                    className="min-h-[44px] px-4 py-2 bg-white text-[#171d19] hover:bg-slate-100 transition-colors rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs border border-slate-200 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#006948]" />
                    <span>Modificar Evaluación</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsNewExamMode(true);
                      setIsEditorOpen(true);
                    }}
                    className="min-h-[44px] px-4 py-2 bg-[#006948] hover:bg-[#00855d] text-white transition-colors rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Crear Nueva Evaluación</span>
                  </button>
                </div>
              </div>

              {/* Tarjetas Informativas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006948] flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-[#3d4a42] font-semibold block">Preguntas Activas</span>
                    <span className="text-2xl font-extrabold text-[#171d19]">
                      {currentExam.questions?.length || 0} Reactivos
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#006c49] flex items-center justify-center font-bold">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-[#3d4a42] font-semibold block">Tipo de Preguntas</span>
                    <span className="text-sm font-extrabold text-[#171d19]">
                      Opción Múltiple (4 incisos)
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-[#3d4a42] font-semibold block">Última Actualización</span>
                    <span className="text-xs font-bold text-[#171d19]">
                      {new Date(currentExam.updatedAt).toLocaleDateString()} &bull;{' '}
                      {new Date(currentExam.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista Detallada de Preguntas */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-100 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#171d19]">
                      Preguntas de la Evaluación en Curso
                    </h3>
                    <p className="text-xs text-slate-500">
                      Esta es la evaluación que resolverán los alumnos al ingresar a la plataforma.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#006948] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    Sincronizada con el Alumno
                  </span>
                </div>

                <div className="space-y-4">
                  {currentExam.questions?.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-[#eff5ef] border border-[#bccac0]/20 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-bold text-[#171d19]">
                          <span className="text-[#006948] mr-2">Reactivo {idx + 1}.</span>
                          {q.prompt}
                        </h4>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md shrink-0">
                          4 incisos
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-2">
                        {q.options?.map((opt) => {
                          const isCorrect = q.correctAnswer === opt.key;
                          return (
                            <div
                              key={opt.key}
                              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] uppercase shrink-0 ${
                                  isCorrect ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <span>{opt.text}</span>
                              {isCorrect && (
                                <span className="ml-auto text-[10px] text-emerald-700 font-bold uppercase">
                                  Correcta
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal para Crear / Editar Alumno */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Modal de Creación / Modificación de la Evaluación Diagnóstica */}
      <DiagnosticEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialExam={currentExam}
        onSave={handleSaveExam}
        isNewMode={isNewExamMode}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 bg-white border-t border-slate-100">
        <p>&copy; {new Date().getFullYear()} Aprender a la jarocha &bull; Panel Docente para seguimiento escolar en Veracruz</p>
      </footer>
    </div>
  );
}
