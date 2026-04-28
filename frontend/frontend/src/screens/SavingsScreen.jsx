 import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import api from '../services/api';

export default function SavingsScreen({ navigation }) {
  const [savings,  setSavings]  = useState([]);
  const [amount,   setAmount]   = useState('');
  const [method,   setMethod]   = useState('Manual');
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [total,    setTotal]    = useState(0);

  const METHODS = ['Manual', 'MoMo'];

  useEffect(() => { fetchSavings(); }, []);

  const fetchSavings = async () => {
    try {
      const res = await api.get('/savings');
      setSavings(res.data);
      const sum = res.data.reduce((acc, s) => acc + parseFloat(s.amount), 0);
      setTotal(sum.toFixed(2));
    } catch (err) {
      console.log(err.message);
    } finally {
      setFetching(false);
    }
  };

  const saveMoney = async () => {
    if (!amount) { Alert.alert('Error', 'Enter an amount to save'); return; }
    Alert.alert('Confirm Save', `Save K${amount} via ${method}?`, [
      { text: 'Cancel' },
      { text: 'Confirm', onPress: async () => {
        setLoading(true);
        try {
          await api.post('/savings', { amount: parseFloat(amount), method });
          setAmount('');
          fetchSavings();
          Alert.alert('Saved!', `K${amount} added to your savings.`);
        } catch {
          Alert.alert('Error', 'Could not save');
        } finally {
          setLoading(false);
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Savings</Text>
      </View>

      <ScrollView>
        {/* Total banner */}
        <View style={styles.totalBanner}>
          <Text style={styles.totalLabel}>Total Saved</Text>
          <Text style={styles.totalValue}>K{total}</Text>
          <Text style={styles.suggestion}>💡 Save K5 today — every kwacha counts!</Text>
        </View>

        {/* Save form */}
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Amount to Save (K)"
            placeholderTextColor="#888" value={amount} onChangeText={setAmount}
            keyboardType="numeric" />

          <Text style={styles.label}>Method</Text>
          <View style={styles.methodRow}>
            {METHODS.map(m => (
              <TouchableOpacity key={m} style={[styles.methodBtn, method === m && styles.methodActive]}
                onPress={() => setMethod(m)}>
                <Text style={[styles.methodText, method === m && styles.methodTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.btn} onPress={saveMoney} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Money</Text>}
          </TouchableOpacity>
        </View>

        {/* Savings history */}
        <Text style={styles.sectionTitle}>Savings History</Text>
        {fetching ? <ActivityIndicator color="#4da6ff" /> :
          savings.map(s => (
            <View key={s.id} style={styles.item}>
              <View>
                <Text style={styles.itemMethod}>{s.method}</Text>
                <Text style={styles.itemDate}>{s.date}</Text>
              </View>
              <Text style={styles.itemAmount}>+K{s.amount}</Text>
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#0f1e35' },
  header:           { flexDirection: 'row', alignItems: 'center', paddingTop: 56,
                      paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
  back:             { color: '#4da6ff', fontSize: 16 },
  title:            { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  totalBanner:      { backgroundColor: '#0d3320', margin: 16, borderRadius: 14, padding: 20, alignItems: 'center' },
  totalLabel:       { color: '#4dbb8a', fontSize: 13 },
  totalValue:       { color: '#1ab578', fontSize: 38, fontWeight: 'bold', marginVertical: 6 },
  suggestion:       { color: '#6ee7b7', fontSize: 13, marginTop: 6, textAlign: 'center' },
  form:             { backgroundColor: '#1a2f4a', marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 8 },
  input:            { backgroundColor: '#0f1e35', color: '#fff', borderRadius: 8, padding: 12,
                      fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: '#2a4a6a' },
  label:            { color: '#8aafd4', fontSize: 13, marginBottom: 8 },
  methodRow:        { flexDirection: 'row', gap: 10, marginBottom: 14 },
  methodBtn:        { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20,
                      borderWidth: 1, borderColor: '#2a4a6a' },
  methodActive:     { backgroundColor: '#1ab578', borderColor: '#1ab578' },
  methodText:       { color: '#8aafd4', fontSize: 14 },
  methodTextActive: { color: '#fff', fontWeight: 'bold' },
  btn:              { backgroundColor: '#1ab578', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnText:          { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  sectionTitle:     { color: '#8aafd4', fontSize: 14, paddingHorizontal: 20, marginBottom: 8 },
  item:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: '#1a2f4a', marginHorizontal: 16, marginBottom: 10,
                      borderRadius: 10, padding: 14 },
  itemMethod:       { color: '#fff', fontSize: 15, fontWeight: '500' },
  itemDate:         { color: '#8aafd4', fontSize: 12, marginTop: 2 },
  itemAmount:       { color: '#1ab578', fontWeight: 'bold', fontSize: 16 },
});