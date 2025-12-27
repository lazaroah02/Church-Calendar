import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
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
import { getUserProfile } from "@/services/auth/get-user-profile";
import { isDeepEqual } from "@/lib/deeply-compare-objects";

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
  const [isGuestUser, setIsGuestUser] = useState(false);

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
        onLoginError(JSON.parse(err.message));
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

  const updateGuestStatus = useCallback((newStatus: boolean) => {
    setIsGuestUser(newStatus);
  }, []);

  const handleSignOut = useCallback(async () => {
    // first unsubscribe user from notifications
    if (session) {
      try {
        await updateUserNotificationTokenAndTimezone({
          token: session ? JSON.parse(session).token : "",
          new_fcm_token: "",
        });
      } catch (err: any) {
        console.warn("Error clearing user notification token:", err.message);
      }
    }
    // then clear session and cached data
    setSession(null);
    updateGuestStatus(false);
    queryClient.clear();
    queryClient.removeQueries();
    await persister.removeClient();
    queryClient.invalidateQueries({ queryKey: ["events"] });
    router.replace("/welcome");
  },[session, setSession, updateGuestStatus])

  const updateSession = useCallback(
    (newSession: Session) => {
      setSession(
        JSON.stringify({
          token: newSession?.token,
          userInfo: newSession.userInfo,
        })
      );
    },
    [setSession]
  );

  const handleVerifyCurrentUserInfo = useCallback(() => {
    if (isLoading && !session) return
    
    const parsedSessionInfo: Session = JSON.parse(session)
    
    getUserProfile({ token: parsedSessionInfo.token || "" })
      .then((data) => {
        if(data.is_active === false){
          return handleSignOut()
        }

        const hasChanges = !isDeepEqual(parsedSessionInfo.userInfo, data);

        if (hasChanges) {
          console.log("User data changed, updating...");
          updateSession({token: parsedSessionInfo.token, userInfo: data})
        }
      })
      .catch((err) => {
        if(err.message === "Unauthorized!"){
          return handleSignOut()
        }
        console.error(err)
      });
  },[updateSession, handleSignOut, isLoading, session])

  useEffect(() => {
    if (!isLoading && session) {
      handleVerifyCurrentUserInfo();
    }
  }, [isLoading, session, handleVerifyCurrentUserInfo]);

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
