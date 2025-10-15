import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfessorHomeScreen from './src/screens/ProfessorHomeScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TrailProvider } from './src/context/TrailContext';
import CreateProfessorScreen from './src/screens/CreateProfessorScreen';
import ContactScreen from './src/screens/ContactScreen';
import TrailDetailScreen from './src/screens/TrailDetailScreen';
import ModuleContentScreen from './src/screens/ModuleContentScreen';
import PDFPreviewScreen from './src/screens/PDFPreviewScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import CampusInfoScreen from './src/screens/CampusInfoScreen';
import SubmitContentScreen from './src/screens/SubmitContentScreen';
import SubmissionsListScreen from './src/screens/SubmissionsListScreen';
import SubmissionDetailScreen from './src/screens/SubmissionDetailScreen';
import MySubmissionsScreen from './src/screens/MySubmissionsScreen';
import MySubmissionDetailScreen from './src/screens/MySubmissionDetailScreen';
import ReviewedSubmissionsScreen from './src/screens/ReviewedSubmissionsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, token, isLoading } = useAuth();
  const { colors } = useTheme();
  
  // Mostrar loading enquanto carrega dados persistidos
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundColor }}>
        <Text style={{ color: colors.textColor }}>Carregando...</Text>
      </View>
    );
  }
  
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
  // Determina a tela inicial baseada no role do usuário
  console.log('🔍 Debug navegação:', { user, role: user?.role });
  const initialRoute = user?.role === 'professor' ? 'ProfessorHome' : 'Home';
  console.log('🎯 Rota inicial determinada:', initialRoute);
  
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTitleStyle: { color: colors.headerText },
        headerTintColor: colors.headerText,
      }}
    >
      {/* Renderizar apenas a tela correta baseada no role */}
      {user?.role === 'professor' ? (
        <>
          <Stack.Screen name="ProfessorHome" component={ProfessorHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CreateProfessor" component={CreateProfessorScreen} options={{ title: 'Criar Professor' }} />
          <Stack.Screen name="SubmissionsList" component={SubmissionsListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SubmissionDetail" component={SubmissionDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ReviewedSubmissions" component={ReviewedSubmissionsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserProfile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CampusInfo" component={CampusInfoScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TrailDetail" component={TrailDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ModuleContent" component={ModuleContentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PDFPreview" component={PDFPreviewScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SubmitContent" component={SubmitContentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MySubmissions" component={MySubmissionsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MySubmissionDetail" component={MySubmissionDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserProfile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CampusInfo" component={CampusInfoScreen} options={{ headerShown: false }} />
        </>
      )}
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
        <TrailProvider>
          <ThemeProvider>
            <NavigationRoot />
          </ThemeProvider>
        </TrailProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function NavigationRoot() {
  const { isDarkMode } = useTheme();
  
  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RootNavigator />
    </NavigationContainer>
  );
}
