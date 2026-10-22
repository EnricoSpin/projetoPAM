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
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [precisao, setPrecisao] = useState(''); 
  
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
      if (!nome.trim() || !latitude.trim() || !longitude.trim() || !precisao.trim()) {
        //Alert.alert
        window.alert("Atenção", "Por favor, preencha o nome e o endreço");
        return;
      }
      // 2. Criação do novo objeto de usuário
      const novoUsuario = {
        id: Date.now().toString(), //Gera um ID único baseado no timestamp atual
        name: nome,
        latitude: latitude,
        longitude: longitude,
        precisao: precisao
      };
      // 3. Atualização do estado adicionando o novo item no início do array
      setUsuarios([novoUsuario, ...usuarios]);
      
      // 4. Limpeza dos campos de texto do formulário
      setNome('');
      setLatitude('');
      setLongitude('');
      setPrecisao('')
    };
    
    const excluirUsuario = (usuario) => {
      const resposta = window.prompt(
        `Deseja realmente excluir ${usuario.name}?`
      );      
      if(resposta){
        setUsuarios((listaAtual) =>
          listaAtual.filter((item) => String(item.id) !== String(usuario.id)),
      );
    }
  };
  
  const editarUsuario = () => {
    setUsuarios((usuario) => usuario.map(setUsuarios(usuario.name, usuario.latitude, usuario.longitude, usuario.precisao)))
  };
  
  const mostarLocalizacao = (usuario) => { 
    window.alert(
      `Latitude: ${usuario.latitude}, \nLongitude: ${usuario.longitude}, \nPrecisão Estimada: ${usuario.precisao}`
    );
  };
  
  const solicitarLocalizacao = () => {
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        setLatitude(String(posicao.coords.latitude));
        setLongitude(String(posicao.coords.longitude));
        setPrecisao(String(posicao.coords.accuracy))
    
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Precisão (m):", posicao.coords.accuracy);
      },
      (erro) => {
        console.log("Não foi possível obter a localização:", erro);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sistema de Cadastro</Text>
      <Text style={styles.nomeAluno}>Alunos: Enrico e Tiago - 3ºDS</Text>

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
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
        />  
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
        />
        <TextInput
          style={styles.input}
          placeholder="Precisão Estimada"
          value={precisao}
          onChangeText={setPrecisao}
        />


          <TouchableOpacity style={[styles.botaoForm, {backgroundColor: '#044d7efd'}]} onPress={solicitarLocalizacao}>
          <Text style={[styles.textoBotao]}>Solicitar Localização</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botaoForm, {backgroundColor: '#e2541c'}]} onPress={adicionarUsuario}>
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
              <Text style={styles.outrosAlemDeNome}>Latitude: {item.latitude}</Text>
              <Text style={styles.outrosAlemDeNome}>Longitude: {item.longitude}</Text>
              <Text style={styles.outrosAlemDeNome}>Precisão Estimada: {item.precisao}</Text>

              <TouchableOpacity style={[styles.botaoView, {backgroundColor: '#1591ea'}]} onPress={() => editarUsuario()}>
                <Text style={styles.textoBotao}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botaoView, {backgroundColor: '#DC3545'}]} onPress={() => excluirUsuario(item)}>
                <Text style={styles.textoBotao}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botaoView, {backgroundColor: '#047546d8'}]} onPress={() => mostarLocalizacao(item)}>
                <Text style={styles.textoBotao}>Mostrar Localização</Text>
              </TouchableOpacity>

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
    backgroundColor: "#3f648f",
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
  outrosAlemDeNome: {
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
  botaoForm: {
    height: 50,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    margin: 5
  },
  botaoView: {
    padding: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-end",
    justifyContent: "center",
    margin: 5,
  },
  textoBotao: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
