import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'voice' | 'meeting' | 'text';
  timestamp: Date;
  duration?: number;
  tags: string[];
}

const DEMO_NOTES: Note[] = [
  {
    id: '1',
    title: 'Product Meeting',
    content: 'Discussed Q3 roadmap. Key decisions: Launch All AI Tool by August, prioritize ADHD features, hire 2 developers.',
    type: 'meeting',
    timestamp: new Date(Date.now() - 3600000),
    duration: 1800,
    tags: ['meeting', 'product'],
  },
  {
    id: '2',
    title: 'Quick Thought',
    content: 'Add gamification to deep work sessions - streaks, achievements, leaderboards.',
    type: 'voice',
    timestamp: new Date(Date.now() - 7200000),
    duration: 30,
    tags: ['idea', 'feature'],
  },
  {
    id: '3',
    title: 'Sprint Planning',
    content: 'Week 1: Timer + Voice Notes. Week 2: Deep Work + Screenshots. Week 3: AI Features. Week 4: Polish & Launch.',
    type: 'meeting',
    timestamp: new Date(Date.now() - 86400000),
    tags: ['planning', 'sprint'],
  },
];

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedType, setSelectedType] = useState<'voice' | 'meeting' | 'text'>('voice');
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const toggleRecording = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRecording) {
      setIsRecording(false);
      // Simulate saving the recording
      const newNote: Note = {
        id: Date.now().toString(),
        title: `${selectedType === 'meeting' ? 'Meeting' : 'Voice Note'} - ${new Date().toLocaleTimeString()}`,
        content: 'Transcription will appear here after processing...',
        type: selectedType,
        timestamp: new Date(),
        duration: recordingTime,
        tags: [selectedType],
      };
      setNotes([newNote, ...notes]);
      setRecordingTime(0);
      Alert.alert('Saved!', 'Your note has been saved and is being transcribed.');
    } else {
      setIsRecording(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return 'mic';
      case 'meeting':
        return 'people';
      default:
        return 'document-text';
    }
  };

  const getNoteColor = (type: string) => {
    switch (type) {
      case 'voice':
        return '#6C63FF';
      case 'meeting':
        return '#4ECDC4';
      default:
        return '#FF6B6B';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Recording Section */}
      <View style={styles.recordingSection}>
        <Text style={styles.sectionTitle}>Quick Capture</Text>

        {/* Type Selector */}
        <View style={styles.typeSelector}>
          {(['voice', 'meeting', 'text'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && { backgroundColor: getNoteColor(type) + '30' },
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Ionicons
                name={getNoteIcon(type) as any}
                size={20}
                color={selectedType === type ? getNoteColor(type) : '#8E8E93'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === type && { color: getNoteColor(type) },
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Record Button */}
        <View style={styles.recordContainer}>
          <Animated.View style={[styles.recordPulse, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                { backgroundColor: isRecording ? '#FF3B30' : getNoteColor(selectedType) },
              ]}
              onPress={toggleRecording}
            >
              <Ionicons name={isRecording ? 'stop' : 'mic'} size={40} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>

          {isRecording && (
            <View style={styles.recordingInfo}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>{formatDuration(recordingTime)}</Text>
              <Text style={styles.recordingLabel}>Recording...</Text>
            </View>
          )}
        </View>

        {/* AI Features */}
        <View style={styles.aiFeatures}>
          <TouchableOpacity style={styles.aiFeature}>
            <Ionicons name="sparkles" size={20} color="#FFD93D" />
            <Text style={styles.aiFeatureText}>AI Summarize</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aiFeature}>
            <Ionicons name="list" size={20} color="#4ECDC4" />
            <Text style={styles.aiFeatureText}>Extract Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aiFeature}>
            <Ionicons name="pricetags" size={20} color="#6C63FF" />
            <Text style={styles.aiFeatureText}>Auto Tag</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notes List */}
      <View style={styles.notesSection}>
        <View style={styles.notesHeader}>
          <Text style={styles.sectionTitle}>Recent Notes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {notes.map((note) => (
          <TouchableOpacity key={note.id} style={styles.noteCard}>
            <View style={[styles.noteIcon, { backgroundColor: getNoteColor(note.type) + '20' }]}>
              <Ionicons name={getNoteIcon(note.type) as any} size={24} color={getNoteColor(note.type)} />
            </View>
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.notePreview} numberOfLines={2}>
                {note.content}
              </Text>
              <View style={styles.noteMeta}>
                <Text style={styles.noteTime}>
                  {note.timestamp.toLocaleDateString()} • {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {note.duration && (
                  <Text style={styles.noteDuration}>{formatDuration(note.duration)}</Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Meeting Transcription */}
      <View style={styles.transcriptionSection}>
        <Text style={styles.sectionTitle}>Live Transcription</Text>
        <View style={styles.transcriptionCard}>
          <View style={styles.transcriptionHeader}>
            <Ionicons name="radio" size={20} color="#FF3B30" />
            <Text style={styles.transcriptionTitle}>AI Meeting Mode</Text>
          </View>
          <Text style={styles.transcriptionPreview}>
            Start recording during meetings to get real-time transcription, action items, and summaries.
          </Text>
          <TouchableOpacity style={styles.transcriptionButton}>
            <Text style={styles.transcriptionButtonText}>Enable for Next Meeting</Text>
          </TouchableOpacity>
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  recordingSection: {
    marginBottom: 30,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    gap: 8,
  },
  typeButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  recordContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordPulse: {
    marginBottom: 16,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  recordingTime: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  recordingLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  aiFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiFeature: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    gap: 8,
  },
  aiFeatureText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  notesSection: {
    marginBottom: 30,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '500',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  noteIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteContent: {
    flex: 1,
    marginLeft: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  notePreview: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  noteTime: {
    fontSize: 12,
    color: '#636366',
  },
  noteDuration: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '500',
  },
  transcriptionSection: {
    marginBottom: 20,
  },
  transcriptionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  transcriptionPreview: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  transcriptionButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  transcriptionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
