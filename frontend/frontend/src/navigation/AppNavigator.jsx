 import React from 'react';
 import { NavigationContainer } from '@react-navigation/native';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';

 import LoginScreen from '../screens/LoginScreen';
 import RegisterScreen from '../screens/RegisterScreen';
 import DashboardScreen from '../screens/DashboardScreen';
 import ExpenseScreen from '../screens/ExpenseScreen';
 import SavingsScreen from '../screens/SavingsScreen';
 import AIInsightScreen from '../screens/AIInsightScreen';
 import GoalsScreen from '../screens/GoalsScreen';

 const Stack = createNativeStackNavigator();

 export default function AppNavigator() {
    return(
        <NavigationContainer>
            <Stack.Navigator initailRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="Expenses" component={ExpenseScreen} />
                <Stack.Screen name="Savings" component={SavingsScreen} />
                <Stack.Screen name="AIInsight" component={AIInsightScreen} />
                <Stack.Screen name="Goals" component={GoalsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
 }