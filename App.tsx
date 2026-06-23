import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import FocusScreen from './src/screens/Focus/FocusScreen';
import NotesScreen from './src/screens/Notes/NotesScreen';
import OrganizeScreen from './src/screens/Organize/OrganizeScreen';
import AnalyticsScreen from './src/screens/Analytics/AnalyticsScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Focus: 'timer-outline',
  Notes: 'document-text-outline',
  Organize: 'folder-open-outline',
  Analytics: 'bar-chart-outline',
  Settings: 'settings-outline',
};

const ICONS_FILLED: Record<string, keyof typeof Ionicons.glyphMap> = {
  Focus: 'timer',
  Notes: 'document-text',
  Organize: 'folder-open',
  Analytics: 'bar-chart',
  Settings: 'settings',
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const icon = focused ? ICONS_FILLED[route.name] : ICONS[route.name];
            return <Ionicons name={icon} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6C63FF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#1C1C1E',
            borderTopColor: '#2C2C2E',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#1C1C1E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Focus" component={FocusScreen} options={{ title: 'Focus' }} />
        <Tab.Screen name="Notes" component={NotesScreen} options={{ title: 'Notes' }} />
        <Tab.Screen name="Organize" component={OrganizeScreen} options={{ title: 'Organize' }} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
