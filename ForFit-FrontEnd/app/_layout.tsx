import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import CategoryItemsScreen from '../app/CategoryItems';
import { StripeProvider } from '@stripe/stripe-react-native'; 
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; 
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
       <StripeProvider publishableKey="pk_test_51PD2aQ2MoEptcHuVo941Afhp3AyTmHwJi74XNVXSKh4zvi75ZHgaCsXqVp0uM9QIG3CQNTP1wowNHftdTDrk5DmO00ITT0gxuR">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false,gestureEnabled: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" options={{ headerShown: false,gestureEnabled: false}} />
        <Stack.Screen name="Hellocard" options={{ headerShown: false }} />
        <Stack.Screen name="Wishlist"  />
        <Stack.Screen name="Profile" />
        <Stack.Screen
          name="ShippingAddress"
          options={{
            title: 'Shipping Addresses',
          }}
        />
        <Stack.Screen
          name="AddressForm"
          options={{
            title: 'Address Form',
          }}
        />
        <Stack.Screen name="TermsAndConditions" />
        <Stack.Screen name="AboutUs" />
        <Stack.Screen name="Logout" />
        <Stack.Screen name="ChangePassword" />
        <Stack.Screen name="ProductDetails" options={{headerTitle: '', headerTransparent: true,headerTintColor: 'white'}}/>
        <Stack.Screen name="UnityScreen" options={{headerTitle: '', headerTransparent: true, headerTintColor: 'gray'}}/>
        <Stack.Screen name="Review"/>
        
        <Stack.Screen
          name="CategoryItems"
          options={{
            gestureEnabled: false, 
          }}
        />
        
        <Stack.Screen name="SearchPage" />
        <Stack.Screen name="SearchItems" />
        <Stack.Screen name="PaymentScreen" />
      </Stack>
      </StripeProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
};

export default RootLayout;
