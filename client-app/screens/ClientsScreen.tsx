import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

export const ClientsScreen = () => {
  const [clients, setClients] = useState([
    { id: '1', name: 'João', salary: 3000, companyValue: 50000 },
    { id: '2', name: 'Maria', salary: 4000, companyValue: 70000 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    salary: '',
    companyValue: '',
  });

  const handleSelect = (id: string) => alert(`Selecionar cliente ${id}`);
  const handleEdit = (id: string) => alert(`Editar cliente ${id}`);
  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      `Excluir cliente:`,
      `Tem certeza que deseja excluir o cliente ${name}?`,
      [
        {
          text: 'Excluir cliente',
          onPress: () => {
            setClients((prevClients) =>
              prevClients.filter((client) => client.id !== id),
            );
            alert(`Cliente ${name} excluído com sucesso.`);
          },
          style: 'destructive',
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
    );
  };

  const handleCreate = () => setModalVisible(true);

  const handleCreateClient = () => {
    if (!newClient.name || !newClient.salary || !newClient.companyValue) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    setClients((prevClients) => [
      ...prevClients,
      {
        id: Math.random().toString(),
        name: newClient.name,
        salary: parseFloat(newClient.salary),
        companyValue: parseFloat(newClient.companyValue),
      },
    ]);
    setNewClient({ name: '', salary: '', companyValue: '' });
    setModalVisible(false);
    Alert.alert('Sucesso', 'Cliente criado com sucesso!');
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>
        <Text style={styles.boldText}>{clients.length}</Text> clientes
        encontrados:
      </Text>
      <Text>Clientes por página:</Text>
      {clients.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.textDetail}>
            Salário: {formatCurrency(item.salary)}
          </Text>
          <Text style={styles.textDetail}>
            Empresa: {formatCurrency(item.companyValue)}
          </Text>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSelect(item.id)}
            >
              <Image
                source={require('../assets/plus-icon.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(item.id)}
            >
              <Image
                source={require('../assets/pencil-icon.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(item.id, item.name)}
            >
              <Image
                source={require('../assets/trash-icon.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Criar cliente</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Criar Cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome:"
            value={newClient.name}
            onChangeText={(text) => setNewClient({ ...newClient, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Salário:"
            keyboardType="numeric"
            value={newClient.salary}
            onChangeText={(text) =>
              setNewClient({ ...newClient, salary: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Valor da empresa:"
            keyboardType="numeric"
            value={newClient.companyValue}
            onChangeText={(text) =>
              setNewClient({ ...newClient, companyValue: text })
            }
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateClient}
          >
            <Text style={styles.createButtonText}>Criar cliente</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  card: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    gap: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  clientName: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    color: '#000',
  },
  textDetail: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    color: '#000',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    padding: 5,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  createButton: {
    paddingHorizontal: 15,
    backgroundColor: '#ffffff00',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: 2,
    borderColor: '#EC6724',
    width: '100%',
  },
  createButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: 'center',
    color: '#EC6724',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
