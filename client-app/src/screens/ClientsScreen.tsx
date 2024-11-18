import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useSelectedClients } from '../contexts/SelectedClientsContext';

interface Client {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Clients'>;

export const ClientsScreen = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    salary: '',
    companyValue: '',
  });

  const { selectedClients, setSelectedClients } = useSelectedClients(); 
  const navigation = useNavigation<NavigationProps>();

  const handleNavigateToSelected = () => {
    const filteredClients = clients.filter((client) =>
      selectedClients.includes(client.id)
    );
  
    navigation.navigate('SelectedClients', {
      selectedClients,
      clients: filteredClients,
    });
  };

  const fetchClients = async () => {
    try {
      setLoading(true); 
      const response = await api.get('/client');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((clientId) => clientId !== id) : [...prev, id]
    );
  };

  const handleEdit = (id: string) => alert(`Editar cliente ${id}`);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      `Excluir cliente:`,
      `Tem certeza que deseja excluir o cliente ${name}?`,
      [
        {
          text: 'Excluir cliente',
          onPress: async () => {
            try {
              await api.delete(`/client/${id}`); 
              setClients((prevClients) =>
                prevClients.filter((client) => client.id !== id)
              );
              Alert.alert('Sucesso', `Cliente ${name} excluído com sucesso.`);
            } catch (error) {
              console.error('Erro ao excluir cliente:', error);
              Alert.alert('Erro', 'Não foi possível excluir o cliente.');
            }
          },
          style: 'destructive',
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const parseCurrencyToNumber = (value: string): number => {
    return parseFloat(value.replace(/[^0-9,-]+/g, '').replace(',', '.'));
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.salary || !newClient.companyValue) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      const salary = parseCurrencyToNumber(newClient.salary);
      const companyValue = parseCurrencyToNumber(newClient.companyValue);
  
      await api.post('/client', {
        name: newClient.name,
        salary,
        companyValue,
      });
  
      await fetchClients();
  
      setNewClient({ name: '', salary: '', companyValue: '' });
      setModalVisible(false);
  
      Alert.alert('Sucesso', 'Cliente criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      Alert.alert('Erro', 'Não foi possível criar o cliente.');
    }
  };
  

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const formattedValue = (Number(numericValue) / 100).toFixed(2);
    return formattedValue
      .replace('.', ',')
      .replace(/\d(?=(\d{3})+,)/g, '$&.')
      .replace(/^/, 'R$ ');
  };

  const handleSalaryChange = (text: string) => {
    setNewClient({ ...newClient, salary: handleCurrencyInput(text) });
  };

  const handleCompanyValueChange = (text: string) => {
    setNewClient({ ...newClient, companyValue: handleCurrencyInput(text) });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    );
  }

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
          <View
            style={styles.cardActions}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSelect(item.id)}
            >
              <Image
                source={
                  selectedClients.includes(item.id)
                    ? require('../../assets/unselect-icon.png')
                    : require('../../assets/plus-icon.png')
                }
                style={styles.actionIcon}
              />
            </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(item.id)}
                >
                  <Image
                    source={require('../../assets/pencil-icon.png')}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <Image
                    source={require('../../assets/trash-icon.png')}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.createButton}
        onPress={
      () => setModalVisible(true)
        }
      >
        <Text style={styles.createButtonText}>
          Criar cliente
        </Text>
      </TouchableOpacity>

      {selectedClients.length > 0 && (
        <TouchableOpacity
          style={styles.selectedButton}
          onPress={handleNavigateToSelected}
        >
          <Text style={styles.selectedButtonText}>
            Ver clientes selecionados
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.75}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.dragIndicator} />
          <Text style={styles.modalTitle}>Criar Cliente</Text>
          <Text style={styles.modalLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome:"
            placeholderTextColor="#dbdbdb"
            value={newClient.name}
            onChangeText={(text) => setNewClient({ ...newClient, name: text })}
          />
          <Text style={styles.modalLabel}>Salário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o salário:"
            placeholderTextColor="#dbdbdb"
            keyboardType="numeric"
            value={newClient.salary}
            onChangeText={handleSalaryChange}
          />
          <Text style={styles.modalLabel}>Valor da empresa</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o valor da empresa:"
            placeholderTextColor="#dbdbdb"
            keyboardType="numeric"
            value={newClient.companyValue}
            onChangeText={handleCompanyValueChange}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleCreateClient}
          >
            <Text style={styles.modalButtonText}>Criar cliente</Text>
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
    width: '100%',
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
  selectedCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
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
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 30,
  },
  modalContent: {
    backgroundColor: '#7A7A7A',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    padding: 40,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffffff',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 25,
  },
  modalButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#EB6625',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  selectedButton: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#EC6724',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  selectedButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
