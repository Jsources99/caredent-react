import { addUser, attemptLogin, deleteUser, getDeletedUsers, getSession, getUsers, restoreUser } from "../data/store";
import { estadoControl, validarPaciente } from "../utils";

const PACIENTE_VALIDO = {
  nombre: "Ana",
  apellidos: "Rojas Díaz",
  rut: "12.345.678-5",
  fechaNacimiento: "1995-03-10",
  telefono: "+56 9 1234 5678",
  correo: "ana@correo.cl",
};

describe("Lógica: validaciones, estados, sesión y usuarios", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("validarPaciente no devuelve errores cuando los datos son correctos", () => {
    const errores = validarPaciente(PACIENTE_VALIDO, { pacientes: [] });

    expect(errores).toEqual({});
  });

  it("validarPaciente detecta dígito verificador incorrecto, RUT duplicado, nombre vacío y correo inválido", () => {
    const dvMalo = validarPaciente({ ...PACIENTE_VALIDO, rut: "12.345.678-9" }, { pacientes: [] });
    expect(dvMalo.rut).toBe("El dígito verificador del RUT no es correcto.");

    const duplicado = validarPaciente(PACIENTE_VALIDO, { pacientes: [{ id: 1, rut: "12.345.678-5" }] });
    expect(duplicado.rut).toBe("Ya existe un paciente con ese RUT.");

    const otros = validarPaciente({ ...PACIENTE_VALIDO, nombre: "   ", correo: "ana" }, { pacientes: [] });
    expect(otros.nombre).toBe("Ingresa el nombre del paciente.");
    expect(otros.correo).toBe("Ingresa un correo electrónico válido.");
  });

  it("estadoControl marca como vencido un control pendiente con fecha pasada", () => {
    expect(estadoControl({ estado: "pendiente", fecha: "2000-01-01" })).toBe("vencido");
    expect(estadoControl({ estado: "pendiente", fecha: "2099-01-01" })).toBe("pendiente");
    expect(estadoControl({ estado: "confirmado", fecha: "2000-01-01" })).toBe("confirmado");
    expect(estadoControl(null)).toBeNull();
  });

  it("attemptLogin rechaza una clave incorrecta y guarda la sesión con las credenciales correctas", () => {
    spyOn(Storage.prototype, "setItem").and.callThrough();

    const fallido = attemptLogin("profesional", "clave-mala", "profesional");
    expect(fallido.ok).toBeFalse();
    expect(fallido.error).toBe("Usuario o contraseña incorrectos.");
    expect(getSession()).toBeNull();

    const exitoso = attemptLogin("profesional", "profesional123", "profesional");
    expect(exitoso.ok).toBeTrue();
    expect(getSession().rol).toBe("profesional");
    expect(Storage.prototype.setItem).toHaveBeenCalledWith("caredent_sesion", jasmine.any(String));
  });

  it("deleteUser envía un usuario a la papelera, restoreUser lo recupera y el administrador no se puede eliminar", () => {
    const nuevo = addUser({ nombre: "Test", usuario: "test", clave: "1", rol: "profesional" });

    expect(deleteUser(nuevo.id)).toBeTrue();
    expect(getUsers().some((u) => u.id === nuevo.id)).toBeFalse();
    expect(getDeletedUsers().length).toBe(1);

    expect(restoreUser(nuevo.id)).toBeTrue();
    expect(getDeletedUsers().length).toBe(0);
    expect(getUsers().some((u) => u.usuario === "test")).toBeTrue();

    expect(deleteUser(1)).toBeFalse();
  });
});