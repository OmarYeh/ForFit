import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontAwesome } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native'; 
import { Icon } from 'react-native-elements';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        backgroundColor={Colors[colorScheme ?? 'light'].background} // Set background color based on theme
      />
             <StripeProvider publishableKey="pk_test_51PD2aQ2MoEptcHuVo941Afhp3AyTmHwJi74XNVXSKh4zvi75ZHgaCsXqVp0uM9QIG3CQNTP1wowNHftdTDrk5DmO00ITT0gxuR">
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="ShopScreen"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="CategoriesScreen"
          options={{
            title: 'Categories',
            tabBarIcon: ({ color }) => <Icon size={28} name="storefront" color={color} />,
          }}


        />
       <Tabs.Screen
          name="Chatbot"
          options={{
            title: 'ChatBot',
            tabBarIcon: ({ color }) => <Icon size={28} name="android" color={color} />,
          }}


        />
        <Tabs.Screen
          name="CartScreen"
          options={{
            title: 'ShoppingBag',
            tabBarIcon: ({ color }) => <FontAwesome name="shopping-bag" size={26} color={color} />,
          }
        }
        />
                <Tabs.Screen
          name="Settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Icon size={28} name="person" color={color} />,
          }
        }
        />
      </Tabs>
            </StripeProvider>
    </>
  );
}
