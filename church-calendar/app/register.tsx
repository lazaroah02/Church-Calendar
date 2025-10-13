import { router } from "expo-router";
import { StatusBar, Text, View, Pressable, TextInput } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useSession } from "@/hooks/auth/useSession";
import { Label } from "@react-navigation/elements";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppTheme } from "@/theme";
import { useThemeStyles } from "@/hooks/useThemedStyles";
import { MyNavigationBar } from "@/components/navigation/my-navigation-bar";
import { CustomInput } from "@/components/form/custom-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChurchGroupsPicker } from "@/components/form/church-groups-picker";

export default function Register() {
  const { register } = useSession();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const styles = useThemeStyles(registerStyles);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShow(false);
    if (currentDate) setDate(currentDate);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEAEA" }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        style={{ backgroundColor: "rgba(236, 161, 0, 1)" }}
      >
        <MyNavigationBar buttonsStyle="dark" />
        <View style={styles.form}>
          <Text style={styles.formTitle}>Crear Cuenta</Text>

          {/*Register Info*/}
          <View style={styles.formSection}>
            <Label style={[styles.label, styles.formSectionTitle]}>
              Información de Registro
            </Label>

            <View>
              <Label style={styles.label}>Correo</Label>
              <CustomInput style={styles.input} />
            </View>

            <View>
              <Label style={styles.label}>Contraseña</Label>
              <CustomInput isPassword={true} style={styles.input} />
            </View>

            <View>
              <Label style={styles.label}>Repetir Contraseña</Label>
              <CustomInput isPassword={true} style={styles.input} />
            </View>
          </View>

          {/*Contact Info*/}
          <View style={styles.formSection}>
            <Label style={[styles.label, styles.formSectionTitle]}>
              Información de Contacto
            </Label>

            <View>
              <Label style={styles.label}>Nombre Completo</Label>
              <CustomInput style={styles.input} />
            </View>

            <View>
              <Label style={styles.label}>Número de Teléfono</Label>
              <CustomInput style={styles.input} keyboardType="phone-pad" />
            </View>

            <View>
              <Label style={styles.label} onPress={() => setShow(true)}>
                Fecha de Nacimiento
              </Label>
              <Pressable onPress={() => setShow(true)}>
                <Text
                  style={[
                    styles.input,
                    {
                      textAlignVertical: "center",
                      height: 50,
                      paddingLeft: 10,
                      marginTop: 10,
                    },
                  ]}
                >
                  {date.toLocaleDateString()}
                </Text>
              </Pressable>
              {show && (
                <DateTimePicker
                  testID="datePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  onChange={onChange}
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
              onChange={(selectedGrous) => console.log(selectedGrous)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Pressable
          style={styles.registerButton}
          onPress={() => {
            //signIn();
            router.replace("/(tabs)/calendar");
          }}
        >
          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
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
    color: "#000",
    fontFamily: "InterVariable",
    fontSize: theme.fontSizes.lg,
    fontWeight: "400",
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
    display: "flex",
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
});
