import { REGISTER_URL } from "@/api-endpoints";
import { RegisterData } from "@/types/auth";

export function register(data: RegisterData): Promise<null> {
  const formData = new FormData();

  // remove hour part of the date
  const born_at = data.born_at.toISOString().split("T")[0];

  formData.append("email", data.email);
  formData.append("password1", data.password1);
  formData.append("password2", data.password2);
  formData.append("full_name", data.full_name);
  formData.append("phone_number", data.phone_number);
  formData.append("born_at", born_at);

  data.member_groups.forEach((id) => {
    formData.append("member_groups", id.toString());
  });

  return fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Accept-Language": "es",
    },
    body: formData,
  }).then((res) => {
    if (res.ok) {
      return null;
    }
    return res.json().then((data) => {
      console.log(data);
      const errors: Record<string, string> = {};

      if (data.email) {
        errors.email = data.email[0];
      }
      if (data.password1) {
        if (data.password1[0].includes("short")) {
          errors.password1 =
            "La contraseña es muy corta. Debe contener al menos 8 caracteres";
        } else {
          errors.password1 = data.password1[0];
        }
      }
      if (data.password2) {
        if (data.password2[0].includes("short")) {
          errors.password2 =
            "La contraseña es muy corta. Debe contener al menos 8 caracteres";
        } else {
          errors.password2 = data.password2[0];
        }
      }
      if (data.full_name) {
        errors.full_name = data.full_name[0];
      }
      if (data.phone_number) {
        errors.phone_number = data.phone_number[0];
      }
      if (data.born_at) {
        errors.born_at = data.born_at[0];
      }
      if (data.non_field_errors) {
        if (
          data.non_field_errors[0].includes("contraseña") ||
          data.non_field_errors[0].includes("password")
        ) {
          errors.password2 = data.non_field_errors[0];
        } else {
          errors.general = data.non_field_errors[0];
        }
      }

      throw errors;
    });
  });
}
