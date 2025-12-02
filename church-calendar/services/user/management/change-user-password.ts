import { MANAGE_USERS_URL } from "@/api-endpoints";

export async function changeUserPassword({
  new_password,
  userId,
  token = "",
}: {
  new_password: string;
  userId: string | number;
  token: string;
}) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language": "es",
    },
    body: JSON.stringify({ new_password: new_password }),
  };
  try {
    const res = await fetch(
      `${MANAGE_USERS_URL}${userId}/change_password/`,
      options
    );
    if (res.ok) {
      return;
    } else {
      const data = await res.json();
      const errors: Record<string, string> = {};

      if (data.message) {
        errors.password1 = data.message;
      }
      if (data.password[0].includes("short")) {
        errors.password1 =
          "La contraseña es muy corta. Debe contener al menos 8 caracteres";
        errors.password2 =
          "La contraseña es muy corta. Debe contener al menos 8 caracteres";
      } else {
        errors.password1 = data.password[0];
      }

      throw errors;
    }
  } catch (error) {
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
      JSON.stringify({
        general: "Error al conectar con el servidor. Inténtalo mas tarde.",
      })
    );
  }
}
