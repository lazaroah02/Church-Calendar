import { createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { login } from "@/services/auth/login";
import { Alert } from "react-native";
import { Session } from "@/types/auth";

export const AuthContext = createContext<{
  signIn: ({
    email,
    pass,
    onLoginSuccess,
  }: {
    email: string;
    pass: string;
    onLoginSuccess: () => void;
  }) => void;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext
      value={{
        signIn: ({ email, pass, onLoginSuccess }) => {
          login({ email, pass })
            .then((data) => {
              setSession(
                JSON.stringify({
                  token: data.token,
                  userInfo: data.user_info,
                })
              );
              onLoginSuccess();
            })
            .catch((err) => Alert.alert(err.message));
        },
        signOut: () => {
          setSession(null);
        },
        session: session ? JSON.parse(session) : null,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
