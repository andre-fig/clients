import React, { createContext, useContext, useState } from 'react';

interface SelectedClientsContextProps {
  selectedClients: string[];
  setSelectedClients: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectedClientsContext =
  createContext<SelectedClientsContextProps | null>(null);

export const SelectedClientsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  return (
    <SelectedClientsContext.Provider
      value={{ selectedClients, setSelectedClients }}
    >
      {children}
    </SelectedClientsContext.Provider>
  );
};

export const useSelectedClients = () => {
  const context = useContext(SelectedClientsContext);
  if (!context) {
    throw new Error(
      'useSelectedClients must be used within a SelectedClientsProvider',
    );
  }
  return context;
};
