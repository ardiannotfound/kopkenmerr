import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const route = useRoute<any>();
  const { ticketId, ticketTitle } = route.params; // Ambil data tiket

  // Dummy Chat Messages
  const [messages, setMessages] = useState([
    { id: '1', text: 'Halo, ada yang bisa kami bantu terkait tiket ini?', sender: 'helpdesk', time: '08:05' },
    { id: '2', text: 'Iya pak, teknisinya kira-kira datang jam berapa?', sender: 'user', time: '08:10' },
  ]);
  
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Tambah pesan baru ke list
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user', // Anggap yang ngetik selalu user
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const renderItem = ({ item }: { item: any }) => {
    const isMe = item.sender === 'user';
    return (
      <View style={[
        styles.bubble, 
        isMe ? styles.bubbleRight : styles.bubbleLeft
      ]}>
        <Text style={[styles.msgText, isMe ? styles.textRight : styles.textLeft]}>
          {item.text}
        </Text>
        <Text style={[styles.timeText, isMe ? styles.timeRight : styles.timeLeft]}>
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90} // Sesuaikan biar gak ketutup keyboard
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Helpdesk</Text>
        <Text style={styles.headerSub}>Ref: {ticketTitle}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tulis pesan..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e5ddd5' }, // Warna ala WA
  header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  headerTitle: { fontWeight: 'bold', fontSize: 16 },
  headerSub: { fontSize: 12, color: '#666' },

  listContent: { padding: 15, paddingBottom: 20 },
  
  bubble: { maxWidth: '80%', padding: 10, borderRadius: 10, marginBottom: 10 },
  bubbleLeft: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  bubbleRight: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6' }, // Hijau muda ala WA
  
  msgText: { fontSize: 16 },
  textLeft: { color: '#000' },
  textRight: { color: '#000' },
  
  timeText: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  timeLeft: { color: '#999' },
  timeRight: { color: '#7da67d' },

  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, fontSize: 16 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
});