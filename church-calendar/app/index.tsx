import { useSession } from "@/hooks/auth/useSession";
import { Redirect } from "expo-router";

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) return null; // or show a splash

  // If logged in, go to main tabs; otherwise go to welcome
  return <Redirect href={session ? "/(tabs)/calendar" : "/welcome"} />;
}