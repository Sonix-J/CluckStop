import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { z } from "zod";
import { AppButton } from "@/components/ui";
import {
  AuthCard,
  AuthInput,
  AuthScreen,
  SocialButtons,
} from "@/components/AuthUI";
import { CluckieLogo, CluckieMascot } from "@/components/CluckieBrand";
import { useRoostopStore } from "@/store/useRoostopStore";

const schema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

export default function LoginScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const authenticate = useRoostopStore((s) => s.authenticate);
  const enterGuestMode = useRoostopStore((s) => s.enterGuestMode);

  const submit = () => {
    const result = schema.safeParse({ username, password });
    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      );
      return;
    }
    authenticate();
    router.replace((returnTo || "/(tabs)") as Href);
  };

  const continueAsGuest = () => {
    enterGuestMode();
    router.replace("/(tabs)");
  };

  return (
    <AuthScreen>
      <View className="pt-3">
        <CluckieLogo width={108} />
      </View>
      <View className="items-center">
        <CluckieMascot variant="login" width={200} height={190} />
        <Text className="text-center text-[26px] font-bold text-ink">
          Ready for <Text className="text-rooster">another ride?</Text>
        </Text>
        <Text className="mb-6 mt-2 text-center text-sm text-muted">
          Sign in and let <Text className="text-rooster">Cluckie</Text> watch
          your stop.
        </Text>
      </View>
      <AuthCard>
        <AuthInput
          label="Username"
          placeholder="Enter your username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          error={errors.username}
        />
        <AuthInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <Pressable
          onPress={() => router.push("/auth/forgot-password" as Href)}
          className="mb-3 self-end py-1"
        >
          <Text className="text-sm text-rooster">Forgot password?</Text>
        </Pressable>
        <AppButton title="Login" onPress={submit} />
        <SocialButtons verb="Sign in" />
        <View className="mt-2 flex-row justify-center">
          <Text className="text-sm text-muted">
            Don&apos;t have an account?{" "}
          </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/auth/signup",
                params: returnTo ? { returnTo } : {},
              })
            }
          >
            <Text className="text-sm font-semibold text-rooster">Sign up</Text>
          </Pressable>
        </View>
      </AuthCard>
      <Pressable
          onPress={continueAsGuest}
          className="mt-3 min-h-12 items-center justify-center"
        >
          <Text className="text-sm font-semibold text-muted">
            Continue without an account
          </Text>
        </Pressable>
    </AuthScreen>
  );
}
