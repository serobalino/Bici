import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet , Text} from 'react-native';
import axios from 'axios';

const APIUrl = 'http://www.puceing.edu.ec:15000/proyectobici/api';
const dismissKeyboard = require('dismissKeyboard');


export default class Registro  extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombre: '',
            apellido: '',
            contrasena:'',
            telefono:'',
        };
        this.registro = this.registro.bind(this);
        this.login = this.login.bind(this);
    }

    login() {
        this.props.cambiarVista(1);
    }
    registro(){
        dismissKeyboard();
        if(this.state.nombre!=='' && this.state.apellido!=='' && this.state.telefono!=='' && this.state.contrasena!==''){
            axios.post(APIUrl + '/user',{
                NOMBRE: this.state.nombre,
                APELLIDO:this.state.apellido,
                TELEFONO:this.state.telefono,
                ESTADO_USO:"SI",
                PASSWORD:this.state.contrasena
            }).then((response) => {
                Alert.alert('Éxito','Se ha agregado a '+this.state.nombre);
                this.setState({ nombre:'',apellido:'',telefono:'',contrasena:''});
                this.login();
            }).catch((error) => {
                console.log(error);
                Alert.alert('Error',error);
            });
        }else{
            Alert.alert('Error','Complete el formulario para agregar un nuevo usuario');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.input}s>
                    <Text style={styles.pageTitle}>Registro</Text>
                </View>

                <TextInput
                    value={this.state.nombre}
                    onChangeText={(nombre) => this.setState({ nombre })}
                    placeholder={'NOMBRE'}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.apellido}
                    onChangeText={(apellido) => this.setState({ apellido })}
                    placeholder={'APELLIDO'}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.telefono}
                    onChangeText={(telefono) => this.setState({ telefono })}
                    placeholder={'TELËFONO'}
                    keyboardType={'phone-pad'}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.contrasena}
                    onChangeText={(contrasena) => this.setState({ contrasena })}
                    placeholder={'CONTRASEÑA'}
                    secureTextEntry={true}
                    style={styles.input}
                    onSubmitEditing={this.registro}
                />
                <View style={{width:"80%",padding:20,justifyContent:'space-between'}}>
                    <Button
                        title={'Guardar'}
                        style={styles.boton}
                        onPress={this.registro}
                    />
                    <Button
                        title={'Login'}
                        style={styles.boton}
                        onPress={this.login}
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
        borderWidth: 0,
        borderColor: 'white',
        marginBottom: 20,
    },
});
