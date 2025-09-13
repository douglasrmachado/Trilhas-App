import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfessorHomeScreen from './src/screens/ProfessorHomeScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import CreateProfessorScreen from './src/screens/CreateProfessorScreen';
import ContactScreen from './src/screens/ContactScreen';
import TrailDetailScreen from './src/screens/TrailDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, token } = useAuth();
  const { colors } = useTheme();
  
  // Se não há usuário logado, mostra apenas as telas de autenticação
  if (!user || !token) {
    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: colors.headerBg },
          headerTitleStyle: { color: colors.headerText },
          headerTintColor: colors.headerText,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  
  // Se há usuário logado, mostra as telas autenticadas
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTitleStyle: { color: colors.headerText },
        headerTintColor: colors.headerText,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfessorHome" component={ProfessorHomeScreen} options={{ title: 'Professor' }} />
      <Stack.Screen name="CreateProfessor" component={CreateProfessorScreen} options={{ title: 'Criar Professor' }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TrailDetail" component={TrailDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserProfile" component={ProfileScreen} options={{ headerShown: false }} />
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
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <NavigationRoot />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function NavigationRoot() {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}
