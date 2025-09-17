import { createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { login } from "@/services/auth/login";
import { Session } from "@/types/auth";

interface SignInProps {
  email: string;
  pass: string;
  onLoginSuccess: () => void;
  onLoginError: (err: Error) => void;
}

export const AuthContext = createContext<{
  signIn: ({ email, pass, onLoginSuccess, onLoginError }: SignInProps) => void;
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

  const handleSignIn = ({
    email,
    pass,
    onLoginSuccess,
    onLoginError,
  }: SignInProps) => {
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
      .catch((err: Error) => {
        onLoginError(err);
      });
  };

  return (
    <AuthContext
      value={{
        signIn: handleSignIn,
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
