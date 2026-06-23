import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 60) / 3;

interface Screenshot {
  id: string;
  uri: string;
  tags: string[];
  project: string;
  timestamp: Date;
  aiDescription?: string;
}

interface Project {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

const DEMO_PROJECTS: Project[] = [
  { id: '1', name: 'All AI Tool', icon: 'phone-portrait', color: '#6C63FF', count: 24 },
  { id: '2', name: 'Design Ideas', icon: 'color-palette', color: '#FF6B6B', count: 18 },
  { id: '3', name: 'Work', icon: 'briefcase', color: '#4ECDC4', count: 31 },
  { id: '4', name: 'Personal', icon: 'heart', color: '#FFD93D', count: 12 },
];

const DEMO_SCREENSHOTS: Screenshot[] = [
  {
    id: '1',
    uri: 'https://picsum.photos/200',
    tags: ['design', 'ui', 'dark-mode'],
    project: 'All AI Tool',
    timestamp: new Date(Date.now() - 3600000),
    aiDescription: 'Mobile app UI with dark theme and purple accents',
  },
  {
    id: '2',
    uri: 'https://picsum.photos/201',
    tags: ['competitor', 'timer'],
    project: 'All AI Tool',
    timestamp: new Date(Date.now() - 7200000),
    aiDescription: 'Competitor pomodoro app screenshot',
  },
  {
    id: '3',
    uri: 'https://picsum.photos/202',
    tags: ['inspiration', 'gradient'],
    project: 'Design Ideas',
    timestamp: new Date(Date.now() - 86400000),
    aiDescription: 'Color gradient inspiration for backgrounds',
  },
  {
    id: '4',
    uri: 'https://picsum.photos/203',
    tags: ['code', 'react'],
    project: 'Work',
    timestamp: new Date(Date.now() - 172800000),
    aiDescription: 'React Native code snippet',
  },
  {
    id: '5',
    uri: 'https://picsum.photos/204',
    tags: ['meeting', 'notes'],
    project: 'Work',
    timestamp: new Date(Date.now() - 259200000),
    aiDescription: 'Meeting notes from product sync',
  },
  {
    id: '6',
    uri: 'https://picsum.photos/205',
    tags: ['recipe', 'cooking'],
    project: 'Personal',
    timestamp: new Date(Date.now() - 345600000),
    aiDescription: 'Pasta recipe from food blog',
  },
];

const AI_TAGS = ['All', 'Design', 'Code', 'Meeting', 'Idea', 'Reference'];

export default function OrganizeScreen() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredScreenshots = DEMO_SCREENSHOTS.filter((s) => {
    if (selectedProject && s.project !== selectedProject) return false;
    if (selectedTag !== 'All' && !s.tags.includes(selectedTag.toLowerCase())) return false;
    return true;
  });

  const renderScreenshot = ({ item }: { item: Screenshot }) => (
    <TouchableOpacity style={styles.screenshotItem}>
      <View style={[styles.screenshotPlaceholder, { backgroundColor: '#2C2C2E' }]}>
        <Ionicons name="image" size={32} color="#636366" />
      </View>
      <View style={styles.screenshotInfo}>
        <Text style={styles.screenshotProject}>{item.project}</Text>
        {item.aiDescription && (
          <Text style={styles.screenshotDesc} numberOfLines={1}>
            {item.aiDescription}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="camera" size={20} color="#FFF" />
          <Text style={styles.actionText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="scan" size={20} color="#FFF" />
          <Text style={styles.actionText}>OCR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="sparkles" size={20} color="#FFF" />
          <Text style={styles.actionText}>AI Tag All</Text>
        </TouchableOpacity>
      </View>

      {/* Projects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DEMO_PROJECTS.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={[
                styles.projectCard,
                selectedProject === project.id && { borderColor: project.color },
              ]}
              onPress={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            >
              <View style={[styles.projectIcon, { backgroundColor: project.color + '20' }]}>
                <Ionicons name={project.icon as any} size={24} color={project.color} />
              </View>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectCount}>{project.count} items</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* AI Tags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {AI_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.tagChip, selectedTag === tag && styles.tagChipActive]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text style={[styles.tagText, selectedTag === tag && styles.tagTextActive]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <Text style={styles.sectionTitle}>Screenshots</Text>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'grid' && styles.toggleButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons name="grid" size={20} color={viewMode === 'grid' ? '#6C63FF' : '#8E8E93'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? '#6C63FF' : '#8E8E93'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Screenshots Grid */}
      {viewMode === 'grid' ? (
        <View style={styles.screenshotsGrid}>
          {filteredScreenshots.map((screenshot) => (
            <TouchableOpacity key={screenshot.id} style={styles.screenshotGridItem}>
              <View style={[styles.screenshotGridPlaceholder, { backgroundColor: '#2C2C2E' }]}>
                <Ionicons name="image" size={24} color="#636366" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.screenshotsList}>
          {filteredScreenshots.map((screenshot) => (
            <TouchableOpacity key={screenshot.id} style={styles.screenshotListItem}>
              <View style={[styles.screenshotListPlaceholder, { backgroundColor: '#2C2C2E' }]}>
                <Ionicons name="image" size={24} color="#636366" />
              </View>
              <View style={styles.screenshotListInfo}>
                <Text style={styles.screenshotListProject}>{screenshot.project}</Text>
                {screenshot.aiDescription && (
                  <Text style={styles.screenshotListDesc} numberOfLines={2}>
                    {screenshot.aiDescription}
                  </Text>
                )}
                <View style={styles.screenshotListTags}>
                  {screenshot.tags.slice(0, 3).map((tag) => (
                    <View key={tag} style={styles.miniTag}>
                      <Text style={styles.miniTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* AI Insights */}
      <View style={styles.aiInsights}>
        <Text style={styles.sectionTitle}>AI Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="bulb" size={20} color="#FFD93D" />
            <Text style={styles.insightTitle}>Smart Suggestions</Text>
          </View>
          <Text style={styles.insightText}>
            You have 5 screenshots about "All AI Tool" that could be organized into a mood board.
          </Text>
          <TouchableOpacity style={styles.insightAction}>
            <Text style={styles.insightActionText}>Create Mood Board</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="search" size={20} color="#6C63FF" />
            <Text style={styles.insightTitle}>Similar Items</Text>
          </View>
          <Text style={styles.insightText}>
            Found 3 screenshots with similar color schemes across different projects.
          </Text>
          <TouchableOpacity style={styles.insightAction}>
            <Text style={styles.insightActionText}>View Collection</Text>
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    gap: 8,
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  seeAll: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '500',
  },
  projectCard: {
    width: 140,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  projectIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  projectCount: {
    fontSize: 12,
    color: '#8E8E93',
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    marginRight: 8,
  },
  tagChipActive: {
    backgroundColor: '#6C63FF',
  },
  tagText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  tagTextActive: {
    color: '#FFF',
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  toggleButtonActive: {
    backgroundColor: '#2C2C2E',
  },
  screenshotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  screenshotGridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  screenshotGridPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenshotsList: {
    marginBottom: 24,
  },
  screenshotListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  screenshotListPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenshotListInfo: {
    flex: 1,
    marginLeft: 12,
  },
  screenshotListProject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  screenshotListDesc: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  screenshotListTags: {
    flexDirection: 'row',
    gap: 6,
  },
  miniTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#2C2C2E',
  },
  miniTagText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  aiInsights: {
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  insightText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 12,
  },
  insightAction: {
    alignSelf: 'flex-start',
  },
  insightActionText: {
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '600',
  },
  screenshotItem: {
    marginBottom: 16,
  },
  screenshotPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenshotInfo: {
    marginTop: 8,
  },
  screenshotProject: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '500',
  },
  screenshotDesc: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
});
