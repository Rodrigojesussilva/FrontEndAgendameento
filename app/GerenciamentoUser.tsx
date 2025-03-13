import * as React from 'react';
import { Provider as PaperProvider, DataTable, TextInput, Modal, Portal, IconButton, Button, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View, Image, ScrollView } from 'react-native'; // Importando o Image
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000'; // Use o IP da sua máquina

const GerenciamentoUser = () => {
  const [visible, setVisible] = React.useState({
    addUser: false,
    editUser: false,
    deleteUser: false,
  });

  const [currentUser, setCurrentUser] = React.useState<{ id?: string; nome: string; senha: string; tipoUsuario: number; email: string } | null>(null);
  const [users, setUsers] = React.useState<{ id?: string; nome: string; senha: string; tipoUsuario: number; email: string }[]>([]);
  const [newUser, setNewUser] = React.useState<{ nome: string; senha: string; tipoUsuario: number; email: string }>({ nome: '', senha: '', tipoUsuario: 0, email: '' });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', (error as Error).message);
    }
  };

  const addUser = async () => {
    try {
      await axios.post(`${API_URL}/usuario/inserir`, newUser);
      setNewUser({ nome: '', senha: '', tipoUsuario: 0, email: '' });
      hideModal('addUser');
      fetchUsers();
    } catch (error) {
      console.error('Erro ao adicionar usuário:', (error as Error).message);
    }
  };

  const updateUser = async () => {
    if (currentUser?.id) {
      try {
        await axios.put(`${API_URL}/usuarios/atualizar/${currentUser.id}`, currentUser);
        setCurrentUser(null);
        hideModal('editUser');
        fetchUsers();
      } catch (error) {
        console.error('Erro ao atualizar usuário:', (error as Error).message);
      }
    }
  };

  const deleteUser = async () => {
    if (currentUser?.id) {
      try {
        await axios.delete(`${API_URL}/usuario/deletar/${currentUser.id}`);
        setCurrentUser(null);
        hideModal('deleteUser');
        fetchUsers();
      } catch (error) {
        console.error('Erro ao deletar usuário:', (error as Error).message);
      }
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const showModal = (type: 'addUser' | 'editUser' | 'deleteUser') => {
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addUser' | 'editUser' | 'deleteUser') => {
    setVisible({ ...visible, [type]: false });
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Adicionando a imagem acima do botão */}
        <Image 
          source={require('../assets/images/Elysium.png')} 
          style={styles.image} 
        />        
        <Button
          icon="plus"
          mode="contained"
          onPress={() => showModal('addUser')}
          textColor="white" // Cor branca para o texto
          buttonColor="green" // Cor verde para o fundo do botão
          contentStyle={{ flexDirection: 'row', alignItems: 'center' }} // Alinha ícone e texto horizontalmente
          labelStyle={{ marginLeft: 12 }} // Aumenta o espaçamento entre o ícone e o texto
        >
          Adicionar Usuário
        </Button>
          <ScrollView horizontal style={styles.scrollContainer}>
            <ScrollView style={styles.verticalScroll}>
            <DataTable>
                    <DataTable.Header>
                      <DataTable.Title style={styles.columnHeader}>
                        <Text style={styles.columnHeaderText}>Nome</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnHeader}>
                        <Text style={styles.columnHeaderText}>Email</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnHeader}>
                        <Text style={styles.columnHeaderText}>Senha</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnHeader}>
                        <Text style={styles.columnHeaderText}>Tipo Usuário</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnHeader}>
                        <Text style={styles.columnHeaderText}>Ações</Text>
                      </DataTable.Title>
                    </DataTable.Header>

                    {users.length > 0 ? (
                      users.map(user => (
                        <DataTable.Row key={user.id}>
                          <DataTable.Cell style={styles.columnCell}><Text>{user.nome}</Text></DataTable.Cell>
                          <DataTable.Cell style={styles.columnCell}><Text>{user.email}</Text></DataTable.Cell>
                          <DataTable.Cell style={styles.columnCell}><Text>{user.senha}</Text></DataTable.Cell>
                          <DataTable.Cell style={styles.columnCell}><Text>{user.tipoUsuario}</Text></DataTable.Cell>
                          <DataTable.Cell style={styles.columnCell}>
                            <IconButton
                              icon="pencil"
                              size={20}
                              onPress={() => {
                                setCurrentUser(user);
                                showModal('editUser');
                              }}
                              iconColor="blue" // Define a cor azul para o ícone de editar
                            />
                            <IconButton
                              icon="delete"
                              size={20}
                              onPress={() => {
                                setCurrentUser(user);
                                showModal('deleteUser');
                              }}
                              iconColor="red" // Define a cor vermelha para o ícone de excluir
                            />
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))
                    ) : (
                      <DataTable.Row>
                        <DataTable.Cell><Text>Nenhum usuário encontrado</Text></DataTable.Cell>
                      </DataTable.Row>
                    )}
                  </DataTable>
            </ScrollView>
          </ScrollView>   

        {/* Modais */}

        <Portal>
          <Modal visible={visible.addUser} onDismiss={() => hideModal('addUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              {/* Cabeçalho */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Usuário</Text>
              </View>

              {/* Corpo */}
              <View style={styles.gridContainer}>
                <TextInput
                  label="Nome"
                  mode="outlined"
                  value={newUser.nome}
                  onChangeText={text => setNewUser(prev => ({ ...prev, nome: text }))}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={newUser.email}
                  onChangeText={text => setNewUser(prev => ({ ...prev, email: text }))}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Senha"
                  mode="outlined"
                  secureTextEntry
                  value={newUser.senha}
                  onChangeText={text => setNewUser(prev => ({ ...prev, senha: text }))}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Tipo Usuário"
                  mode="outlined"
                  keyboardType="numeric"
                  value={String(newUser.tipoUsuario)}
                  onChangeText={text => setNewUser(prev => ({ ...prev, tipoUsuario: parseInt(text) || 0 }))}
                  style={styles.gridItem}
                />
                
              </View>

              {/* Rodapé */}
              <View style={styles.modalFooter}>
                <Button mode="contained" onPress={addUser}>Adicionar</Button>
              </View>
            </View>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.editUser} onDismiss={() => hideModal('editUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              {/* Cabeçalho */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Usuário</Text>
              </View>

              {/* Corpo */}
              <View style={styles.gridContainer}>
                <TextInput
                  label="Nome"
                  mode="outlined"
                  value={currentUser?.nome || ''}
                  onChangeText={text => setCurrentUser(prev => prev ? { ...prev, nome: text } : null)}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={currentUser?.email || ''}
                  onChangeText={text => setCurrentUser(prev => prev ? { ...prev, email: text } : null)}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Senha"
                  mode="outlined"
                  secureTextEntry
                  value={currentUser?.senha || ''}
                  onChangeText={text => setCurrentUser(prev => prev ? { ...prev, senha: text } : null)}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Tipo Usuário"
                  mode="outlined"
                  keyboardType="numeric"
                  value={currentUser?.tipoUsuario !== undefined ? String(currentUser.tipoUsuario) : ''}                  onChangeText={text => setCurrentUser(prev => prev ? { ...prev, tipoUsuario: parseInt(text) } : null)}
                  style={styles.gridItem}
                />
              </View>

              {/* Rodapé */}
              <View style={styles.modalFooter}>
                <Button mode="contained" onPress={updateUser}>Salvar</Button>
              </View>
            </View>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.deleteUser} onDismiss={() => hideModal('deleteUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              {/* Cabeçalho */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Excluir Usuário</Text>
              </View>

              {/* Corpo */}
              <Text style={styles.modalText}>
                Deseja realmente excluir o usuário <Text style={styles.bold}>{currentUser?.nome}</Text>?
              </Text>

              {/* Rodapé */}
              <View style={styles.modalFooter}>
                <Button mode="contained" onPress={deleteUser} style={styles.deleteButton}>Deletar</Button>
              </View>
            </View>
          </Modal>
        </Portal>

        
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D2B48C', // Cor marrom claro
  },
  
  image: {
    width: 100, // Define a largura da imagem
    height: 100, // Define a altura da imagem, igual à largura
    resizeMode: 'cover', // Ajusta a imagem para cobrir o container
    marginBottom: 20, // Espaçamento entre a imagem e o botão
    borderRadius: 50, // Aplica bordas arredondadas (50% de 100px)
    alignSelf: 'center', // Centraliza a imagem horizontalmente
  },
  dataTable: {
    minWidth: 600,
  },
  // ... outros estilos
  verticalScroll: {
    maxHeight: 400, // Ajuste o valor conforme necessário para o tamanho da sua tela
  },
  scrollContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
   modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
    alignSelf: 'center',
  },
  modalHeader: {
    backgroundColor: '#D2B48C', // Marrom claro
    alignItems: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Cor do texto no cabeçalho
  },
  modalContent: {
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  gridItem: {
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
  modalFooter: {
    backgroundColor: '#D2B48C', // Marrom claro
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',  // Cor vermelha para o botão de deletar
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  columnHeader: {
    width: 200, // Aumente conforme necessário
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnCell: {
    width: 200, // Deve ser o mesmo valor do cabeçalho
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },   
  columnHeaderText: {
    color: 'white', // Cor do texto do cabeçalho
  },
});

export default GerenciamentoUser;
