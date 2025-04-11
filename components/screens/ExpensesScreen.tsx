import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from 'react-native-paper';
import { convertFirestoreTimestampToDate, fetchUserExpenses } from '@/lib/services/firestoreService';
import { useAuth } from '@/lib/context/AuthContext';
import { UserExpense } from '@/assets/types/db';

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState<UserExpense[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    canteen: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      const userExpenses = await fetchUserExpenses(user.uid);
      if (!userExpenses) return;
      console.log('Fetched user expenses:', userExpenses[0].date);
      setExpenses(userExpenses);
    };
    fetchExpenses();
  }, [user]);

  // Calculate total expenses and expenses by canteen
  const totalExpenses = useMemo(() =>
    expenses.reduce((sum, expense) => sum + expense.amountSpent, 0), [expenses]);

  const canteenExpenses = useMemo(() => {
    const grouped = expenses.reduce((acc: { [key: string]: number }, expense) => {
      acc[expense.canteenName] = (acc[expense.canteenName] || 0) + expense.amountSpent;
      return acc;
    }, {});
    return Object.entries(grouped).map(([canteen, amount]) => ({ canteen, amount }));
  }, [expenses]);
  // const handleAddExpense = () => {
  //   if (!newExpense.name || !newExpense.amount || !newExpense.date || !newExpense.category || !newExpense.canteen) {
  //     alert('Please fill in all fields');
  //     return;
  //   }
  //   const expense = {
  //     id: (expenses.length + 1).toString(),
  //     ...newExpense,
  //     amount: parseFloat(newExpense.amount),
  //   };
  //   setExpenses([...expenses, expense]);
  //   setModalVisible(false);
  //   setNewExpense({ name: '', amount: '', date: new Date().toISOString().split('T')[0], category: '', canteen: '' });
  // };

  const renderExpense = ({ item }: { item: UserExpense }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.expenseRow}>
          <Text style={styles.expenseName}>{item.canteenName}</Text>
          <Text style={styles.expenseAmount}>Rs {item.amountSpent.toFixed(2)}</Text>
        </View>
        <View style={styles.expenseDetailsRow}>
          <Text style={styles.expenseDetails}>
            <Ionicons name="calendar-outline" size={14} />
            <Text>{convertFirestoreTimestampToDate(item.date)}</Text>
          </Text>
          <Text style={styles.expenseDetails}>
            <Ionicons name="restaurant-outline" size={14} /> {item.canteenName}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Student Expenses</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Total Expenses Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Expenses</Text>
        <Text style={styles.summaryAmount}>Rs {totalExpenses.toFixed(2)}</Text>
      </View>

      {/* Canteen Expenses Summary */}
      <View style={styles.canteenSummaryContainer}>
        <Text style={styles.canteenSummaryTitle}>Expenses by Canteen</Text>
        {canteenExpenses.map((item, index) => (
          <View key={index} style={styles.canteenExpenseRow}>
            <Text style={styles.canteenName}>{item.canteen}</Text>
            <Text style={styles.canteenAmount}>Rs {item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Expenses List */}
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.expensesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses recorded yet</Text>
          </View>
        }
      />

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
              <Ionicons name="home" size={24} color="#007AFF" />
              <Text style={[styles.navText, { color: '#007AFF' }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
              <Ionicons name="heart-outline" size={24} color="#666" />
              <Text style={styles.navText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.centerButton, styles.centerButtonGradient]}>
              <Ionicons name="grid" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
              style={styles.navItem}
              onPress={() => router.push('/user/expenses')}
          >
              <Ionicons name="cash-outline" size={24} color="#666" />
              <Text style={styles.navText}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.push('/user/profile')}
          >
              <Ionicons name="person-outline" size={24} color="#666" />
              <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
      </View> */}

      {/* Add Expense Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TextInput
              placeholder="Expense Name"
              style={styles.input}
              value={newExpense.name}
              onChangeText={(text) => setNewExpense({ ...newExpense, name: text })}
            />
            <TextInput
              placeholder="Amount"
              style={styles.input}
              keyboardType="numeric"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
            />
            <TextInput
              placeholder="Date"
              style={styles.input}
              value={newExpense.date}
              onChangeText={(text) => setNewExpense({ ...newExpense, date: text })}
            />
            <TextInput
              placeholder="Category"
              style={styles.input}
              value={newExpense.category}
              onChangeText={(text) => setNewExpense({ ...newExpense, category: text })}
            />
            <TextInput
              placeholder="Canteen"
              style={styles.input}
              value={newExpense.canteen}
              onChangeText={(text) => setNewExpense({ ...newExpense, canteen: text })}
            />
            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={() => { Alert.alert("Manav implement mat kar.. Mai dekh lunga") }} style={styles.addButton}>
                Add Expense
              </Button>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4A90E2'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  summaryContainer: {
    backgroundColor: '#4A90E2',
    padding: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  summaryAmount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  canteenSummaryContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  canteenSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  canteenExpenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  canteenName: {
    fontSize: 16,
    color: '#333',
  },
  canteenAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  expensesList: {
    padding: 16
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 10,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  expenseDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseDetails: {
    fontSize: 14,
    color: '#666',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  addButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#FFD337',
  },
  centerButton: {
    marginTop: -30,
  },
  centerButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  }
});

export default ExpensesScreen;