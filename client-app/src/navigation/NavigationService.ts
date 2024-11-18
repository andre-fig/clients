import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { Client } from '../screens/SelectedClientsScreen';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: 'Login' | 'Clients' | 'NotFound'): void;
export function navigate(
  name: 'SelectedClients',
  params: { selectedClients: string[]; clients: Client[] },
): void;
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params as any);
  }
}
