import { LOGIN_URL } from "@/api-endpoints";
import { RegisterData } from "@/types/auth";

export function register(data: RegisterData): Promise<null> {
  return fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.ok) {
        return null;
      }
      return res
        .json()
        .then((data) => {
          const errors: Record<string, string> = {};

          if (data.email) {
            errors.email = "Correo inválido";
          }
          if (data.password) {
            errors.pass = "Ingresa una contraseña válida";
          }
          if (data.non_field_errors) {
            errors.general = "Credenciales incorrectas";
          }

          throw errors;
        })
        .catch((err) => {
          throw { general: "Error al crear la cuenta" };
        });
    })

    .catch((err) => {
      throw { general: "Error al crear la cuenta" };
    });
}
