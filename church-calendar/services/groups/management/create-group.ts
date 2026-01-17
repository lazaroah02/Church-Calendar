import { BASE_URL, MANAGE_GROUPS_URL } from "@/api-endpoints";
import { GroupManagementData } from "@/types/group";

export function createGroup({
  token = "",
  data,
}: {
  token: string;
  data: GroupManagementData;
}) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("color", data.color);

  if (data.img && !data.img.startsWith(BASE_URL)) {
    const filename = data.img.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("img", {
      uri: data.img,
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

  return fetch(`${MANAGE_GROUPS_URL}`, options)
    .then((res) => {
      return res.json().then((data) => {
        if (res.ok) {
          return data;
        } else {
          const errors: Record<string, string> = {};

          if (data.name) {
            errors.name = data.name[0];
          }
          else if (data.description) {
            errors.description = data.description[0];
          }
          else if (data.color) {
            errors.color = data.color[0];
          }
          else if (data.non_field_errors) {
            errors.general = data.non_field_errors[0];
          }
          else{
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
        throw {general: "Error en la operación. Revisa tu conexión de internet."}
      }
      throw error
    });
}
