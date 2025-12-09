import { VERSIONS_FILE_URL } from "@/api-endpoints";

export async function getVersionsFile() {
  try {
    const res = await fetch(VERSIONS_FILE_URL, {cache: "no-store"});
    const data = await res.json();
    return data;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      throw new Error(
        "Error buscando actualización. Revisa tu conexión a internet"
      );
    }
    throw new Error("Error al conectar con el servidor. Inténtalo mas tarde.");
  }
}
