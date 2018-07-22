import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet , Text} from 'react-native';
import axios from 'axios';

const APIUrl = 'http://www.puceing.edu.ec:15000/proyectobici/api';
export default class Login extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        username: '',
        password: '',
        mensaje:'Ingrese sus credenciales',
    };
      this.login = this.login.bind(this);
      this.registro = this.registro.bind(this);
  }

    login() {
        if(this.state.username!=='' && this.state.password!=='' ){
            axios.post(APIUrl + '/user?nombre='+this.state.username+'&password='+this.state.password)
                .then((response) => {
                    console.log(response.data);
                    if(response.data!=="false"){
                        this.props.setUsuario(response.data);
                        this.props.cambiarVista(3);
                    }else{
                        this.setState({
                            mensaje:"Credenciales incorrectos",
                            username:'',
                            password:'',
                        });
                    }
            }).catch((error) => {
                console.log(error);
                Alert.alert('Error',error);
            });
        }else{
            Alert.alert('Error','Complete el formulario para ingresar');
        }
    }
    registro(){
        this.props.cambiarVista(2);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.input}s>
                    <Text style={styles.pageTitle}>Bici</Text>
                    <Text>{this.state.mensaje}</Text>
                </View>

                <TextInput
                    value={this.state.username}
                    onChangeText={(username) => this.setState({ username })}
                    placeholder={'USUARIO'}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'CONTRASEÑA'}
                    secureTextEntry={true}
                    style={styles.input}
                    onSubmitEditing={this.login}
                />
                <View style={{width:"80%",padding:20,justifyContent:'space-between'}}>
                <Button
                    title={'Ingresar'}
                    style={styles.boton}
                    onPress={this.login}
                />
                <Button
                    title={'Registro'}
                    style={{width:"100%"}}
                    onPress={this.registro}
                />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 55,
    padding: 10,
    borderWidth: 0,
    borderColor: 'black',
    marginBottom: 10,
    paddingTop:15,
  },
    pageTitle: {
        color: '#000',
        fontSize: 18,
        textAlign: 'center',
    },
    boton: {
        width: "100%",
        height: 55,
        flex:2,
        padding: 100,
        borderWidth: 10,
        borderColor: 'white',
        marginBottom: 20,
    },
});
