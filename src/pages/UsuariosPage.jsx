import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import FormField from "../components/FormField.jsx";
import Icon from "../components/Icon.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import useForm from "../hooks/useForm.js";
import {
  addUser,
  deleteUser,
  getDeletedUsers,
  getUsers,
  permanentlyDeleteUser,
  restoreUser,
} from "../services/storage.js";
import { required } from "../utils/validators.js";

const rolLabel = (rol) =>
  rol === "profesional" ? "Médico / Profesional" : rol === "recepcionista" ? "Recepcionista" : "Administrador";

export default function UsuariosPage() {
  const { session } = useAuth();
  const showToast = useToast();
  const [usuarios, setUsuarios] = useState(() => getUsers());
  const [eliminados, setEliminados] = useState(() => getDeletedUsers());
  const [busqueda, setBusqueda] = useState("");
  const form = useForm(
    { nombreUsuario: "", usuario: "", clave: "", rol: "profesional" },
    {
      nombreUsuario: required("Ingresa el nombre."),
      usuario: required("Ingresa el usuario."),
      clave: required("Ingresa la contraseña."),
    }
  );

  const refrescar = () => {
    setUsuarios(getUsers());
    setEliminados(getDeletedUsers());
  };

  const texto = busqueda.trim().toLowerCase();
  const filtrados = usuarios.filter((u) => !texto || `${u.nombre} ${u.usuario} ${u.rol}`.toLowerCase().includes(texto));

  const agregar = (e) => {
    e.preventDefault();
    if (!form.validateAll()) {
      showToast("Completa correctamente los campos.", "danger");
      return;
    }
    const usuario = form.values.usuario.trim().toLowerCase();
    if (getUsers().some((u) => u.usuario.toLowerCase() === usuario)) {
      showToast("Ese nombre de usuario ya existe.", "danger");
      return;
    }
    addUser({ nombre: form.values.nombreUsuario.trim(), usuario, clave: form.values.clave, rol: form.values.rol });
    form.reset();
    showToast("Usuario agregado correctamente.");
    refrescar();
  };

  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar este usuario? Quedará guardado temporalmente en la papelera.")) return;
    deleteUser(id);
    showToast("Usuario eliminado. Puedes restaurarlo desde la papelera.");
    refrescar();
  };

  const restaurar = (id) => {
    if (restoreUser(id)) showToast("Usuario restaurado correctamente.");
    else showToast("No se pudo restaurar: ya existe un usuario con ese nombre.", "danger");
    refrescar();
  };

  const eliminarDefinitivo = (id) => {
    if (!window.confirm("¿Eliminar definitivamente este usuario? Esta acción no se puede deshacer.")) return;
    permanentlyDeleteUser(id);
    showToast("Usuario eliminado definitivamente.");
    refrescar();
  };

  return (
    <>
      <div className="input-group search-group mb-3">
        <span className="input-group-text">
          <Icon name="search" size={16} />
        </span>
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por nombre, usuario o rol…"
          aria-label="Buscar usuario"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <form className="card form-card mb-4" onSubmit={agregar} noValidate>
        <div className="card-body p-3 p-md-4">
          <div className="section-title">Agregar médico o recepcionista</div>
          <div className="row g-3">
            <FormField form={form} name="nombreUsuario" label="Nombre" />
            <FormField form={form} name="usuario" label="Usuario" autoComplete="off" />
            <FormField form={form} name="clave" label="Contraseña" type="password" autoComplete="new-password" />
            <FormField form={form} name="rol" label="Rol" as="select">
              <option value="profesional">Médico / Profesional</option>
              <option value="recepcionista">Recepcionista</option>
            </FormField>
          </div>
          <button className="btn btn-primary mt-3" type="submit">
            Agregar usuario
          </button>
        </div>
      </form>

      <div className="card table-card mb-4">
        <div className="table-responsive">
          <table className="table table-caredent align-middle mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState>No se encontraron usuarios.</EmptyState>
                  </td>
                </tr>
              ) : (
                filtrados.map((u) => (
                  <tr key={u.id}>
                    <td className="cell-name">{u.nombre}</td>
                    <td>{u.usuario}</td>
                    <td>{rolLabel(u.rol)}</td>
                    <td className="text-end">
                      {u.id === session.userId ? (
                        <span className="text-muted">Sesión actual</span>
                      ) : (
                        <button type="button" className="btn btn-danger-soft btn-sm" onClick={() => eliminar(u.id)}>
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-title">Papelera de usuarios</div>
      <div className="card table-card">
        <div className="table-responsive">
          <table className="table table-caredent align-middle mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Eliminado el</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eliminados.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState>No hay usuarios eliminados.</EmptyState>
                  </td>
                </tr>
              ) : (
                eliminados.map((u) => (
                  <tr key={u.id}>
                    <td className="cell-name">{u.nombre}</td>
                    <td>{u.usuario}</td>
                    <td>{rolLabel(u.rol)}</td>
                    <td className="text-nowrap">{u.eliminadoEl ? new Date(u.eliminadoEl).toLocaleString("es-CL") : "—"}</td>
                    <td>
                      <div className="d-flex flex-wrap justify-content-end gap-2">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => restaurar(u.id)}>
                          Restaurar
                        </button>
                        <button type="button" className="btn btn-danger-soft btn-sm" onClick={() => eliminarDefinitivo(u.id)}>
                          Eliminar definitivamente
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
