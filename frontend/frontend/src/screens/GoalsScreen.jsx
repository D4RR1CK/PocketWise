 import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import api from '../services/api';

export default function GoalsScreen({ navigation }) {
  const [goals,       setGoals]       = useState([]);
  const [description, setDescription] = useState('');
  const [target,      setTarget]      = useState('');
  const [deadline,    setDeadline]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(true);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setFetching(false);
    }
  };

  const addGoal = async () => {
    if (!description || !target) {
      Alert.alert('Error', 'Please fill in description and target amount');
      return;
    }
    setLoading(true);
    try {
      await api.post('/goals', { description, budget_amount: parseFloat(target), deadline });
      setDescription(''); setTarget(''); setDeadline('');
      fetchGoals();
    } catch {
      Alert.alert('Error', 'Could not save goal');
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
        <Text style={styles.title}>Goals</Text>
      </View>

      <ScrollView>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Goal description" placeholderTextColor="#888"
            value={description} onChangeText={setDescription} />
          <TextInput style={styles.input} placeholder="Target amount (K)" placeholderTextColor="#888"
            value={target} onChangeText={setTarget} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Deadline (YYYY-MM-DD)" placeholderTextColor="#888"
            value={deadline} onChangeText={setDeadline} />

          <TouchableOpacity style={styles.btn} onPress={addGoal} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Set Goal</Text>}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>My Goals</Text>
        {fetching ? <ActivityIndicator color="#4da6ff" /> :
          goals.length === 0
          ? <Text style={styles.empty}>No goals set yet. Add one above!</Text>
          : goals.map(g => (
            <View key={g.id} style={styles.goalItem}>
              <Text style={styles.goalDesc}>{g.description}</Text>
              <View style={styles.goalMeta}>
                <Text style={styles.goalAmount}>🎯 K{g.budget_amount}</Text>
                {g.deadline ? <Text style={styles.goalDeadline}>📅 {g.deadline}</Text> : null}
              </View>
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0f1e35' },
  header:       { flexDirection: 'row', alignItems: 'center', paddingTop: 56,
                  paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
  back:         { color: '#4da6ff', fontSize: 16 },
  title:        { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  form:         { backgroundColor: '#1a2f4a', margin: 16, borderRadius: 12, padding: 16 },
  input:        { backgroundColor: '#0f1e35', color: '#fff', borderRadius: 8, padding: 12,
                  fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: '#2a4a6a' },
  btn:          { backgroundColor: '#1a6db5', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnText:      { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  sectionTitle: { color: '#8aafd4', fontSize: 14, paddingHorizontal: 20, marginBottom: 8 },
  empty:        { color: '#8aafd4', textAlign: 'center', marginTop: 30, fontSize: 14 },
  goalItem:     { backgroundColor: '#1a2f4a', marginHorizontal: 16, marginBottom: 10,
                  borderRadius: 10, padding: 16, borderLeftWidth: 3, borderLeftColor: '#1a6db5' },
  goalDesc:     { color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 8 },
  goalMeta:     { flexDirection: 'row', gap: 16 },
  goalAmount:   { color: '#4da6ff', fontSize: 13 },
  goalDeadline: { color: '#8aafd4', fontSize: 13 },
});