import { createContext, useCallback, useState, type PropsWithChildren } from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { login } from "@/services/auth/login";
import {
  AuthContenxtProps,
  Session,
  SignInProps,
  RegisterProps,
} from "@/types/auth";
import { persister, queryClient } from "@/lib/query-client";
import { register } from "@/services/auth/register";
import { updateUserNotificationTokenAndTimezone } from "@/services/notifications/update-user-notification-token-and-timezone";
import { router } from "expo-router";

export const AuthContext = createContext<AuthContenxtProps>({
  signIn: () => null,
  signOut: () => null,
  register: () => null,
  session: null,
  isLoading: false,
  isGuestUser: false,
  updateGuestStatus: () => null,
  updateSession: () => null,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [isGuestUser, setIsGuestUser] = useState(false)

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
    // first unsubscribe user from notifications
    if(session){
      try {
        await updateUserNotificationTokenAndTimezone({
          token: session ? JSON.parse(session).token : "",
          new_fcm_token: "",
        });
      } catch (err:any) {
        console.warn("Error clearing user notification token:", err.message);
      }
    }
    // then clear session and cached data
    setSession(null);
    updateGuestStatus(false)
    queryClient.clear();
    queryClient.removeQueries();
    await persister.removeClient();
    queryClient.invalidateQueries({ queryKey: ["events"] });
    router.replace("/welcome")
  };

  const updateSession = useCallback((newSession: Session) => {
    setSession(
      JSON.stringify({
        token: newSession?.token,
        userInfo: newSession.userInfo,
      })
    );
  },[setSession]);

  const updateGuestStatus = useCallback((newStatus: boolean) => {
    setIsGuestUser(newStatus)
  },[])

  return (
    <AuthContext
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        register: handleRegister,
        session: session ? JSON.parse(session) : null,
        isGuestUser,
        updateGuestStatus: updateGuestStatus,
        isLoading,
        updateSession: updateSession,
      }}
    >
      {children}
    </AuthContext>
  );
}
