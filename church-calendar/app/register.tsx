import { router } from "expo-router";
import {
  StatusBar,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import DateTimePicker, {
} from "@react-native-community/datetimepicker";

import { useSession } from "@/hooks/auth/useSession";
import { Label } from "@react-navigation/elements";
import { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { CustomInput } from "@/components/form/custom-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChurchGroupsPicker } from "@/components/form/church-groups-picker";
import { Ionicons } from "@expo/vector-icons";
import FormErrorBanner from "@/components/form/form-banner-error";

type RegisterErrors = {
  email: string;
  password1: string;
  password2: string;
  full_name: string;
  phone_number: string;
  born_at: string;
  member_groups: string;
};

export default function Register() {
  const { register } = useSession();
  const styles = useThemeStyles(registerStyles);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  const [formValues, setFormValues] = useState({
    email: "",
    password1: "",
    password2: "",
    full_name: "",
    phone_number: "",
    born_at: new Date(),
    member_groups: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors | null>(null);

  const handleChange = (
    key: keyof typeof formValues,
    value: string | Date | number[] | undefined
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors(null);
  };

  const handleSubmit = () => {
    setLoading(true);
    register({
      data: formValues,
      onSuccess: () => {
        setLoading(false);
        router.replace("/account-created");
      },
      onError: (err) => {
        setErrors(err as RegisterErrors);
        setLoading(false);
        scrollRef.current?.scrollToPosition(0, 0, true);
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEAEA" }}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        style={{ backgroundColor: "rgba(236, 161, 0, 1)" }}
      >
        <MyNavigationBar buttonsStyle="dark" />
        <View style={styles.form}>
          <Text style={styles.formTitle}>Crear Cuenta</Text>

          {errors && (
            <FormErrorBanner
              message={
                Object.values(errors).find((err) => Boolean(err)) ||
                "Ocurrió un error inesperado."
              }
              style={{ marginTop: 10, marginBottom: 0 }}
            />
          )}

          {/*Register Info*/}
          <View style={styles.formSection}>
            <Label style={[styles.label, styles.formSectionTitle]}>
              Información de Registro
            </Label>

            <View>
              <Label style={styles.label}>Correo</Label>
              <CustomInput
                inputStyle={styles.input}
                value={formValues.email}
                error={errors?.email}
                keyboardType="email-address"
                onChangeText={(text) => handleChange("email", text)}
              />
            </View>

            <View>
              <Label style={styles.label}>Contraseña</Label>
              <CustomInput
                isPassword={true}
                inputStyle={styles.input}
                error={errors?.password1}
                value={formValues.password1}
                onChangeText={(text) => handleChange("password1", text)}
              />
            </View>

            <View>
              <Label style={styles.label}>Repetir Contraseña</Label>
              <CustomInput
                isPassword={true}
                inputStyle={styles.input}
                error={errors?.password2}
                value={formValues.password2}
                onChangeText={(text) => handleChange("password2", text)}
              />
            </View>
          </View>

          {/*Contact Info*/}
          <View style={styles.formSection}>
            <Label style={[styles.label, styles.formSectionTitle]}>
              Información de Contacto
            </Label>

            <View>
              <Label style={styles.label}>Nombre Completo</Label>
              <CustomInput
                error={errors?.full_name}
                inputStyle={styles.input}
                value={formValues.full_name}
                keyboardType="name-phone-pad"
                onChangeText={(text) => handleChange("full_name", text)}
              />
            </View>

            <View>
              <Label style={styles.label}>Número de Teléfono</Label>
              <CustomInput
                inputStyle={styles.input}
                error={errors?.phone_number}
                keyboardType="phone-pad"
                value={formValues.phone_number}
                onChangeText={(text) => handleChange("phone_number", text)}
              />
            </View>

            <View>
              <Label
                style={styles.label}
                onPress={() => setShowDatePicker(true)}
              >
                Fecha de Nacimiento
              </Label>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <Text
                  style={[
                    styles.input,
                    {
                      textAlignVertical: "center",
                      height: 50,
                      paddingLeft: 10,
                      marginTop: 10,
                    },
                    errors?.born_at && {
                      borderWidth: 2,
                      borderColor: "rgb(215, 0, 75)",
                    },
                  ]}
                >
                  {formValues.born_at.toLocaleDateString()}
                </Text>
                {errors?.born_at && (
                  <Ionicons
                    name="alert-circle"
                    size={18}
                    color="#b91c1c"
                    style={[styles.errorIcon]}
                  />
                )}
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  testID="datePicker"
                  value={formValues.born_at}
                  mode="date"
                  onChange={(event, date) => {
                    if (date) {
                      handleChange("born_at", date);
                    }
                    setShowDatePicker(false);
                  }}
                />
              )}
            </View>
          </View>

          <View style={styles.formSection}>
            <Label style={[styles.label, styles.formSectionTitle]}>
              Grupos a los que perteneces
            </Label>
            <ChurchGroupsPicker
              containerStyle={{
                backgroundColor: "#EAEAEA",
              }}
              selectStyle={{ backgroundColor: "#fff" }}
              placeholder="Seleccionar"
              excluded_groups={["Todos", 1]} // Excluded groups by id or name. Id 1 corresponds to general group "Todos"
              onChange={(selectedGrous) =>
                handleChange("member_groups", selectedGrous)
              }
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Pressable style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>
            {!loading ? "Crear Cuenta" : "Creando cuenta"}
          </Text>
          {loading && <ActivityIndicator size="small" color="#fff" />}
        </Pressable>
      </View>
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}

const registerStyles = (theme: AppTheme) => ({
  form: {
    flex: 1,
    display: "flex",
    gap: 10,
    backgroundColor: "#EAEAEA",
    padding: 30,
    paddingHorizontal: 20,
    marginTop: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    alignSelf: "center",
    color: "#442525",
    fontFamily: "InterVariable",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 5,
    marginBottom: 10,
  },
  formSection: {
    marginTop: 30,
  },
  formSectionTitle: {
    fontWeight: "bold",
    fontSize: theme.fontSizes.xl,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
    fontWeight: "400",
    paddingLeft: 10,
  },
  label: {
    alignSelf: "flex-start",
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
    fontWeight: "600",
    opacity: 0.8,
  },
  registerButton: {
    width: 330,
    height: 55,
    backgroundColor: "#AD5A00",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: theme.fontSizes.xl,
    fontWeight: "600",
    fontFamily: "InterVariable",
  },
  errorIcon: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: [{ translateY: -5 }],
  },
});
