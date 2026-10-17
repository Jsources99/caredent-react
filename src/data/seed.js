// Datos de prueba ficticios (idénticos a la versión original)
export function seedPatients() {
  return [
    {
      id: 1,
      nombre: "Juan",
      apellidos: "Pérez Soto",
      rut: "12.345.678-9",
      fechaNacimiento: "1990-05-14",
      telefono: "+56 9 1234 5678",
      correo: "juan.perez@ejemplo.cl",
      direccion: "Av. Siempre Viva 123, Santiago",
      estado: "activo",
      ultimaAtencion: "2026-08-20",
      antecedentes: {
        medicos: "Hipertensión controlada con medicamento. Sin alergias a anestesia.",
        odontologicos: "Tratamiento de conducto en pieza 36 (2022). Uso de placa de descarga nocturna.",
        alergias: "Penicilina.",
      },
      fichaClinica: {
        grupoSanguineo: "O+",
        fechaCreacion: "2024-02-10",
        observaciones: "Paciente colaborador. Buena higiene oral. Control de placa cada 6 meses.",
      },
      diagnosticos: [
        { fecha: "2026-08-20", descripcion: "Caries interproximal en pieza 26.", profesional: "Dra. Camila Rivas" },
        { fecha: "2026-03-02", descripcion: "Gingivitis leve generalizada.", profesional: "Dra. Camila Rivas" },
      ],
      tratamientos: [
        { id: "T-101", nombre: "Obturación pieza 26", estado: "en-curso", fechaInicio: "2026-08-20", profesional: "Dra. Camila Rivas", descripcion: "Restauración con resina compuesta, sesión única." },
        { id: "T-098", nombre: "Destartraje y pulido", estado: "finalizado", fechaInicio: "2026-03-02", profesional: "Dra. Camila Rivas", descripcion: "Profilaxis completa, control de placa bacteriana." },
      ],
      atenciones: [
        { fecha: "2026-08-20", motivo: "Control y obturación", profesional: "Dra. Camila Rivas", notas: "Paciente refiere sensibilidad leve al frío. Se indica pasta desensibilizante." },
        { fecha: "2026-03-02", motivo: "Destartraje", profesional: "Dra. Camila Rivas", notas: "Buena tolerancia al procedimiento. Se refuerza técnica de cepillado." },
      ],
      seguimiento: [
        { fecha: "2026-03-02", titulo: "Ingreso y diagnóstico inicial", descripcion: "Se registran antecedentes y se detecta gingivitis leve.", futuro: false },
        { fecha: "2026-03-02", titulo: "Destartraje y pulido", descripcion: "Tratamiento finalizado sin complicaciones.", futuro: false },
        { fecha: "2026-08-20", titulo: "Nueva caries detectada", descripcion: "Diagnóstico de caries en pieza 26, inicio de obturación.", futuro: false },
        { fecha: "2026-09-15", titulo: "Control de obturación", descripcion: "Revisar adaptación marginal y sensibilidad.", futuro: true },
      ],
      proximoControl: { fecha: "2026-09-15", motivo: "Control de obturación pieza 26", estado: "pendiente" },
    },
    {
      id: 2,
      nombre: "María",
      apellidos: "Soto Vidal",
      rut: "15.678.234-2",
      fechaNacimiento: "1985-11-02",
      telefono: "+56 9 8765 4321",
      correo: "maria.soto@ejemplo.cl",
      direccion: "Los Álamos 456, Providencia",
      estado: "en-tratamiento",
      ultimaAtencion: "2026-08-28",
      antecedentes: {
        medicos: "Sin antecedentes mórbidos relevantes.",
        odontologicos: "Ortodoncia en la adolescencia. Bruxismo nocturno.",
        alergias: "Sin alergias conocidas.",
      },
      fichaClinica: {
        grupoSanguineo: "A+",
        fechaCreacion: "2023-07-19",
        observaciones: "Usuaria de férula de relajación por bruxismo. Requiere seguimiento periodontal.",
      },
      diagnosticos: [
        { fecha: "2026-08-28", descripcion: "Periodontitis moderada, sector posterior inferior.", profesional: "Dr. Ignacio Fuentes" },
      ],
      tratamientos: [
        { id: "T-110", nombre: "Tratamiento periodontal", estado: "en-curso", fechaInicio: "2026-08-28", profesional: "Dr. Ignacio Fuentes", descripcion: "Raspaje y alisado radicular por cuadrantes, 4 sesiones planificadas." },
      ],
      atenciones: [
        { fecha: "2026-08-28", motivo: "Evaluación periodontal", profesional: "Dr. Ignacio Fuentes", notas: "Se realiza periodontograma. Inicio de plan de tratamiento por cuadrantes." },
        { fecha: "2026-05-10", motivo: "Control general", profesional: "Dr. Ignacio Fuentes", notas: "Sin hallazgos relevantes. Se refuerza uso de férula nocturna." },
      ],
      seguimiento: [
        { fecha: "2026-05-10", titulo: "Control general", descripcion: "Evaluación de rutina, uso correcto de férula.", futuro: false },
        { fecha: "2026-08-28", titulo: "Diagnóstico periodontal", descripcion: "Se detecta periodontitis moderada, inicia tratamiento por cuadrantes.", futuro: false },
        { fecha: "2026-09-10", titulo: "Raspaje cuadrante 2", descripcion: "Continuación del tratamiento periodontal.", futuro: true },
      ],
      proximoControl: { fecha: "2026-09-10", motivo: "Raspaje y alisado, cuadrante 2", estado: "pendiente" },
    },
    {
      id: 3,
      nombre: "Pedro",
      apellidos: "González Muñoz",
      rut: "9.876.543-1",
      fechaNacimiento: "1998-01-27",
      telefono: "+56 9 5544 3322",
      correo: "pedro.gonzalez@ejemplo.cl",
      direccion: "Camino Real 789, Ñuñoa",
      estado: "activo",
      ultimaAtencion: "2026-07-05",
      antecedentes: {
        medicos: "Asma leve, uso de inhalador ocasional.",
        odontologicos: "Extracción de terceros molares (2020).",
        alergias: "Sin alergias conocidas.",
      },
      fichaClinica: {
        grupoSanguineo: "B+",
        fechaCreacion: "2022-09-01",
        observaciones: "Paciente sin controles hace más de un mes, se recomienda contactar.",
      },
      diagnosticos: [
        { fecha: "2026-07-05", descripcion: "Sin hallazgos patológicos activos.", profesional: "Dra. Camila Rivas" },
      ],
      tratamientos: [
        { id: "T-087", nombre: "Blanqueamiento dental", estado: "finalizado", fechaInicio: "2026-07-05", profesional: "Dra. Camila Rivas", descripcion: "Blanqueamiento en consulta, sesión única." },
      ],
      atenciones: [
        { fecha: "2026-07-05", motivo: "Blanqueamiento y control", profesional: "Dra. Camila Rivas", notas: "Procedimiento sin incidentes. Se indican cuidados post-blanqueamiento." },
      ],
      seguimiento: [
        { fecha: "2026-07-05", titulo: "Blanqueamiento dental", descripcion: "Procedimiento realizado sin complicaciones.", futuro: false },
      ],
      proximoControl: null,
    },
    {
      id: 4,
      nombre: "Camila",
      apellidos: "Rojas Espinoza",
      rut: "18.234.567-5",
      fechaNacimiento: "2001-09-30",
      telefono: "+56 9 2233 4455",
      correo: "camila.rojas@ejemplo.cl",
      direccion: "Pasaje Las Rosas 22, La Florida",
      estado: "pendiente",
      ultimaAtencion: "2026-06-12",
      antecedentes: {
        medicos: "Sin antecedentes relevantes.",
        odontologicos: "Primera consulta en la clínica.",
        alergias: "Alergia al látex.",
      },
      fichaClinica: {
        grupoSanguineo: "O-",
        fechaCreacion: "2026-06-12",
        observaciones: "Ficha recién creada, pendiente completar antecedentes familiares.",
      },
      diagnosticos: [
        { fecha: "2026-06-12", descripcion: "Caries múltiples en piezas posteriores, evaluación en curso.", profesional: "Dr. Ignacio Fuentes" },
      ],
      tratamientos: [
        { id: "T-105", nombre: "Plan de obturaciones múltiples", estado: "pendiente", fechaInicio: "2026-09-05", profesional: "Dr. Ignacio Fuentes", descripcion: "Plan de 3 sesiones para tratar caries detectadas." },
      ],
      atenciones: [
        { fecha: "2026-06-12", motivo: "Primera consulta", profesional: "Dr. Ignacio Fuentes", notas: "Evaluación inicial, se solicitan radiografías bite-wing." },
      ],
      seguimiento: [
        { fecha: "2026-06-12", titulo: "Primera consulta", descripcion: "Evaluación inicial y solicitud de radiografías.", futuro: false },
        { fecha: "2026-09-05", titulo: "Inicio plan de obturaciones", descripcion: "Primera sesión del plan de tratamiento.", futuro: true },
      ],
      proximoControl: { fecha: "2026-09-05", motivo: "Inicio plan de obturaciones", estado: "pendiente" },
    },
    {
      id: 5,
      nombre: "Diego",
      apellidos: "Fuentes Araya",
      rut: "14.111.222-8",
      fechaNacimiento: "1979-04-18",
      telefono: "+56 9 6677 8899",
      correo: "diego.fuentes@ejemplo.cl",
      direccion: "El Bosque 310, Macul",
      estado: "inactivo",
      ultimaAtencion: "2025-11-30",
      antecedentes: {
        medicos: "Diabetes tipo 2, controlada.",
        odontologicos: "Uso de prótesis parcial removible superior.",
        alergias: "Sin alergias conocidas.",
      },
      fichaClinica: {
        grupoSanguineo: "AB+",
        fechaCreacion: "2021-03-15",
        observaciones: "Paciente sin controles hace más de 6 meses.",
      },
      diagnosticos: [
        { fecha: "2025-11-30", descripcion: "Desadaptación leve de prótesis removible.", profesional: "Dra. Camila Rivas" },
      ],
      tratamientos: [
        { id: "T-064", nombre: "Ajuste de prótesis removible", estado: "finalizado", fechaInicio: "2025-11-30", profesional: "Dra. Camila Rivas", descripcion: "Rebase y ajuste oclusal de prótesis." },
      ],
      atenciones: [
        { fecha: "2025-11-30", motivo: "Ajuste de prótesis", profesional: "Dra. Camila Rivas", notas: "Se realiza rebase. Paciente indica mejor adaptación." },
      ],
      seguimiento: [
        { fecha: "2025-11-30", titulo: "Ajuste de prótesis", descripcion: "Procedimiento realizado, se recomienda control en 6 meses.", futuro: false },
      ],
      proximoControl: null,
    },
  ];
}

export const USUARIOS_INICIALES = [
  { id: 1, usuario: "admin", clave: "admin123", rol: "administrador", nombre: "Sofía Herrera" },
  { id: 2, usuario: "recepcion", clave: "recepcion123", rol: "recepcionista", nombre: "Valentina Muñoz" },
  { id: 3, usuario: "profesional", clave: "profesional123", rol: "profesional", nombre: "Dra. Camila Rivas" },
];
