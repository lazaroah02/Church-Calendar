import { MANAGE_USERS_URL } from "@/api-endpoints";

export async function changePassword({
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
    },
    body: JSON.stringify({ new_password: new_password }),
  };
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
      errors.new_password1 = data.message;
    }
    if (data.password[0].includes("short")) {
      errors.new_password1 =
        "La contraseña es muy corta. Debe contener al menos 8 caracteres";
    } else {
      errors.new_password1 = data.password[0];
    }

    return errors;
  }
}
