import { LOGIN_URL } from "@/api-endpoints";
import { LoginResponse } from "@/types/auth";

export function login({
  email,
  pass,
}: {
  email: string;
  pass: string;
}): Promise<LoginResponse> {
  return fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language":"es"
    },
    body: JSON.stringify({ email: email, password: pass }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.token) {
        return data;
      } else {
        const errors: Record<string, string> = {};

        if (data.email) {
          errors.email = "Correo inválido";
        }
        else if (data.password) {
          errors.pass = "Ingresa una contraseña válida";
        }
        else if (data.non_field_errors) {
          errors.general = "Credenciales incorrectas";
        }else{
          errors.general = "Error al conectar con el servidor. Inténtalo mas tarde."
        }

        throw errors;
      }
    })
    .catch((error) => {
      if (
        error instanceof TypeError &&
        error.message === "Network request failed"
      ) {
        throw new Error(
          JSON.stringify({
            general: "Error en la operación. Revisa tu conexión de internet.",
          })
        );
      }
      throw new Error(
        JSON.stringify(error)
      );
    });
}
