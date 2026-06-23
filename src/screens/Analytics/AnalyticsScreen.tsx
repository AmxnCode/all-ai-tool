import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type TimeRange = 'day' | 'week' | 'month';

interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  color: string;
}

const STATS: StatCard[] = [
  { title: 'Focus Time', value: '12.5h', change: '+23%', isPositive: true, icon: 'timer', color: '#6C63FF' },
  { title: 'Sessions', value: '28', change: '+15%', isPositive: true, icon: 'flame', color: '#FF6B6B' },
  { title: 'Streak', value: '7 days', change: '+2 days', isPositive: true, icon: 'trophy', color: '#FFD93D' },
  { title: 'Notes', value: '45', change: '+8', isPositive: true, icon: 'document-text', color: '#4ECDC4' },
];

const WEEKLY_DATA = [
  { day: 'Mon', focus: 3.5, notes: 8 },
  { day: 'Tue', focus: 4.2, notes: 12 },
  { day: 'Wed', focus: 2.8, notes: 6 },
  { day: 'Thu', focus: 5.1, notes: 15 },
  { day: 'Fri', focus: 3.9, notes: 9 },
  { day: 'Sat', focus: 1.5, notes: 3 },
  { day: 'Sun', focus: 2.0, notes: 4 },
];

const INSIGHTS = [
  {
    icon: 'trending-up',
    color: '#4ECDC4',
    title: 'Peak Focus Hours',
    description: 'You focus best between 10 AM - 12 PM. Consider scheduling deep work during this time.',
  },
  {
    icon: 'warning',
    color: '#FFD93D',
    title: 'Afternoon Dip',
    description: 'Your focus drops by 40% after 3 PM. Try a 15-minute break or light task.',
  },
  {
    icon: 'checkmark-circle',
    color: '#6C63FF',
    title: 'Weekly Goal',
    description: 'You\'re 85% to your weekly focus goal. 2 more hours to hit 15 hours!',
  },
  {
    icon: 'bulb',
    color: '#FF6B6B',
    title: 'Productivity Tip',
    description: 'Your best sessions are 25 minutes. Consider using the Pomodoro technique.',
  },
];

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const maxFocus = Math.max(...WEEKLY_DATA.map((d) => d.focus));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Time Range Selector */}
      <View style={styles.timeRangeSelector}>
        {(['day', 'week', 'month'] as TimeRange[]).map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange(range)}
          >
            <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {STATS.map((stat) => (
          <View key={stat.title} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
            <View style={styles.statChange}>
              <Ionicons
                name={stat.isPositive ? 'arrow-up' : 'arrow-down'}
                size={12}
                color={stat.isPositive ? '#4ECDC4' : '#FF6B6B'}
              />
              <Text
                style={[
                  styles.statChangeText,
                  { color: stat.isPositive ? '#4ECDC4' : '#FF6B6B' },
                ]}
              >
                {stat.change}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Focus Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Focus Time</Text>
          <Text style={styles.chartSubtitle}>Hours per day</Text>
        </View>
        <View style={styles.chart}>
          {WEEKLY_DATA.map((data, index) => (
            <View key={data.day} style={styles.chartBar}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (data.focus / maxFocus) * 120,
                      backgroundColor: '#6C63FF',
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{data.day}</Text>
              <Text style={styles.barValue}>{data.focus}h</Text>
            </View>
          ))}
        </View>
      </View>

      {/* AI Insights */}
      <View style={styles.insightsSection}>
        <View style={styles.insightsHeader}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={14} color="#FFD93D" />
            <Text style={styles.aiBadgeText}>Smart</Text>
          </View>
        </View>

        {INSIGHTS.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
              <Ionicons name={insight.icon as any} size={20} color={insight.color} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Focus Score */}
      <View style={styles.scoreSection}>
        <Text style={styles.sectionTitle}>Weekly Focus Score</Text>
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>85</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
          <View style={styles.scoreDetails}>
            <View style={styles.scoreDetail}>
              <Text style={styles.scoreDetailLabel}>Consistency</Text>
              <View style={styles.scoreDetailBar}>
                <View style={[styles.scoreDetailFill, { width: '90%', backgroundColor: '#4ECDC4' }]} />
              </View>
            </View>
            <View style={styles.scoreDetail}>
              <Text style={styles.scoreDetailLabel}>Duration</Text>
              <View style={styles.scoreDetailBar}>
                <View style={[styles.scoreDetailFill, { width: '75%', backgroundColor: '#6C63FF' }]} />
              </View>
            </View>
            <View style={styles.scoreDetail}>
              <Text style={styles.scoreDetailLabel}>Quality</Text>
              <View style={styles.scoreDetailBar}>
                <View style={[styles.scoreDetailFill, { width: '85%', backgroundColor: '#FFD93D' }]} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Weekly Goals</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Ionicons name="flag" size={20} color="#6C63FF" />
            <Text style={styles.goalTitle}>Focus 15 hours</Text>
            <Text style={styles.goalProgress}>12.5/15h</Text>
          </View>
          <View style={styles.goalBar}>
            <View style={[styles.goalBarFill, { width: '83%' }]} />
          </View>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Ionicons name="document-text" size={20} color="#4ECDC4" />
            <Text style={styles.goalTitle}>Create 50 notes</Text>
            <Text style={styles.goalProgress}>45/50</Text>
          </View>
          <View style={styles.goalBar}>
            <View style={[styles.goalBarFill, { width: '90%', backgroundColor: '#4ECDC4' }]} />
          </View>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Ionicons name="flame" size={20} color="#FF6B6B" />
            <Text style={styles.goalTitle}>10-day streak</Text>
            <Text style={styles.goalProgress}>7/10</Text>
          </View>
          <View style={styles.goalBar}>
            <View style={[styles.goalBarFill, { width: '70%', backgroundColor: '#FF6B6B' }]} />
          </View>
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
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  timeRangeButtonActive: {
    backgroundColor: '#6C63FF',
  },
  timeRangeText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#FFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  statTitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 24,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    color: '#6C63FF',
    fontWeight: '600',
    marginTop: 2,
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFD93D20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aiBadgeText: {
    color: '#FFD93D',
    fontSize: 11,
    fontWeight: '600',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  scoreSection: {
    marginBottom: 24,
  },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6C63FF',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  scoreDetails: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  scoreDetail: {
    marginBottom: 12,
  },
  scoreDetailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
  },
  scoreDetailBar: {
    height: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreDetailFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalsSection: {
    marginBottom: 20,
  },
  goalCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  goalTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
  goalProgress: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  goalBar: {
    height: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
});
