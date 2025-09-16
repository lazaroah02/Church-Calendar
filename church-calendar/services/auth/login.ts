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
        if (data.password) {
          throw new Error("Ingresa una contraseña válida");
        } else if (data.non_field_errors) {
          throw new Error("Credenciales Incorrectas");
        } else {
          throw new Error("Error al iniciar sesión");
        }
      }
    });
}
