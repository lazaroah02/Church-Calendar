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
    },
    body:JSON.stringify({"new_password1": new_password1, "new_password2": new_password2})
  };
  const res = await fetch(`${CHANGE_PASSWORD_URL}`, options);
  if (res.ok) {
    return;
  } else {
    const data = await res.json();
    const errors: Record<string, string> = {};

    if (data.new_password1) {
      errors.new_password1 = data.new_password1[0];
    }
    if (data.new_password2) {
      errors.new_password2 = data.new_password2[0];
    }

    return errors;
  }
}
