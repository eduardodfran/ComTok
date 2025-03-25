import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Forgot Password',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify-otp"
        options={{
          title: 'Verify Code',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account-recovery"
        options={{
          title: 'Account Recovery',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
