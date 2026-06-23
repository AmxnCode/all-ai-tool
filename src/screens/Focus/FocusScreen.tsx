import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'deepWork';

interface TimerConfig {
  label: string;
  duration: number;
  color: string;
  icon: string;
}

const TIMER_CONFIGS: Record<TimerMode, TimerConfig> = {
  pomodoro: { label: 'Focus', duration: 25 * 60, color: '#FF6B6B', icon: 'flame' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: '#4ECDC4', icon: 'cafe' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: '#45B7D1', icon: 'bed' },
  deepWork: { label: 'Deep Work', duration: 60 * 60, color: '#6C63FF', icon: 'school' },
};

const ADHD_PRESETS = [
  { label: '15 min', duration: 15 * 60, description: 'Quick focus' },
  { label: '20 min', duration: 20 * 60, description: 'ADHD friendly' },
  { label: '25 min', duration: 25 * 60, description: 'Standard' },
  { label: '45 min', duration: 45 * 60, description: 'Deep session' },
  { label: '60 min', duration: 60 * 60, description: 'Marathon' },
];

export default function FocusScreen() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIGS.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [customDuration, setCustomDuration] = useState<number | null>(null);
  const progress = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const config = TIMER_CONFIGS[mode];
  const duration = customDuration || config.duration;
  const progressPercent = timeLeft / duration;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: progressPercent,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (mode === 'pomodoro' || mode === 'deepWork') {
      setSessions((prev) => prev + 1);
      setTotalFocusTime((prev) => prev + duration / 60);

      Alert.alert(
        'Session Complete! 🎉',
        `Great job! You focused for ${duration / 60} minutes.`,
        [
          { text: 'Take a Break', onPress: () => switchMode('shortBreak') },
          { text: 'Keep Going', onPress: () => resetTimer() },
        ]
      );
    } else {
      Alert.alert('Break Over!', 'Ready to focus again?', [
        { text: 'Start Focus', onPress: () => switchMode('pomodoro') },
      ]);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setCustomDuration(null);
    setTimeLeft(TIMER_CONFIGS[newMode].duration);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(customDuration || config.duration);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(!isRunning);
  };

  const selectPreset = (preset: typeof ADHD_PRESETS[0]) => {
    setCustomDuration(preset.duration);
    setTimeLeft(preset.duration);
    setIsRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        {(Object.keys(TIMER_CONFIGS) as TimerMode[]).map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.modeButton, mode === m && { backgroundColor: config.color + '30' }]}
            onPress={() => switchMode(m)}
          >
            <Ionicons
              name={TIMER_CONFIGS[m].icon as any}
              size={20}
              color={mode === m ? config.color : '#8E8E93'}
            />
            <Text style={[styles.modeButtonText, mode === m && { color: config.color }]}>
              {TIMER_CONFIGS[m].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Animated.View
          style={[
            styles.timerCircle,
            {
              borderColor: config.color,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.timerInner}>
            <Ionicons name={config.icon as any} size={40} color={config.color} />
            <Text style={[styles.timerText, { color: config.color }]}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>{config.label}</Text>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: config.color,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* ADHD Presets */}
      {mode === 'pomodoro' && (
        <View style={styles.presetsContainer}>
          <Text style={styles.sectionTitle}>ADHD Presets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ADHD_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.label}
                style={[
                  styles.presetButton,
                  customDuration === preset.duration && { borderColor: config.color },
                ]}
                onPress={() => selectPreset(preset)}
              >
                <Text style={styles.presetLabel}>{preset.label}</Text>
                <Text style={styles.presetDescription}>{preset.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
          <Ionicons name="refresh" size={24} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: config.color }]}
          onPress={toggleTimer}
        >
          <Ionicons name={isRunning ? 'pause' : 'play'} size={32} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="musical-notes" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#FF6B6B" />
          <Text style={styles.statValue}>{sessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#6C63FF" />
          <Text style={styles.statValue}>{totalFocusTime}m</Text>
          <Text style={styles.statLabel}>Focus Time</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#FFD93D" />
          <Text style={styles.statValue}>{sessions * 10}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: '#FF6B6B20' }]}>
            <Ionicons name="shield-checkmark" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Distraction Blocker</Text>
            <Text style={styles.actionSubtitle}>Block notifications during focus</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: '#4ECDC420' }]}>
            <Ionicons name="people" size={24} color="#4ECDC4" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Body Doubling</Text>
            <Text style={styles.actionSubtitle}>Focus with friends</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
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
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#1C1C1E',
  },
  modeButtonText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  timerInner: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginTop: 10,
  },
  timerLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 20,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  presetsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  presetButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  presetDescription: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  quickActions: {
    marginBottom: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
});
