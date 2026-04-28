 import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import api from '../services/api';

const CATEGORIES = ['Food', 'Transport', 'Airtime', 'Bills', 'Other'];

export default function ExpenseScreen({ navigation }) {
  const [expenses,    setExpenses]    = useState([]);
  const [amount,      setAmount]      = useState('');
  const [description, setDescription] = useState('');
  const [category,    setCategory]    = useState('Food');
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(true);

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setFetching(false);
    }
  };

  const addExpense = async () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in amount and description');
      return;
    }
    setLoading(true);
    try {
      await api.post('/expenses', { amount: parseFloat(amount), description, category });
      setAmount(''); setDescription('');
      fetchExpenses();
    } catch (err) {
      Alert.alert('Error', 'Could not save expense');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    Alert.alert('Remove Expense', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/expenses/${id}`);
          fetchExpenses();
        } catch { Alert.alert('Error', 'Could not delete expense'); }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Expenses</Text>
      </View>

      <ScrollView>
        {/* Add form */}
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Amount (K)" placeholderTextColor="#888"
            value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#888"
            value={description} onChangeText={setDescription} />

          <Text style={styles.label}>Category</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c} style={[styles.catBtn, category === c && styles.catActive]}
                onPress={() => setCategory(c)}>
                <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.btn} onPress={addExpense} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Add Expense</Text>}
          </TouchableOpacity>
        </View>

        {/* List */}
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {fetching ? <ActivityIndicator color="#4da6ff" /> :
          expenses.map(e => (
            <View key={e.id} style={styles.expenseItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expDesc}>{e.description}</Text>
                <Text style={styles.expMeta}>{e.category} · {e.date}</Text>
              </View>
              <Text style={styles.expAmount}>K{e.amount}</Text>
              <TouchableOpacity onPress={() => deleteExpense(e.id)} style={styles.delBtn}>
                <Text style={styles.delText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0f1e35' },
  header:         { flexDirection: 'row', alignItems: 'center', paddingTop: 56,
                    paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
  back:           { color: '#4da6ff', fontSize: 16 },
  title:          { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  form:           { backgroundColor: '#1a2f4a', margin: 16, borderRadius: 12, padding: 16 },
  input:          { backgroundColor: '#0f1e35', color: '#fff', borderRadius: 8, padding: 12,
                    fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: '#2a4a6a' },
  label:          { color: '#8aafd4', fontSize: 13, marginBottom: 8 },
  catRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  catBtn:         { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
                    borderWidth: 1, borderColor: '#2a4a6a' },
  catActive:      { backgroundColor: '#1a6db5', borderColor: '#1a6db5' },
  catText:        { color: '#8aafd4', fontSize: 13 },
  catTextActive:  { color: '#fff' },
  btn:            { backgroundColor: '#b55c1a', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnText:        { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  sectionTitle:   { color: '#8aafd4', fontSize: 14, paddingHorizontal: 20, marginTop: 8, marginBottom: 8 },
  expenseItem:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a2f4a',
                    marginHorizontal: 16, marginBottom: 10, borderRadius: 10, padding: 14 },
  expDesc:        { color: '#fff', fontSize: 15, fontWeight: '500' },
  expMeta:        { color: '#8aafd4', fontSize: 12, marginTop: 2 },
  expAmount:      { color: '#ff7b4f', fontWeight: 'bold', fontSize: 16, marginRight: 12 },
  delBtn:         { padding: 4 },
  delText:        { color: '#ff4f4f', fontSize: 16 },
});