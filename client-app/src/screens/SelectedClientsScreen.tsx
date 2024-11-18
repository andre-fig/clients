import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RootStackParamList } from '../../App';
import { useSelectedClients } from '../contexts/SelectedClientsContext';

export interface Client {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
}

type SelectedClientsScreenRouteProp = RouteProp<
  RootStackParamList,
  'SelectedClients'
>;

interface Props {
  route: SelectedClientsScreenRouteProp;
}

export const SelectedClientsScreen: React.FC<Props> = ({ route }) => {
  const { clients } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { selectedClients, setSelectedClients } = useSelectedClients();

  useEffect(() => {
    if (selectedClients.length === 0) {
      navigation.navigate('Clients');
    }
  }, [selectedClients, navigation]);

  const handleDeselect = (id: string) => {
    setSelectedClients((prev) => prev.filter((clientId) => clientId !== id));
  };

  const handleClearAll = () => {
    setSelectedClients([]);
  };

  const filteredClients = clients.filter((client) =>
    selectedClients.includes(client.id),
  );

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Clientes selecionados:</Text>
      {filteredClients.length === 0 ? (
        <Text>Nenhum cliente selecionado.</Text>
      ) : (
        filteredClients.map((client) => (
          <View key={client.id} style={styles.card}>
            <Text style={styles.clientName}>{String(client.name)}</Text>
            <Text>Salário: {formatCurrency(client.salary)}</Text>
            <Text>Empresa: {formatCurrency(client.companyValue)}</Text>
            <View style={styles.selectedCardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeselect(client.id)}
              >
                <Image
                  source={require('../../assets/unselect-icon.png')}
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity style={styles.createButton} onPress={handleClearAll}>
        <Text style={styles.createButtonText}>
          Limpar clientes selecionados
        </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  selectedCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  actionButton: {
    padding: 5,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
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
});
