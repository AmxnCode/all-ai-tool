import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingItem {
  icon: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'arrow' | 'info';
  value?: boolean;
  color?: string;
  onToggle?: () => void;
  onPress?: () => void;
}

const FOCUS_SETTINGS: SettingItem[] = [
  {
    icon: 'timer',
    title: 'Default Duration',
    subtitle: '25 minutes',
    type: 'arrow',
  },
  {
    icon: 'pause-circle',
    title: 'Break Duration',
    subtitle: '5 minutes',
    type: 'arrow',
  },
  {
    icon: 'notifications',
    title: 'Notifications',
    subtitle: 'Alert when timer ends',
    type: 'toggle',
    value: true,
  },
  {
    icon: 'vibrate',
    title: 'Haptic Feedback',
    subtitle: 'Vibrate on timer events',
    type: 'toggle',
    value: true,
  },
  {
    icon: 'musical-notes',
    title: 'Focus Sounds',
    subtitle: 'White noise, rain, café',
    type: 'arrow',
  },
];

const AI_SETTINGS: SettingItem[] = [
  {
    icon: 'sparkles',
    title: 'AI Features',
    subtitle: 'Enable smart suggestions',
    type: 'toggle',
    value: true,
    color: '#FFD93D',
  },
  {
    icon: 'mic',
    title: 'Voice Transcription',
    subtitle: 'Auto-transcribe recordings',
    type: 'toggle',
    value: true,
    color: '#6C63FF',
  },
  {
    icon: 'image',
    title: 'Auto-Tag Screenshots',
    subtitle: 'AI categorizes images',
    type: 'toggle',
    value: true,
    color: '#4ECDC4',
  },
  {
    icon: 'analytics',
    title: 'Productivity Insights',
    subtitle: 'Weekly AI reports',
    type: 'toggle',
    value: true,
    color: '#FF6B6B',
  },
];

const APPEARANCE_SETTINGS: SettingItem[] = [
  {
    icon: 'moon',
    title: 'Dark Mode',
    subtitle: 'Always on',
    type: 'toggle',
    value: true,
  },
  {
    icon: 'color-palette',
    title: 'Accent Color',
    subtitle: 'Purple',
    type: 'arrow',
    color: '#6C63FF',
  },
  {
    icon: 'text',
    title: 'Font Size',
    subtitle: 'Medium',
    type: 'arrow',
  },
];

const ACCOUNT_SETTINGS: SettingItem[] = [
  {
    icon: 'person',
    title: 'Account',
    subtitle: 'user@focusflow.app',
    type: 'arrow',
  },
  {
    icon: 'cloud-upload',
    title: 'Backup & Sync',
    subtitle: 'Last synced: 2 min ago',
    type: 'arrow',
  },
  {
    icon: 'download',
    title: 'Export Data',
    subtitle: 'Download your data',
    type: 'arrow',
  },
];

const SUPPORT_SETTINGS: SettingItem[] = [
  {
    icon: 'help-circle',
    title: 'Help & Support',
    type: 'arrow',
  },
  {
    icon: 'chatbubble',
    title: 'Send Feedback',
    type: 'arrow',
  },
  {
    icon: 'star',
    title: 'Rate All AI Tool',
    type: 'arrow',
  },
  {
    icon: 'document-text',
    title: 'Privacy Policy',
    type: 'arrow',
  },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    haptic: true,
    aiFeatures: true,
    voiceTranscription: true,
    autoTag: true,
    insights: true,
    darkMode: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSettingItem = (item: SettingItem, settingKey?: keyof typeof settings) => (
    <TouchableOpacity
      key={item.title}
      style={styles.settingItem}
      onPress={item.onPress || (settingKey ? () => toggleSetting(settingKey) : undefined)}
    >
      <View style={[styles.settingIcon, item.color ? { backgroundColor: item.color + '20' } : {}]}>
        <Ionicons
          name={item.icon as any}
          size={22}
          color={item.color || '#8E8E93'}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
      </View>
      {item.type === 'toggle' && settingKey && (
        <Switch
          value={settings[settingKey]}
          onValueChange={() => toggleSetting(settingKey)}
          trackColor={{ false: '#2C2C2E', true: '#6C63FF80' }}
          thumbColor={settings[settingKey] ? '#6C63FF' : '#8E8E93'}
        />
      )}
      {item.type === 'arrow' && (
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#6C63FF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>All AI Tool User</Text>
          <Text style={styles.profileEmail}>Free Plan</Text>
        </View>
        <TouchableOpacity style={styles.upgradeButton}>
          <Ionicons name="rocket" size={16} color="#FFF" />
          <Text style={styles.upgradeText}>Upgrade</Text>
        </TouchableOpacity>
      </View>

      {/* Ad Banner Placeholder */}
      <View style={styles.adBanner}>
        <Text style={styles.adText}>Advertisement</Text>
      </View>

      {/* Focus Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Focus Timer</Text>
        <View style={styles.settingsGroup}>
          {FOCUS_SETTINGS.map((item) =>
            renderSettingItem(item, item.title.toLowerCase().replace(/\s/g, '') as keyof typeof settings)
          )}
        </View>
      </View>

      {/* AI Settings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Features</Text>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={12} color="#FFD93D" />
            <Text style={styles.aiBadgeText}>Free</Text>
          </View>
        </View>
        <View style={styles.settingsGroup}>
          {AI_SETTINGS.map((item) =>
            renderSettingItem(
              item,
              item.title.toLowerCase().replace(/\s/g, '') as keyof typeof settings
            )
          )}
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingsGroup}>
          {APPEARANCE_SETTINGS.map((item) =>
            renderSettingItem(item, item.title.toLowerCase().replace(/\s/g, '') as keyof typeof settings)
          )}
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsGroup}>
          {ACCOUNT_SETTINGS.map((item) => renderSettingItem(item))}
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.settingsGroup}>
          {SUPPORT_SETTINGS.map((item) => renderSettingItem(item))}
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>All AI Tool</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appCopyright}>Made with AI</Text>
      </View>

      {/* Bottom Ad Placeholder */}
      <View style={styles.adBanner}>
        <Text style={styles.adText}>Advertisement</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  profileEmail: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  upgradeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  adBanner: {
    height: 60,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    borderStyle: 'dashed',
  },
  adText: {
    color: '#636366',
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFD93D20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 12,
  },
  aiBadgeText: {
    color: '#FFD93D',
    fontSize: 11,
    fontWeight: '600',
  },
  settingsGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFF',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6C63FF',
  },
  appVersion: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#636366',
    marginTop: 8,
  },
});
