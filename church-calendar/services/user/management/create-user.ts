import { BASE_URL, MANAGE_USERS_URL } from "@/api-endpoints";
import { UserManagementData } from "@/types/user";

export function createUser({
  token = "",
  data,
  password = "",
}: {
  token: string;
  data: UserManagementData;
  password: string;
}) {
  const formData = new FormData();

  formData.append("email", data.email);
  formData.append("password", password);
  formData.append("full_name", data.full_name);
  formData.append("phone_number", data.phone_number);
  formData.append("description", data.description);
  formData.append("is_active", data.is_active.toString());
  formData.append("is_staff", data.is_staff.toString());

  data.member_groups.forEach((id) => {
    formData.append("member_groups", id.toString());
  });

  if (data.profile_img && !data.profile_img.startsWith(BASE_URL)) {
    const filename = data.profile_img.split("/").pop()?? "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("img", {
      uri: data.profile_img,
      name: filename,
      type,
    } as any);
  }

  const options: RequestInit = {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language": "es",
    },
    body: formData,
  };

  return fetch(`${MANAGE_USERS_URL}`, options)
    .then((res) => {
      return res.json().then((data) => {
        if (res.ok) {
          return data;
        } else {
          const errors: Record<string, string> = {};

          if (data.email) {
            errors.email = data.email[0];
          }
          else if (data.password) {
            if (data.password[0].includes("short")) {
              errors.password =
                "La contraseña es muy corta. Debe contener al menos 8 caracteres";
            } else {
              errors.password = data.password[0];
            }
          }
          else if (data.full_name) {
            errors.full_name = data.full_name[0];
          }
          else if (data.phone_number) {
            errors.phone_number = data.phone_number[0];
          }
          else if (data.non_field_errors) {
            errors.general = data.non_field_errors[0];
          }else{
            errors.general = "Error al conectar con el servidor. Inténtalo mas tarde."
          }

          throw errors;
        }
      });
    })
    .catch((errors) => {
      if (
        errors instanceof TypeError &&
        errors.message === "Network request failed"
      ) {
        throw {general: "Error en la operación. Revisa tu conexión de internet."}
      }
      throw errors
    });
}
