# Caredent (React)

Versión React + Vite del proyecto Caredent. Solo frontend: los datos se guardan en `localStorage`.

```bash
npm install
npm run dev
```

Credenciales de demostración: `admin / admin123`, `recepcion / recepcion123`, `profesional / profesional123`.

## Roles
- **Administrador:** solo administra usuarios "profesional" y "recepcionista" (con papelera).
- **Profesional:** pacientes, fichas clínicas, tratamientos y es el único que registra y ve controles.
- **Recepcionista:** solo agenda horas (elige paciente, profesional, fecha y hora).

## Correcciones respecto a la versión HTML
- Rutas y carpetas en minúscula (ya no dependen de mayúsculas/minúsculas).
- React escapa el texto: no hay XSS por `innerHTML`.
- `prompt()` reemplazado por ventanas modales con selects y fechas.
- Controles vencidos marcados como "Vencido"; filtros por estado del control.
- RUT con dígito verificador y sin duplicados (las fichas de demostración se pueden editar sin cambiar su RUT).
- Código dividido en componentes; etiquetas de rol en un solo lugar.
