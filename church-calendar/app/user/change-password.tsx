import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { PageHeader } from "@/components/PageHeader";
import { ChangePasswordForm } from "@/components/user/change-password-form";
import { useSession } from "@/hooks/auth/useSession";
import { useCustomToast } from "@/hooks/useCustomToast";
import { changePassword } from "@/services/auth/change-password";
import { ChangePasswordFormData } from "@/types/auth";
import { router } from "expo-router";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { session } = useSession();
  const { showSuccessToast } = useCustomToast();
  function handleSubmit({ password1, password2 }: ChangePasswordFormData) {
    setLoading(true);
    changePassword({
      new_password1: password1,
      new_password2: password2,
      token: session?.token || "",
    })
      .then(() => {
        router.back();
        showSuccessToast({ message: "Contraseña cambiada exitosamente" });
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => setLoading(false));
  }
  function hideErrors(){
    setError(null)
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
        hideErrors = {hideErrors}
      />
    </SafeAreaView>
  );
}
