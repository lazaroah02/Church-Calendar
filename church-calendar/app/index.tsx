import { useSession } from "@/hooks/auth/useSession";
import { Redirect } from "expo-router";
import SplashScreenController from "./splash";

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) return <SplashScreenController />;

  // If logged in, go to main tabs; otherwise go to welcome
  return <Redirect href={session ? "/(tabs)/calendar" : "/welcome"} />;
}