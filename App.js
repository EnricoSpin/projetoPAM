import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  // Estados para capturar os dados do formulário
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setCarregando(false);
      });
  }, []);
  
  const adicionarUsuario = () => {
    // 1. Validação básica: verifica se algum campo está vazio
    if (!nome.trim() || !endereco.trim()) {
      Alert.alert("Atenção", "Por favor, preencha o nome e o endreço");
      return;
    }
    // 2. Criação do novo objeto de usuário
    const novoUsuario = {
      id: Date.now.toString(), //Gera um ID único baseado no timestamp atual
      name: nome,
      address: {
        street: endereco,
        suite: "",
        city: "",
      },
    };
    // 3. Atualização do estado adicionando o novo item no início do array
    setUsuarios([novoUsuario, ...usuarios]);

    // 4. Limpeza dos campos de texto do formulário
    setNome("");
    setEndereco("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sistema de Cadastro</Text>
      <Text style={styles.nomeAluno}>Aluno: Enrico Spinardi 3ºDS</Text>

      {/* Formulário de Cadastro */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Digite o Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite o Endereço"
          value={endereco}
          onChangeText={setEndereco}
        />

        <TouchableOpacity style={styles.botao} onPress={adicionarUsuario}>
          <Text style={styles.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Usuários */}
      {carregando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>{item.name}</Text>
              <Text style={styles.endereco}>
                {item.address.street}, {item.address.suite} -{" "}
                {item.address.city}
              </Text>
            </View>
          )}
          style={styles.lista}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#018d19",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#ffffff",
  },
  nomeAluno: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  lista: {
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  endereco: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 18,
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  botao: {
    height: 50,
    backgroundColor: "#047546d8",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  textoBotao: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
