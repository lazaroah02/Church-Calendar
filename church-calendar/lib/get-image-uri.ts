import { BASE_URL } from "@/api-endpoints";

export const getImageUri = (url: string) => {
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};
