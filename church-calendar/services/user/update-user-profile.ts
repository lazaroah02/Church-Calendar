import { BASE_URL, USER_PROFILE_URL } from "@/api-endpoints";

interface UpdateUserProfileProps {
  token: string | undefined | null;
  values: {
    full_name: string;
    email: string;
    phone_number: string;
    description: string;
    profile_img: any;
  };
}

export function updateUserProfile({
  token = "",
  values,
}: UpdateUserProfileProps) {
  const formData = new FormData();

  formData.append("full_name", values.full_name);
  formData.append("email", values.email);
  formData.append("phone_number", values.phone_number);
  formData.append("description", values.description);

  if (values.profile_img && !values.profile_img.startsWith(BASE_URL)) {
    const filename = values.profile_img.split("/").pop() ?? "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("profile_img", {
      uri: values.profile_img,
      name: filename,
      type,
    } as any);
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit",
      "Accept-Language":"es"
    },
    body: formData,
  };

  return fetch(USER_PROFILE_URL, options)
    .then((res) => {
      return res.json().then((data) => {
        if (res.ok) {
          return data;
        } else {
          const errors: Record<string, string> = {};

          if (data.full_name) {
            errors.full_name = "Nombre Incorrecto";
          }
          else if (data.phone_number) {
            errors.phone_number = "Teléfono inválido";
          }
          else if (data.email) {
            errors.email = "Correo inválido";
          }else{
            errors.general = "Error al conectar con el servidor. Inténtalo mas tarde."
          }

          throw errors;
        }
      });
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
