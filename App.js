import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfessorHomeScreen from './src/screens/ProfessorHomeScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import CreateProfessorScreen from './src/screens/CreateProfessorScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user } = useAuth();
  const { isDarkMode, toggle, colors } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerRight: () => (
          <TextButton label={isDarkMode ? 'Claro' : 'Escuro'} onPress={toggle} color={colors.primary} />
        ),
        headerStyle: { backgroundColor: colors.headerBg },
        headerTitleStyle: { color: colors.headerText },
        headerTintColor: colors.headerText,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerShown: true }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastrar' }} />
      <Stack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ title: 'Recuperar Senha' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="ProfessorHome" component={ProfessorHomeScreen} options={{ title: 'Professor' }} />
      <Stack.Screen name="CreateProfessor" component={CreateProfessorScreen} options={{ title: 'Criar Professor' }} />
    </Stack.Navigator>
  );
}

function TextButton({ label, onPress, color }) {
  return (
    <Text onPress={onPress} style={{ color, fontWeight: 'bold', paddingHorizontal: 12, paddingVertical: 6 }}>
      {label}
    </Text>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationRoot />
      </ThemeProvider>
    </AuthProvider>
  );
}

function NavigationRoot() {
  const { isDarkMode } = useTheme();
  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}
