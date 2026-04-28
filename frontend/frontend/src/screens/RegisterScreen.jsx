 import React, { useState } from 'react';
 import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
 } from 'react-native';
 import api from '../services/api';

 export default function RegisterScreen({ navigation }) {
    const [ firstName, setFirstName] = useState('');
    const [ lastName, setLastName] = useState('');
    const [ phone, setPhone] = useState('');
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const [ loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/register', { first_name: firstName, last_name: lastName, phone, email, password });
            Alert.alert('Success', 'Account created! Please log in.', [
                { text: 'OK', onPress: () => navigation.replace('Login') }
            ]);
        } catch (err) {
            Alert.alert('Error', err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };
    return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0f1e35' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>PocketWise</Text>
        <Text style={styles.title}>Create Account</Text>

        <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#888"
          value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#888"
          value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Phone Number (optional)" placeholderTextColor="#888"
          value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888"
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888"
          value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Log In</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:  { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 },
  brand:      { fontSize: 30, fontWeight: 'bold', color: '#4da6ff', textAlign: 'center', marginBottom: 4 },
  title:      { fontSize: 18, color: '#8aafd4', textAlign: 'center', marginBottom: 30 },
  input:      { backgroundColor: '#1a2f4a', color: '#fff', borderRadius: 10, padding: 14,
                fontSize: 15, marginBottom: 14, borderWidth: 1, borderColor: '#2a4a6a' },
  btn:        { backgroundColor: '#1a6db5', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 6 },
  btnText:    { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link:       { color: '#8aafd4', textAlign: 'center', marginTop: 20, fontSize: 14 },
  linkBold:   { color: '#4da6ff', fontWeight: 'bold' },
});
