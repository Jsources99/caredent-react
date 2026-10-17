import { useState } from "react";
import Field from "../components/Field";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";
import {
  ROLES_GESTIONABLES, addUser, deleteUser, getDeletedUsers, getUsers, permanentlyDeleteUser, restoreUser,
} from "../data/store";
import { useForm } from "../useForm";
import { ROL_LABEL } from "../utils";

const INICIAL = { nombreUsuario: "", usuario: "", clave: "", rol: "profesional" };

export default function Usuarios() {
  const toast = useToast();
  const [texto, setTexto] = useState("");
  const [usuarios, setUsuarios] = useState(getUsers);
  const [eliminados, setEliminados] = useState(getDeletedUsers);

  const form = useForm(INICIAL, (v) => {
    const e = {};
    if (!v.nombreUsuario.trim()) e.nombreUsuario = "Ingresa el nombre.";
    if (!v.usuario.trim()) e.usuario = "Ingresa el usuario.";
    if (!v.clave) e.clave = "Ingresa la contraseña.";
    return e;
  });

  const recargar = () => {
    setUsuarios(getUsers());
    setEliminados(getDeletedUsers());
  };

  // Solo se administran los roles "profesional" y "recepcionista".
  const q = texto.trim().toLowerCase();
  const visibles = usuarios.filter(
    (u) => ROLES_GESTIONABLES.includes(u.rol) && (!q || `${u.nombre} ${u.usuario} ${ROL_LABEL[u.rol]}`.toLowerCase().includes(q))
  );
  const papelera = eliminados.filter((u) => ROLES_GESTIONABLES.includes(u.rol));

  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) {
      toast("Completa correctamente los campos.", "danger");
      return;
    }
    const usuario = form.values.usuario.trim().toLowerCase();
    if (getUsers().some((u) => u.usuario.toLowerCase() === usuario)) {
      toast("Ese nombre de usuario ya existe.", "danger");
      return;
    }
    addUser({ nombre: form.values.nombreUsuario.trim(), usuario, clave: form.values.clave, rol: form.values.rol });
    form.reset();
    recargar();
    toast("Usuario agregado correctamente.");
  };

  const eliminar = (u) => {
    if (!window.confirm("¿Eliminar este usuario? Quedará guardado temporalmente en la papelera.")) return;
    deleteUser(u.id);
    recargar();
    toast("Usuario eliminado. Puedes restaurarlo desde la papelera.");
  };

  const restaurar = (u) => {
    if (restoreUser(u.id)) toast("Usuario restaurado correctamente.");
    else toast("No se pudo restaurar: ya existe un usuario con ese nombre.", "danger");
    recargar();
  };

  const purgar = (u) => {
    if (!window.confirm("¿Eliminar definitivamente este usuario? Esta acción no se puede deshacer.")) return;
    permanentlyDeleteUser(u.id);
    recargar();
    toast("Usuario eliminado definitivamente.");
  };

  return (
    <Layout eyebrow="Administración" title="Usuarios del sistema">
      <div className="toolbar">
        <div className="search-box">
          <input placeholder="Buscar por nombre, usuario o rol…" type="text" value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
      </div>
      <div className="form-card" style={{ marginBottom: 20 }}>
        <div className="section-title">Agregar médico o recepcionista</div>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <Field form={form} name="nombreUsuario" label="Nombre" type="text" />
            <Field form={form} name="usuario" label="Usuario" type="text" />
            <Field form={form} name="clave" label="Contraseña" type="password" />
            <Field form={form} name="rol" label="Rol" as="select">
              <option value="profesional">{ROL_LABEL.profesional}</option>
              <option value="recepcionista">{ROL_LABEL.recepcionista}</option>
            </Field>
          </div>
          <button className="btn btn--primary" type="submit">Agregar usuario</button>
        </form>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {visibles.length ? visibles.map((u) => (
              <tr key={u.id}>
                <td className="cell-name">{u.nombre}</td>
                <td>{u.usuario}</td>
                <td>{ROL_LABEL[u.rol]}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn btn--danger btn--sm" type="button" onClick={() => eliminar(u)}>Eliminar</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4"><div className="empty-state">No se encontraron usuarios.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="section-title mt-24">Papelera de usuarios</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Eliminado el</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {papelera.length ? papelera.map((u) => (
              <tr key={u.id}>
                <td className="cell-name">{u.nombre}</td>
                <td>{u.usuario}</td>
                <td>{ROL_LABEL[u.rol]}</td>
                <td>{u.eliminadoEl ? new Date(u.eliminadoEl).toLocaleString("es-CL") : "—"}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn btn--ghost btn--sm" type="button" onClick={() => restaurar(u)}>Restaurar</button>{" "}
                  <button className="btn btn--danger btn--sm" type="button" onClick={() => purgar(u)}>Eliminar definitivamente</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5"><div className="empty-state">No hay usuarios eliminados.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
