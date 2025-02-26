import {StyleSheet, Text } from "react-native";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/context/AuthContext";
import { useTheme } from "@/lib/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function LoginPage() {
  const { signIn } = useAuth();
  const styles = createStyles();

  return (
    <SafeAreaView style={styles.container}>
      <GoogleSignInButton onPress={signIn} />
      <Text style={styles.text}> New User ? Continue to <Link href="/auth/sign-up" style={styles.link}>Sign up</Link></Text>
    </SafeAreaView>
  );
}

const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    text: {
      fontSize: 12,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.foreground,
    },
    link: {
      color: theme.primary,
      textDecorationLine: "underline",
    },
  });
}
