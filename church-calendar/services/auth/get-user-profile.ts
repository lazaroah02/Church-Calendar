import { USER_PROFILE_URL } from "@/api-endpoints";

export async function getUserProfile({token = ""}) {
  const options: RequestInit = {
    method: "GET",
    headers:{
      ...(token ? { Authorization: `Token ${token}` } : {}),
      credentials: "omit"
    }
  };
  try {
    const res = await fetch(
      USER_PROFILE_URL,
      options
    );
    if (res.ok) {
      return res.json().then((data) => {
        return data;
      });
    } else {
      if(res.status === 401){
        throw new Error("Unauthorized!");
      }
      throw new Error("Error getting user profile");
    }
  } catch (err: Error | any) {
    throw new Error(err.message || "Error getting user profile");
  }
}
