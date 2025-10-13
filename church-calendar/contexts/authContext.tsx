import { createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { login } from "@/services/auth/login";
import {
  AuthContenxtProps,
  Session,
  SignInProps,
  RegisterProps,
} from "@/types/auth";
import { persister, queryClient } from "@/lib/query-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { register } from "@/services/auth/register";

export const AuthContext = createContext<AuthContenxtProps>({
  signIn: () => null,
  signOut: () => null,
  register: () => null,
  session: null,
  isLoading: false,
  updateSession: () => null,
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
        updateSession({
          token: data.token,
          userInfo: data.user_info,
        });
        onLoginSuccess();
      })
      .catch((err: Error) => {
        onLoginError(err);
      });
  };

  const handleRegister = ({ data, onSuccess, onError }: RegisterProps) => {
    register(data)
      .then(() => {
        onSuccess();
      })
      .catch((err: Error) => {
        onError(err);
      });
  };

  const handleSignOut = async () => {
    setSession(null);
    queryClient.clear();
    queryClient.removeQueries();
    await persister.removeClient();
    await AsyncStorage.clear();
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const updateSession = (newSession: Session) => {
    setSession(
      JSON.stringify({
        token: newSession?.token,
        userInfo: newSession.userInfo,
      })
    );
  };

  return (
    <AuthContext
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        register: handleRegister,
        session: session ? JSON.parse(session) : null,
        isLoading,
        updateSession: updateSession,
      }}
    >
      {children}
    </AuthContext>
  );
}
