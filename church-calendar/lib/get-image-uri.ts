import { BASE_URL } from "@/api-endpoints";

export const getImageUri = (url: string) => {
  if (url.startsWith("http")) return url;
  if(url.startsWith("file://")) return url
  return `${BASE_URL}${url}`;
};
