import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator
} from 'react-native';
import api from '../services/api';

export default function DashboardScreen({ navigation }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/expenses/summary');
      setSummary(res.data);
    } catch (err) {
      console.log('Summary fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Goals',      icon: '🎯', screen: 'Goals',     color: '#1a6db5' },
    { label: 'Expenses',   icon: '💸', screen: 'Expenses',  color: '#b55c1a' },
    { label: 'Savings',    icon: '💰', screen: 'Savings',   color: '#1ab578' },
    { label: 'AI Insight', icon: '🧠', screen: 'AIInsight', color: '#7c3aed' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello 👋</Text>
        <Text style={styles.subtitle}>Here's your financial snapshot</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#4da6ff" style={{ marginTop: 30 }} />
      ) : (
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>K{summary?.total_expenses ?? '0.00'}</Text>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>K{summary?.total_savings ?? '0.00'}</Text>
            <Text style={styles.summaryLabel}>Total Savings</Text>
          </View>
        </View>
      )}

      <View style={styles.grid}>
        {cards.map((c) => (
          <TouchableOpacity
            key={c.screen}
            style={[styles.card, { borderTopColor: c.color }]}
            onPress={() => navigation.navigate(c.screen)}
          >
            <Text style={styles.cardIcon}>{c.icon}</Text>
            <Text style={styles.cardLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => {
        global.authToken = null;
        navigation.replace('Login');
      }}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0f1e35' },
  header:       { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  greeting:     { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitle:     { fontSize: 14, color: '#8aafd4', marginTop: 4 },
  summaryRow:   { flexDirection: 'row', paddingHorizontal: 24, gap: 14, marginBottom: 24 },
  summaryCard:  { flex: 1, backgroundColor: '#1a2f4a', borderRadius: 12, padding: 16, alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: 'bold', color: '#4da6ff' },
  summaryLabel: { fontSize: 12, color: '#8aafd4', marginTop: 4 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 14 },
  card:         { width: '45%', backgroundColor: '#1a2f4a', borderRadius: 12, padding: 20,
                  alignItems: 'center', borderTopWidth: 3 },
  cardIcon:     { fontSize: 30, marginBottom: 8 },
  cardLabel:    { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  logoutBtn:    { margin: 24, padding: 14, borderRadius: 10, borderWidth: 1,
                  borderColor: '#2a4a6a', alignItems: 'center' },
  logoutText:   { color: '#8aafd4', fontSize: 14 },
});