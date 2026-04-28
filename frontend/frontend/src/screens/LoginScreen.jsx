 import React, { useState } from 'react';
 import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
 } from 'react-native';
 import api from '../services/api';

 export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleLogin = async () => {
        if(!email || !password) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            globalThis.authToken = res.data.token;
            navigation.replace('Dashboard');
        } catch (err) {
            Alert.alert('Wrong Credentials', 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.conatiner} behavior={Platform.OS === 'io' ? 'padding' : undefined}>
            <Text style={styles.brand}>PocketWise</Text>
            <Text style={styles.tagline}>Smart budgeting for everyday life</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email"
                autoCapitilize="none"
                />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                />    

            <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Log In</Text>}    
            </TouchableOpacity>   

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Register</Text></Text>
            </TouchableOpacity> 
        </KeyboardAvoidingView>
    );
 }

 const styles = StyleSheet.create({
    conatiner: { flex: 1, backgroundColor: '#0f1e35', justifyContent: 'center', paddingHorizontal: 28},
    brand:   { fontSize: 36, fontWeight: 'bold', color:'#4da6ff', textAlign: 'center', marginBottom: 6},
    tagline:    { fontSize: 14, color: '#8aafd4', textAlign: 'center', marginBottom: 40 },
    input:      { backgroundColor: '#1a2f4a', color: '#fff', borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 14, borderWidth: 1, borderColor: '#2a4a6a' },
    btn:        { backgroundColor: '#1a6db5', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 6 },
    btnText:    { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    link:       { color: '#8aafd4', textAlign: 'center', marginTop: 20, fontSize: 14 },
    linkBold:   { color: '#4da6ff', fontWeight: 'bold' },
 });