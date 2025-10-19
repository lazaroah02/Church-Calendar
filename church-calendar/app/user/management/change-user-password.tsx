import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { PageHeader } from "@/components/PageHeader";
import { ChangePasswordForm } from "@/components/user/change-password-form";
import { useSession } from "@/hooks/auth/useSession";
import { useCustomToast } from "@/hooks/useCustomToast";
import { changeUserPassword } from "@/services/user/management/change-user-password";
import { ChangePasswordFormData } from "@/types/auth";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangeUserPassword() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") as string | undefined;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { session } = useSession();
  const { showSuccessToast } = useCustomToast();
  function handleSubmit({ password1, password2 }: ChangePasswordFormData) {
    setLoading(true);
    try {
      validatePasswords({ password1: password1, password2: password2 });
    } catch (error: any) {
      setError(error);
      setLoading(false);
      return;
    }
    changeUserPassword({
      new_password: password1,
      userId: userId || "",
      token: session?.token || "",
    })
      .then(() => {
        router.back();
        showSuccessToast({ message: "Contraseña cambiada exitosamente" });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }
  function hideErrors() {
    setError(null);
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <MyNavigationBar buttonsStyle="dark" />
      <StatusBar barStyle={"dark-content"} />
      <PageHeader title="Cambiar Contraseña" />
      <ChangePasswordForm
        onSubmit={({ password1, password2 }) =>
          handleSubmit({ password1: password1, password2: password2 })
        }
        loading={loading}
        error={error}
        hideErrors={hideErrors}
      />
    </SafeAreaView>
  );
}

const validatePasswords = ({
  password1,
  password2,
}: ChangePasswordFormData) => {
  if (password1 !== password2) {
    throw {
      password2: "La contraseñas no coinciden",
    };
  }
};
