import { CHANGE_PASSWORD_URL } from "@/api-endpoints";

export async function changePassword({
  new_password1,
  new_password2,
  token = "",
}: {
  new_password1: string;
  new_password2: string;
  token: string;
}) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language": "es",
    },
    body: JSON.stringify({
      new_password1: new_password1,
      new_password2: new_password2,
    }),
  };
  try {
    const res = await fetch(`${CHANGE_PASSWORD_URL}`, options);
    if (res.ok) {
      return;
    } else {
      const data = await res.json();
      const errors: Record<string, string> = {};

      if (data.new_password1) {
        errors.password1 = data.new_password1[0];
      }
      if (data.new_password2) {
        if (data.new_password2[0].includes("short")) {
          errors.password2 =
            "La contraseña es muy corta. Debe contener al menos 8 caracteres";
          errors.password1 =
            "La contraseña es muy corta. Debe contener al menos 8 caracteres";
        } else {
          errors.password2 = data.new_password2[0];
        }
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
