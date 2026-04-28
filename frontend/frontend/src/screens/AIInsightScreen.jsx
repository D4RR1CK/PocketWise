 import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView
} from 'react-native';
import api from '../services/api';

export default function AIInsightScreen({ navigation }) {
  const [insights, setInsights] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [fetched,  setFetched]  = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ai-insights');
      setInsights(res.data);
      setFetched(true);
    } catch (err) {
      console.log(err.message);
      setInsights([{ id: 1, message: 'Could not load insights. Make sure the backend is running.' }]);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Insight</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.heroBanner}>
          <Text style={styles.heroIcon}>🧠</Text>
          <Text style={styles.heroText}>Your personal AI financial advisor</Text>
          <Text style={styles.heroSub}>Analyzes your spending patterns and gives personalized recommendations</Text>
        </View>

        <TouchableOpacity style={styles.analyseBtn} onPress={fetchInsights} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.analyseBtnText}>✨ Analyse My Data</Text>
          }
        </TouchableOpacity>

        {fetched && insights.map((insight, i) => (
          <View key={insight.id ?? i} style={styles.insightCard}>
            <Text style={styles.insightBullet}>💡</Text>
            <Text style={styles.insightText}>{insight.message}</Text>
          </View>
        ))}

        {fetched && insights.length === 0 && (
          <Text style={styles.empty}>No insights yet. Add some expenses first!</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0f1e35' },
  header:          { flexDirection: 'row', alignItems: 'center', paddingTop: 56,
                     paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
  back:            { color: '#4da6ff', fontSize: 16 },
  title:           { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  body:            { padding: 16 },
  heroBanner:      { backgroundColor: '#1a1040', borderRadius: 14, padding: 24,
                     alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#3b1d8a' },
  heroIcon:        { fontSize: 40, marginBottom: 10 },
  heroText:        { color: '#c4b5fd', fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
  heroSub:         { color: '#7c6aad', fontSize: 13, textAlign: 'center', marginTop: 6 },
  analyseBtn:      { backgroundColor: '#7c3aed', borderRadius: 12, padding: 16,
                     alignItems: 'center', marginBottom: 24 },
  analyseBtnText:  { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  insightCard:     { flexDirection: 'row', backgroundColor: '#1a1040', borderRadius: 12,
                     padding: 16, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#7c3aed', gap: 10 },
  insightBullet:   { fontSize: 18 },
  insightText:     { color: '#e9d5ff', fontSize: 14, lineHeight: 22, flex: 1 },
  empty:           { color: '#8aafd4', textAlign: 'center', marginTop: 20, fontSize: 14 },
});