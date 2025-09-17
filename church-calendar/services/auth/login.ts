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
        if (data.password) {
          errors.pass = "Ingresa una contraseña válida";
        }
        if (data.non_field_errors) {
          errors.general = "Credenciales incorrectas";
        }

        throw errors;
      }
    });
}
